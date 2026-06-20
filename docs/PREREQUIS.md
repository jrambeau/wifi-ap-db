# Prérequis et Installation

## Versions requises

### Node.js et npm
- **Node.js**: 20.0.0 ou supérieur (LTS recommandé)
- **npm**: 10.0.0 ou supérieur

Vérifier les versions installées :
```bash
node -v  # Doit afficher v20.x.x ou supérieur
npm -v   # Doit afficher 10.x.x ou supérieur
```

### Installation de Node.js

#### Via nvm (recommandé)
```bash
# Installer nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Installer Node 20 LTS
nvm install 20
nvm use 20
nvm alias default 20
```

#### Via téléchargement direct
Télécharger depuis [nodejs.org](https://nodejs.org/)

#### Bascule automatique de version avec nvm

Le fichier `.nvmrc` à la racine épingle Node 20. `nvm use` lit ce fichier
automatiquement. Pour basculer la version en entrant dans le dossier, ajoutez
ce hook à votre `~/.zshrc` :

```bash
# Auto-switch node version avec nvm
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")
    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

## Installation du projet

### Première installation

```bash
# Cloner le repository
git clone <repo-url>
cd wifi-ap-db

# Installer les dépendances (utilise package-lock.json)
npm ci

# Valider les données
npm run validate-data

# Générer l'index de recherche
npm run generate-index
```

### Installation pour développement

```bash
# Installation complète avec dev dependencies
npm install

# Installer Playwright browsers (pour tests e2e)
npx playwright install
```

## Commandes de développement

### Développement

```bash
# Lancer le serveur de développement
npm run dev
# Accessible sur http://localhost:5173
```

### Build et preview

```bash
# Build de production
npm run build

# Preview du build local
npm run preview
# Accessible sur http://localhost:4173
```

### Tests

```bash
# Tests unitaires (Vitest)
npm run test:unit

# Tests unitaires en mode watch
npm run test:unit -- --watch

# Tests e2e (Playwright)
npm run test:e2e

# Tests e2e en mode UI
npm run test:e2e -- --ui

# Tous les tests
npm test
```

### Qualité de code

```bash
# Linter
npm run lint

# Formattage
npm run format

# Audit de sécurité
npm run audit
```

### Scripts de données

```bash
# Valider machines.json contre le schéma
npm run validate-data

# Générer l'index de recherche
npm run generate-index

# Exporter les données en CSV
npm run export-csv
```

## Checklist avant déploiement

Le déploiement est automatique : un push sur `main` déclenche le workflow
GitHub Actions qui build et publie sur GitHub Pages. Avant de pusher :

- [ ] `npm ci` - Installation propre des dépendances
- [ ] `npm run lint` - Pas d'erreurs de linting
- [ ] `npm run test` - Tous les tests passent
- [ ] `npm run validate-data` - Données valides
- [ ] `npm run generate-index` - Index généré (si données modifiées)
- [ ] `npm run build` - Build réussi en local
- [ ] `npm run preview` - Vérification locale du build
- [ ] Mettre à jour `CHANGELOG.md`
- [ ] Commit et push sur `main`

## Conventions Git

### Commits

Format recommandé :
```
type(scope): message

feat(table): ajout colonne tri par prix
fix(search): correction recherche accents
docs(readme): mise à jour installation
```

Types :
- `feat`: nouvelle fonctionnalité
- `fix`: correction de bug
- `docs`: documentation
- `style`: formatage, style
- `refactor`: refactoring
- `test`: ajout/modification tests
- `chore`: tâches diverses (build, config)

### Branches

- `main`: branche de production (protected)
- `develop`: branche de développement
- `feature/nom-feature`: nouvelles fonctionnalités
- `fix/nom-bug`: corrections de bugs

## Dépannage

### Erreur "Module not found"

```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreur de build Vite

```bash
# Nettoyer le cache Vite
rm -rf node_modules/.vite
npm run build
```

### Tests e2e échouent

```bash
# Réinstaller les browsers Playwright
npx playwright install --force
```

### Erreur de version Node

```bash
# Vérifier la version
node -v

# Si < 20, installer la bonne version via nvm
nvm install 20
nvm use 20
```

## Environnement de développement recommandé

### VS Code

Extensions recommandées :
- ESLint
- Prettier - Code formatter
- TypeScript Vue Plugin (Volar)
- Playwright Test for VSCode

### Configuration VS Code

Créer `.vscode/settings.json` :
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Support

Pour toute question ou problème :
- Consulter [ARCHITECTURE.md](ARCHITECTURE.md)
- Ouvrir une issue sur GitHub
