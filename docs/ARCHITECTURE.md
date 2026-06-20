# Architecture - Catalogue AP Wifi

## Vue d'ensemble

Application Single Page Application (SPA) front-only construite avec React, Vite et TypeScript. Déployée sur GitHub Pages, elle permet de consulter, filtrer, rechercher et comparer des points d'accès WiFi.

### Principe fondamental

**Pas de backend** : toutes les données sont statiques et versionnées dans le repository. Les modifications se font exclusivement par commits/PR sur le fichier `public/data/machines.json`.

## Stack technique

- **Framework**: React 18.3
- **Build tool**: Vite 7.x
- **Language**: TypeScript 5.9
- **Routing**: React Router DOM 6.x
- **Virtualisation**: React Window
- **Recherche**: FlexSearch
- **Tests**: Vitest + Playwright
- **Linting**: ESLint 9
- **Formatting**: Prettier 3

## Architecture des données

### Format canonique

**Fichier source**: `public/data/machines.json`

Structure :
```json
[
  {
    "id": "string (unique)",
    "model": "string",
    "manufacturer": "string",
    "frequency": "2.4 GHz | 5 GHz | 6 GHz | 2.4/5 GHz | 2.4/5/6 GHz | 5/6 GHz",
    "wifi_standard": "string",
    "max_clients": number,
    "throughput_mbps": number,
    "antenna_count": number,
    "antenna_type": "Internal | External | Mixed",
    "power_w": number,
    "poe_type": "string",
    "ethernet_ports": number,
    "ethernet_speed": "string",
    "mounting": "string",
    "indoor_outdoor": "Indoor | Outdoor | Both",
    "dimensions": "string",
    "weight_kg": number,
    "operating_temp": "string",
    "ip_rating": "string",
    "mimo": "string",
    "mu_mimo": boolean,
    "beamforming": boolean,
    "mesh_capable": boolean,
    "management_system": "string",
    "price_eur": number,
    "warranty_years": number
  }
]
```

### Validation des données

- **Schéma**: `schemas/machines.schema.json` (JSON Schema v7)
- **Validation**: script `npm run validate-data` utilisant AJV
- Toute modification de `machines.json` DOIT passer la validation avant commit

### Index de recherche

**Fichier généré**: `public/data/index.json`

- Généré au build via `npm run generate-index`
- Utilise FlexSearch Document index
- Indexe les champs : model, manufacturer, frequency, wifi_standard, antenna_type, poe_type, mounting, indoor_outdoor, management_system, ethernet_speed, mimo
- Permet recherche ultra-rapide côté client (même sur 5k+ entrées)

## Architecture applicative

### Structure des dossiers

```
/src
├── /components
│   ├── /ui           # Composants réutilisables (Button, Input, Icon...)
│   ├── /table        # Composants du tableau (Table, Row, Cell, Pinned)
│   ├── /compare      # Panel de comparaison
│   └── /icons        # Icônes SVG
├── /hooks            # Custom hooks React
├── /workers          # Web Workers (index search fallback)
├── /styles
│   ├── tokens.css    # Variables CSS (couleurs, spacing, typo)
│   └── layout.css    # Layouts globaux
├── /utils
│   ├── csv.ts        # Export CSV
│   ├── sanitize.ts   # Sanitization HTML
│   └── schema.ts     # Validation schéma
├── main.tsx          # Point d'entrée
└── app.tsx           # Composant racine avec routing
```

### Flux de données

```
machines.json (source)
    ↓
generate-index.js (build time)
    ↓
index.json (FlexSearch export)
    ↓
App charge au runtime
    ↓
État React (useState/useContext)
    ↓
Composants (Table, Compare, etc.)
```

### Gestion de l'état

- **État local**: useState pour UI simple
- **État global**: Context API pour :
  - Données machines chargées
  - Index de recherche
  - Colonnes visibles
  - Sélection pour comparaison
  - Filtres actifs
  - État pagination

Pas de Redux/Zustand : l'état est suffisamment simple pour Context API.

## Composants principaux

### Table Component

**Responsabilité**: Afficher la liste des AP avec virtualisation

