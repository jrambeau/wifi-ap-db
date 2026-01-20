# Historique des modifications

Ce projet suit le format [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).

## [Non publié]

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
