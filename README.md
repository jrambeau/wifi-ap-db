# Wi-Fi Access Points Database

Application web de gestion et comparaison de points d'accès WiFi.

🌐 En production : [ap.networkjon.fr](https://ap.networkjon.fr)

## Description

Single Page Application (SPA) développée en React + Vite + TypeScript permettant de :
- Lister et filtrer ~2k-5k points d'accès WiFi
- Recherche globale et par colonne avec indexation FlexSearch
- Comparer jusqu'à 4 AP côte à côte
- Exporter les données en CSV
- Interface responsive et accessible

## Quick Start

### Prérequis
- Node.js 20 LTS ou supérieur (cf. `.nvmrc`)
- npm 10 ou supérieur

### Installation

```bash
# Cloner le repository
git clone https://github.com/jrambeau/wifi-ap-db.git
cd wifi-ap-db

# Utiliser la bonne version de Node
nvm use

# Installer les dépendances
npm ci

# Valider les données et générer l'index de recherche
npm run validate-data
npm run generate-index

# Lancer le serveur de développement
npm run dev
```

### Build pour production

```bash
# Build complet (génère dans /dist)
npm run build

# Preview local du build
npm run preview   # http://localhost:4173
```

## Tests

```bash
npm run test:unit   # Tests unitaires (Vitest)
npm run test:e2e    # Tests e2e (Playwright)
npm test            # Tous les tests
```

## Déploiement

Le déploiement est **automatique via GitHub Actions** ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)).

À chaque push sur `main`, le workflow build l'application et la publie sur GitHub Pages. Le dossier `dist/` n'est **pas** commité (il est généré en CI).

> **Configuration GitHub (une seule fois)** : Settings → Pages → Source → **GitHub Actions**.

Le domaine personnalisé `ap.networkjon.fr` est servi via le fichier [public/CNAME](public/CNAME), copié automatiquement dans le build.

## Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production (dans `dist/`)
- `npm run preview` - Preview du build
- `npm run generate-index` - Générer l'index de recherche
- `npm run validate-data` - Valider `machines.json`
- `npm run export-csv` - Exporter les données en CSV
- `npm test` - Lancer tous les tests
- `npm run lint` - Linter le code
- `npm run format` - Formatter le code
- `npm run audit` - Audit de sécurité npm

## Comment contribuer des données

1. Télécharger le template : [machines-template.csv](public/template/machines-template.csv)
2. Remplir le fichier CSV selon le schéma défini
3. Valider localement : `npm run validate-data`
4. Ouvrir une Pull Request avec le fichier modifié

La source de vérité des données est **`public/data/machines.json`** (et son index `public/data/index.json`).

## Documentation

La documentation détaillée se trouve dans [`docs/`](docs/) :

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Architecture détaillée
- [PREREQUIS.md](docs/PREREQUIS.md) - Prérequis, installation, conventions Git
- [CHARTER.md](docs/CHARTER.md) - Charte graphique
- [CHANGELOG.md](docs/CHANGELOG.md) - Historique des modifications

## Licence

Propriétaire - Tous droits réservés