**Fonctionnalités**:
- Virtualisation avec react-window (FixedSizeList)
- Colonnes sticky (2 premières colonnes)
- Tri par colonne
- Sélection pour comparaison (max 4)
- Menu contextuel (clic droit sur cellule)

**Performance**:
- Rendu uniquement des lignes visibles (virtualisation)
- Mémoïsation avec React.memo sur Row/Cell
- Pas de re-render inutile grâce à useMemo/useCallback

### Search Component

**Responsabilité**: Recherche globale et par colonne

**Implémentation**:
1. Chargement de l'index FlexSearch depuis `public/data/index.json`
2. Si index absent : construction dynamique via Web Worker
3. Recherche instantanée avec debounce (300ms)
4. Filtres cumulatifs (search + filtres colonne)

**Performance**:
- FlexSearch = recherche < 50ms même sur 5k entrées
- Web Worker pour éviter blocage UI si build index côté client

### Compare Panel

**Responsabilité**: Comparer jusqu'à 4 AP côte à côte

**UI**:
- Desktop: grid 4 colonnes, features en lignes
- Mobile: scroll horizontal ou accordéon
- Highlight des différences

### Export Component

**Responsabilité**: Export CSV des données affichées/sélectionnées

**Implémentation**:
- Utilise csv-stringify (côté client)
- Export selon filtres actifs OU sélection compare
- Download automatique via Blob + createObjectURL

## Performance

### Optimisations implémentées

1. **Virtualisation**: Seules ~20-30 lignes rendues simultanément (react-window)
2. **Index de recherche**: FlexSearch pré-généré au build
3. **Code splitting**: React.lazy() pour routes Compare, Export
4. **Mémoïsation**: React.memo sur composants lourds
5. **Debounce**: sur recherche et filtres
6. **CSS optimisé**: tokens CSS pour éviter re-calculation

### Métriques cibles

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Recherche**: < 100ms (même 5k entrées)
- **Scroll table**: 60 FPS constant

## Sécurité

### Mesures implémentées

1. **Pas de secrets**: Aucun token/clé dans le code ou repo
2. **CSP**: Content Security Policy dans meta tags
3. **Sanitization**: Toutes les données user-generated échappées
4. **SRI**: Subresource Integrity pour CDN (si utilisé)
5. **npm audit**: Exécuté avant chaque build
6. **Dependencies**: Versions lockées (package-lock.json committé)

### CSP Policy (recommandée)

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:; 
               font-src 'self';">
```

### Limitations connues

- **DDOS**: GitHub Pages sans CDN = vulnérable à trafic massif
  - Mitigation possible: Cloudflare en frontal (optionnel)
- **Pas d'auth**: Site public, pas de contrôle d'accès

## Build et déploiement

Le déploiement est **automatisé via GitHub Actions**
([.github/workflows/deploy.yml](../.github/workflows/deploy.yml)). Le build
n'est pas commité : il est généré en CI à chaque push sur `main` et publié sur
GitHub Pages.

### Workflow développeur

```
1. npm ci                    # Install dependencies
2. npm run validate-data     # Validate machines.json
3. npm run generate-index    # Generate search index
4. npm run lint              # Lint code
5. npm test                  # Run all tests
6. npm run build             # Build to /dist (vérification locale)
7. npm run preview           # Verify locally
8. git commit -m "..."       # Commit (sans dist/)
9. git push origin main      # Déclenche le déploiement CI
```

### Pipeline CI (GitHub Actions)

```
push sur main
    ↓
job build : npm ci → validate-data → npm run build (→ dist/)
    ↓
upload-pages-artifact (dist/)
    ↓
