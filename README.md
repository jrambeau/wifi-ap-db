# Catalogue AP Wifi

Application web de gestion et comparaison de points d'accès WiFi.

## Description

Single Page Application (SPA) développée en React + Vite + TypeScript permettant de :
- Lister et filtrer ~2k-5k points d'accès WiFi
- Recherche globale et par colonne avec indexation FlexSearch
- Comparer jusqu'à 4 AP côte à côte
- Exporter les données en CSV
- Interface responsive et accessible

## Quick Start

### Prérequis
- Node.js 20 LTS ou supérieur
- npm 10 ou supérieur

### Installation

```bash
# Cloner le repository
git clone <repo-url>
cd apspec

# Installer les dépendances
npm ci

# Valider les données
npm run validate-data

# Générer l'index de recherche
npm run generate-index

# Lancer le serveur de développement
npm run dev
```

### Build pour production

```bash
# Build complet (génère dans /docs)
npm run build

# Preview local du build
npm run preview
```

Le site est accessible sur `http://localhost:4173` après le build.

## Tests

```bash
# Tests unitaires
npm run test:unit

# Tests e2e
npm run test:e2e

# Tous les tests
npm test
```

## Déploiement sur GitHub Pages

Le projet est configuré pour être déployé sur GitHub Pages depuis la branche `main` avec le dossier `/docs`.

### Procédure manuelle :

1. Vérifier la checklist avant déploiement (voir [PREREQUIS.md](PREREQUIS.md))
2. Exécuter le build local : `npm run build`
3. Vérifier localement : `npm run preview`
4. Commit le dossier `/docs` : `git add docs && git commit -m "Build production"`
5. Push sur main : `git push origin main`
6. Configurer GitHub Pages : Settings → Pages → Branch: main, Folder: /docs

## Structure du projet

Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour la documentation complète de l'architecture.

## Scripts disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Preview du build
- `npm run generate-index` - Générer l'index de recherche
- `npm run validate-data` - Valider machines.json
- `npm run export-csv` - Exporter les données en CSV
- `npm test` - Lancer tous les tests
- `npm run lint` - Linter le code
- `npm run format` - Formatter le code
- `npm run audit` - Audit de sécurité npm
- pour utiliser node 20 > `nvm use 20`

## Comment contribuer des données

1. Télécharger le template : [machines-template.csv](public/template/machines-template.csv)
2. Remplir le fichier CSV selon le schéma défini
3. Valider localement : `npm run validate-data`
4. Ouvrir une Pull Request avec le fichier modifié

Ou contacter l'administrateur du projet pour soumettre vos données.

## Documentation

- [CONTRACT.md](CONTRACT.md) - Contrat de développement (référence impérative)
- [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture détaillée
- [PREREQUIS.md](PREREQUIS.md) - Prérequis et installation
- [CHARTER.md](CHARTER.md) - Charte graphique
- [CHANGELOG.md](CHANGELOG.md) - Historique des modifications

## Licence

Propriétaire - Tous droits réservés

## Auteur

acstln - Axians

import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
