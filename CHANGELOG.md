# Historique des modifications

Ce projet suit le format [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

## [Non publié]

### Modifié
- UI: boutons — la couleur du texte passe en noir au survol (hover). (voir `src/components/ui/Button.css`)


## [1.3.0] - 2026-01-23

### Ajouté
- **Auto-incrémentation de version au build** : 
  - Nouveau script `scripts/bump-version.js` qui incrémente automatiquement la version PATCH à chaque `npm run build`
  - Hook `prebuild` dans package.json qui appelle le script avant chaque build
  - La version est automatiquement mise à jour dans `package.json` et `InfoModal.tsx`
  - Plus besoin de mettre à jour manuellement la version (sauf pour MAJEUR/MINEUR)
- **Tests dynamiques de version** : les tests lisent la version depuis `package.json` au lieu de la hardcoder

### Modifié
- **CONTRACT.md section 12.1** : documentation de la politique d'auto-incrémentation
- **Tests InfoModal** : import de `package.json` pour lire la version dynamiquement

### Technique
- Script prebuild automatique : `npm run build` → bump version → tsc → vite build → postbuild
- Incrémentation PATCH uniquement (1.3.0 → 1.3.1 → 1.3.2...)

## [1.2.1] - 2026-01-23

### Modifié
- **Simplification du modal d'information** : affichage d'une seule date de build (statique)
  - Suppression du champ "Current Date & Time" (date dynamique)
  - Conservation du champ "Build Date & Time" uniquement (date statique capturée au build)
  - Raison : la date statique suffit pour vérifier le déploiement GitHub Pages (impossible d'obtenir la date du serveur côté client)

### Technique
- InfoModal simplifié : `buildDateTime` au lieu de `staticBuildDateTime` et `currentDateTime`
- Tests mis à jour pour refléter le changement de label

## [1.2.0] - 2026-01-23

### Ajouté
- **Date statique de build** : affichage de la date et heure exactes de création du build
  - Nouvelle ligne "Build Created On" dans le modal d'information
  - Date capturée au moment du `npm run build` et fixée dans le bundle
  - Permet de vérifier quand le build a été généré vs quand GitHub Pages a déployé
- **Date dynamique** : affichage de l'heure actuelle lors de l'ouverture du modal
  - Nouvelle ligne "Current Date & Time" qui se met à jour à chaque ouverture
  - Utile pour comparer avec la date de build statique
- **Injection de build timestamp** : configuration Vite pour injecter `__BUILD_TIMESTAMP__` au moment du build
  - Variable globale générée automatiquement à chaque build
  - Garantit que la date de build est précise et immuable dans le bundle

### Technique
- Ajout de `define: { __BUILD_TIMESTAMP__: ... }` dans vite.config.ts
- Mock de `__BUILD_TIMESTAMP__` dans vitest.setup.ts pour les tests
- Tests mis à jour pour vérifier les nouveaux labels "Build Created On" et "Current Date & Time"

## [1.1.0] - 2026-01-23

### Ajouté
- **Politique de versioning dans CONTRACT.md** : 
  - Versioning sémantique adapté (MAJEUR.MINEUR.PATCH)
  - Incréments mineurs pour chaque changement (1.0 → 1.1 → ... → 1.99)
  - Incréments majeurs pour features majeures (1.x → 2.0)
  - Synchronisation obligatoire dans package.json, InfoModal.tsx et CHANGELOG.md

### Modifié
- **Bouton d'aide** : couleur de fond changée en gris clair (#e8e8e8) pour meilleure visibilité
- **Version** : passage de 1.0.0 à 1.1.0 dans toute l'application

## [1.0.0] - 2026-01-23

### Ajouté
- **Bouton d'information dans la topbar** : 
  - Nouveau bouton avec icône point d'interrogation (IconHelp) à droite du contrôle de taille de police
  - Affiche un modal d'information avec les détails du build et du contact
- **Modal d'information (InfoModal)** :
  - Affiche la version de l'application (1.0.0)
  - **Date ET heure du dernier build** pour vérifier que GitHub Pages a déployé la dernière version
  - Dernier commit GitHub (hash court)
  - Informations de contact : Jonathan Rambeau, jonathan.rambeau@axians.com
  - Qualifications : WiFi Expert, CWNE (Certified Wireless Network Expert)
  - Employeur : Axians C&S, Lyon, France
  - Modal responsive avec design cohérent selon CHARTER.md
- **IconHelp** : nouvelle icône SVG réutilisable pour le bouton d'aide
- **Tests pour InfoModal** : 15 tests couvrant rendu, informations affichées, interactions, email link, fermeture
- **Tests complets pour TableView** :
  - TableView.test.tsx (12 tests) : rendu, sélection, highlight, colonnes pinnées, recherche, pagination
  - Test spécifique pour vérifier le highlighting des colonnes pinnées quand une ligne est sélectionnée
- **Fichier de types TypeScript pour les tests** :
  - tests/setup.d.ts : déclaration des types pour les matchers jest-dom
- **Tests complets pour composants UI critiques** :
  - Button.test.tsx (16 tests) : toutes variantes, tailles, icônes, événements
  - SearchInput.test.tsx (11 tests) : rendu, événements, clear button conditionnel
  - FontSizeControl.test.tsx (13 tests) : niveaux, localStorage, limites, reset
  - ColumnSettingsModal.test.tsx (20 tests) : modal complet, recherche, checkboxes, locked columns, drag&drop
  - App.test.tsx (9 tests) : chargement, fetch, header, erreurs
- **Tests E2E Playwright fonctionnels** :
  - basic.spec.ts (3 tests) : homepage loads, search functionality, comparison workflow
  - ✅ Tous les tests E2E passent avec Node 20 et browsers installés
- **Document TESTS_COVERAGE.md** : rapport détaillé de la couverture des tests
- **119 tests unitaires + 3 tests E2E** avec 100% de succès

### Modifié
- **Configuration Vitest** : passage de `jsdom` à `happy-dom` pour résoudre les erreurs ESM avec Node 18
- **CompareView.test.tsx** : retrait de la dépendance `react-router-dom` (non utilisée dans l'app)
- **Tests E2E** : adaptation aux sélecteurs et workflow réels de l'application
  - Correction du titre attendu : "Wi-Fi Access Point Database"
  - Correction du sélecteur de recherche : `.search-input__field`
  - Correction du workflow de comparaison : activation du mode Select puis clic sur ligne

### Corrigé
- **🎯 Highlight des lignes sélectionnées** : correction du CSS pour appliquer le background vert aux colonnes pinnées (Vendor, Model) quand une ligne est sélectionnée
  - Problème : les colonnes pinnées ne prenaient pas la couleur de sélection
  - Cause : classe CSS incorrecte (`.row-selected` au lieu de `.tr-selected`)
  - Solution : ajout de règles CSS `.ap-table tbody tr.tr-selected td.column-pinned` et `.ap-table tbody tr.tr-selectable:hover td.column-pinned`
  - Les colonnes pinnées héritent maintenant correctement du background de leur ligne parente (vert pour sélection, bleu pour hover)
- **Erreurs TypeScript dans les tests** : ajout de `beforeEach` et `afterEach` dans les imports de App.test.tsx
- **Erreurs TypeScript ColumnSettingsModal.test.tsx** : ajout des propriétés `sortable` et `filterable` dans les mock columns
- **Erreur ESM html-encoding-sniffer** : résolu par l'utilisation de happy-dom au lieu de jsdom
- **Tests E2E** : maintenant fonctionnels avec Node 20 (activé via `nvm use 20`)
- **Browsers Playwright** : installés avec `npx playwright install --with-deps chromium`

---

### Ajouté (précédent)
- **Adaptation mobile du dropdown de filtre** : offset vertical de 8px sur mobile pour éviter que le dropdown cache le champ de recherche
- **Media query mobile** : max-height réduite (300px), max-width adaptatif (100vw - 20px), border-radius ajouté

### Modifié (précédent)
- **Calcul position dropdown** : détection `window.innerWidth < 768` pour appliquer des offsets adaptés sur mobile/tablette

## [Précédent]

### Ajouté
- **Dropdown de filtre avec position fixe** : utilisation de `position: fixed` avec calcul dynamique via `getBoundingClientRect()` pour afficher le dropdown au bon endroit
- **Dropdown externe au tableau** : déplacement du dropdown en dehors de la structure `<table>` pour éviter les problèmes de validation DOM
- **État de tracking du dropdown** : ajout de `dropdownPosition` et `activeFilterColumn` pour gérer l'affichage du dropdown
- **useRef pour boutons de filtre** : tracking des références des boutons pour calcul précis de la position

### Modifié  
- **Interface FilterDropdown** : adaptation de l'utilisation pour matcher l'interface correcte avec toutes les props requises
- **Gestion des filtres** : intégration complète avec le système `columnFilters` et `handleColumnFilterChange`
- **Positionnement dropdown** : z-index 99999 pour garantir l'affichage au-dessus de tous les éléments

### Corrigé
- **Dropdown invisible** : résolu le problème où le dropdown n'apparaissait pas après modifications
- **Avertissement DOM** : suppression de l'erreur "div cannot appear as a child of table"
- **Props inutilisées** : suppression de `onToggleSelection` et `handleRowClick` non utilisés dans TableView
- **Erreur ESLint** : correction des warnings TypeScript pour variables non utilisées

## [Non publié - Précédent]

### Ajouté
- Configuration initiale du projet
- Structure de dossiers selon CONTRACT.md
- Schéma JSON pour validation des données
- Conversion YAML vers JSON pour les données réelles (105 APs multi-vendors)
- Scripts de validation et génération d'index
- Configuration Vite pour build dans /docs
- Configuration des tests (Vitest + Playwright)
- Documentation complète (README, ARCHITECTURE, PREREQUIS, CHARTER, CONTRACT)
- Détection automatique des changements de schéma de colonnes dans localStorage
- Colonnes pinnées (Vendor et Model) marquées comme immuables : non désactivables, non réordonnables
- Badge "(locked)" pour indiquer les colonnes pinnées dans le modal de paramètres
- **Filtre multi-valeurs avec checkboxes** : possibilité de cocher les valeurs spécifiques à filtrer dans chaque colonne
- **Boutons "Select All" et "Deselect All"** dans le panneau de filtre pour sélectionner/désélectionner toutes les valeurs d'un coup
- **Composant FilterDropdown réutilisable** (`/src/components/ui/FilterDropdown.tsx`) avec recherche + checkboxes
- **Fonction utilitaire `getUniqueColumnValues`** pour extraire les valeurs uniques de chaque colonne
- **Tests unitaires complets** pour FilterDropdown (18 tests) et logique de filtrage (15 tests)
- **Tests unitaires pour click-outside** (6 tests) : vérification de la fermeture du dropdown au clic extérieur, gestion du cleanup, et comportement avec plusieurs filtres
- **Padding de 5px** sur le conteneur `.th-filter` pour meilleure présentation visuelle
- **Fermeture automatique du dropdown de filtre** au clic extérieur avec cleanup proper des event listeners
- **Configuration Vitest verbose** avec reporter détaillé, timeout de 10s, et logs heap usage
- **Script `test:unit:watch`** pour développement en mode watch
- **Logs détaillés dans les tests** pour faciliter le debugging des échecs
- **Script `calculate-column-widths.js`** pour analyser les largeurs optimales basées sur les données réelles
- **Tests de validation des largeurs de colonnes** (4 tests) pour vérifier la cohérence

### Modifié
- Migration de données de test (50 entrées) vers données réelles (105 APs)
- Interface TypeScript APMachine mise à jour avec 34 champs (vendor, poe_class, serving_radio_1-4, etc.)
- Configuration des colonnes dans columns.ts pour correspondre aux nouveaux champs
- Schéma de validation JSON mis à jour pour les nouveaux champs
- Interface de filtre par colonne : remplacement des champs toujours visibles par une icône cliquable qui affiche le champ à la demande avec boutons appliquer (✓) et fermer (✕) pour désencombrer l'affichage
- **Structure de l'état `columnFilters`** : changement de `Record<string, string>` vers `Record<string, {search: string, selectedValues: Set<string>}>` pour supporter filtres multi-valeurs
- **Logique de filtrage** : priorité aux valeurs sélectionnées (checkboxes) sur la recherche textuelle
- **Style du panneau de filtre** : amélioration de la disposition pour accueillir la liste des valeurs avec scroll vertical
- **Colonnes à largeur automatique** : adaptation dynamique au contenu (sauf vendor/model)
- **Colonnes vendor et model** : largeur fixe 156px pour compatibilité sticky/pinned
- **text-overflow: ellipsis** sur les cellules avec max-width 500px et tooltip (title attribute)
- **white-space: nowrap** sur th et td pour empêcher le retour à la ligne
- **Marges et coins arrondis** : padding 12px et border-radius 8px sur le tableau pour un design moderne
- **Topbar grise légère** : fond #f6f8fa avec ombre subtile pour un design épuré
- **Titre de l'application** : "Wi-Fi Access Point Database" avec auteur "by Jonathan Rambeau" en gris clair
- **Design CompareView inspiré Apple** : interface épurée, moins de bordures, séparateurs subtils (#f9fafb background)
- **Header AP dans CompareView** : croix de suppression en absolute top-right (bouton circulaire hover), model/vendor centrés en gris clair
- **Couleur de sélection uniforme** : #e8f5e9 (vert clair) sur toutes les colonnes (pinned et non-pinned)
- **Lien auteur** : clic sur "by Jonathan Rambeau" redirige vers https://www.networkjon.fr
- **Transition hover** : ajout de transition smooth sur les colonnes pinned pour cohérence visuelle
- **Nettoyage du code** : suppression de 6 fichiers temporaires/backup (App 2.css, *.backup, scripts deprecated)
- **Nettoyage de l'arborescence** : suppression des dossiers vides hooks/ et workers/ (optionnels per CONTRACT)
- **Documentation JSDoc** : ajout de commentaires complets sur tous les composants principaux (TableView, CompareView, FilterDropdown, App, utils)
- **Hover de ligne complète dans CompareView** : au survol d'une cellule, toute la ligne (label + toutes les colonnes AP) s'illumine avec transition 0.15s
- **Responsive mobile** : colonnes pinned désactivées sur écrans < 768px pour meilleur scroll horizontal
- **Filtres responsive mobile** : dropdown en modal centré fixe avec box-shadow, max-width 90vw, overflow-y auto
- **Champ de recherche visible sur mobile** : ajout padding et overflow-y:auto sur FilterDropdown pour garantir visibilité du champ de recherche
- **Export CSV page principale** : bouton dans toolbar pour exporter les APs filtrées/triées avec colonnes visibles uniquement
- **Chemin données GitHub Pages** : utilisation de import.meta.env.BASE_URL pour chargement correct sur GitHub Pages
- **Contrôle taille de police fonctionnel** : boutons A-/A+ actifs avec 5 niveaux (-2 à +2), sauvegardé dans localStorage

### Corrigé
- Import TypeScript de DragEndEvent (utilisation de `import type`)
- Erreur de propriété `manufacturer` dans CompareView (remplacé par `vendor`)
- CSS des colonnes pinnées : z-index et position sticky corrigés pour scroll horizontal et vertical simultanés
- Ordre des colonnes pinnées inversé : Vendor (1ère colonne, left:0), puis Model (2ème colonne, left:156px)
- Positions CSS sticky ajustées pour correspondre aux largeurs réelles des colonnes (156px pour Vendor et Model)
- **Colonnes pinnées héritent des couleurs de hover/sélection** : les colonnes vendor et model changent de couleur avec le reste de la ligne au survol et à la sélection
- Ombre visuelle ajoutée après la dernière colonne pinnée pour meilleure UX
- Logique d'ordre des colonnes forcée : les colonnes pinnées (Vendor, Model) sont TOUJOURS en premier, même après modification du localStorage ou réordonnancement utilisateur
- Largeurs des colonnes pinnées fixées avec min-width et max-width pour éviter le redimensionnement automatique et garantir l'alignement sticky correct
- Titres des colonnes : ajout de white-space: nowrap pour empêcher le retour à la ligne et améliorer l'alignement
- Filtre par colonne : transformation en dropdown overlay (position absolute) pour ne pas agrandir la hauteur des en-têtes
- Fermeture automatique des filtres au clic extérieur pour meilleure ergonomie
- Icône de filtre active : style visuel distinct (bleu et gras) quand un filtre est appliqué sur la colonne
- Max-width des cellules augmenté de 300px à 500px pour afficher les titres de colonnes complets sans troncature
- **Débordement de la searchbar** : ajout de `min-width: 0` sur le champ de recherche pour empêcher le débordement
- **Taille du conteneur de filtre** : suppression des contraintes `right: 0`, `width`, `padding` et `gap` sur `.th-filter` pour qu'il s'adapte automatiquement à la taille du composant `FilterDropdown` (min-width: 250px, max-width: 400px)
- **Padding du conteneur de filtre** : ajout de `padding: 5px` sur `.th-filter` pour espacer visuellement le dropdown du bord de son conteneur
- **Champ recherche invisible sur mobile** : ajout overflow-y:auto et padding sur FilterDropdown mobile pour que le champ de recherche reste visible et accessible
- **ESLint Date.now()** : remplacement de Date.now() par Date.toISOString() pour conformité React purity rules

## [1.0.0] - 2026-01-20

### Ajouté
- Version initiale du Catalogue AP Wifi
- Tableau virtualisé avec colonnes pinnées
- Recherche globale avec FlexSearch
- Système de pagination
- Panel de comparaison (jusqu'à 4 AP)
- Export CSV
- Menu contextuel pour filtres
- Interface responsive
- Thème GitHub light
- Déploiement GitHub Pages

---

## Types de modifications
- **Ajouté** : nouvelles fonctionnalités
- **Modifié** : changements dans les fonctionnalités existantes
- **Déprécié** : fonctionnalités bientôt supprimées
- **Supprimé** : fonctionnalités supprimées
- **Corrigé** : corrections de bugs
- **Sécurité** : vulnérabilités corrigées