job deploy : actions/deploy-pages → GitHub Pages
```

### Configuration GitHub Pages

- **Source**: GitHub Actions (Settings → Pages → Source)
- **Base path**: `./` (configuré dans `vite.config.ts`)
- **Domaine custom**: `ap.networkjon.fr` via `public/CNAME` (copié dans le build)
- **`.nojekyll`**: `public/.nojekyll`, copié automatiquement par Vite

## Tests

### Tests unitaires (Vitest)

**Couverts**:
- Composants UI (Button, Input, Icon)
- Utils (csv, sanitize, validation)
- Hooks personnalisés
- Logique de recherche

**Configuration**: vitest.config.ts
**Seuil**: > 70% coverage

### Tests e2e (Playwright)

**Scénarios**:
1. Navigation de base
2. Recherche globale
3. Recherche par colonne
4. Pagination
5. Sélection pour comparaison (max 4)
6. Export CSV
7. Menu contextuel
8. Responsive mobile

**Configuration**: playwright.config.ts
**Browsers**: Chromium (CI), + Firefox/Safari (local)

## Extensibilité

### Ajouter une colonne

1. Modifier `schemas/machines.schema.json`
2. Ajouter le champ dans `machines.json`
3. Mettre à jour `src/config/columns.ts`
4. Regénérer index si colonne searchable
5. Mettre à jour CHANGELOG.md

### Ajouter une fonctionnalité

1. Créer composants dans /src/components
2. Ajouter tests unitaires dans /tests/unit
3. Ajouter tests e2e si pertinent
4. Mettre à jour ARCHITECTURE.md
5. Mettre à jour CHANGELOG.md

### Migration future backend

Si besoin d'un backend plus tard :
- API REST pour CRUD sur machines
- Auth layer (OAuth, JWT)
- Database (PostgreSQL recommended)
- Garder le front actuel, remplacer data loading

**Important**: Toute migration majeure nécessite mise à jour de ce document et validation admin.

## Décisions d'architecture

### Pourquoi FlexSearch ?

- Ultra-rapide (< 50ms sur 5k entrées)
- Export/import d'index (pré-génération possible)
- Léger (~10KB gzipped)
- Support recherche phonétique et fuzzy

### Pourquoi React Window ?

- Virtualisation simple et performante
- Léger comparé à react-virtualized
- Maintenu activement
- Compatible React 18

### Pourquoi pas de state management library ?

- État relativement simple
- Context API suffisant
- Évite dépendance supplémentaire
- Performance adéquate pour notre use case

### Pourquoi Vite ?

- Build ultra-rapide (HMR instantané)
- Configuration minimale
- Support TypeScript natif
- Output optimisé pour production

## Diagrammes

### Diagramme de flux utilisateur

```
User opens app
    ↓
Load machines.json + index.json
    ↓
Display table (paginated, virtualized)
    ↓
User actions:
    - Search → Filter results → Update table
    - Click column header → Sort → Update table
    - Select row → Add to compare (max 4)
    - Right-click cell → Context menu → Add filter
    - Navigate to Compare → Display comparison grid
    - Export → Generate CSV → Download
```

### Diagramme de composants

```
App (routing)
  ├── Layout (topbar, main)
  │   ├── TopBar (search, filters, theme toggle)
  │   └── Main
  │       ├── Route: / → TableView
  │       │   ├── SearchBar
  │       │   ├── FilterPanel
  │       │   ├── Table (virtualized)
  │       │   │   ├── Row (memo)
  │       │   │   └── Cell (memo)
  │       │   ├── Pagination
  │       │   └── ContextMenu
  │       ├── Route: /compare → CompareView
  │       │   └── CompareGrid
  │       └── Route: /export → ExportView
  └── Providers
      ├── DataProvider (machines, index)
      ├── FilterProvider (filters, search)
      └── SelectionProvider (compare selection)
```

## Limitations et contraintes

### Limitations actuelles

1. **Pas d'édition en ligne**: Toute modification nécessite commit/PR
2. **Pas d'auth**: Site public, pas de restriction d'accès
3. **Scalabilité**: GitHub Pages = limite bande passante
4. **Pas de temps réel**: Données statiques, pas de live updates

### Contraintes techniques

- **Taille fichier machines.json**: Recommandé < 5MB (performance)
- **Nombre d'entrées**: Optimisé jusqu'à 10k entrées
- **Navigateurs supportés**: Dernières versions Chrome, Firefox, Safari, Edge

## Monitoring et analytics

### Pas de tracking actuel

Possibilité d'ajouter (optionnel) :
- Google Analytics 4 (respecter RGPD)
- Plausible Analytics (privacy-friendly)
- Simple access logs via GitHub Pages

**Décision**: À valider avec admin selon besoins et politique confidentialité.

---

**Version**: 1.0  
**Dernière mise à jour**: 2026-01-20  
**Auteur**: acstln
