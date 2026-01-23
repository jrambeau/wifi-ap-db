# Configuration Node.js 20 pour le projet

## Problème
Le projet nécessite Node.js 20+ mais Node 18 peut être actif par défaut via nvm.

## Solution 1 : Utiliser Node 20 pour ce projet uniquement

### Via fichier .nvmrc (recommandé)
Le fichier `.nvmrc` à la racine du projet spécifie Node 20 :
```bash
cd /Users/acas/Documents/dev/Axians/apspec
nvm use
```

Cette commande lit automatiquement le fichier `.nvmrc` et active la version spécifiée.

### Automatiser avec le shell
Ajoutez ceci à votre `~/.zshrc` (ou `~/.bashrc`) :
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

Après avoir ajouté ceci et rechargé le shell (`source ~/.zshrc`), nvm changera automatiquement de version en entrant dans le dossier.

## Solution 2 : Définir Node 20 comme version par défaut

Si vous voulez utiliser Node 20 par défaut partout :
```bash
nvm alias default 20
```

## Solution 3 : Désinstaller Node 18 (non recommandé)

Si vous n'avez plus besoin de Node 18 :
```bash
nvm uninstall 18
```

⚠️ **Attention** : Vérifiez d'abord qu'aucun autre projet ne nécessite Node 18.

## Vérification

Après configuration :
```bash
cd /Users/acas/Documents/dev/Axians/apspec
node --version  # Devrait afficher v20.x.x
npm test        # Tous les tests devraient passer
```

## Pour ce projet spécifiquement

Pour les tests E2E Playwright, Node 20 est **obligatoire** car Vite nécessite Node 20.19+.

Une fois Node 20 actif dans le projet :
```bash
npm test           # Lance tous les tests (107 unit + 3 e2e)
npm run test:unit  # Uniquement tests unitaires
npm run test:e2e   # Uniquement tests E2E
```
