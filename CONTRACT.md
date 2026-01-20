# CONTRAT DE DÉVELOPPEMENT — Application "Catalogue AP Wifi"
Version : 1.0  
Date : 2026-01-20  
Auteur : acstln (spécifications fournies) — Contrat à respecter scrupuleusement par l'IA de développement

---

But : ce document est le "contrat" impératif que l'IA de développement doit lire et appliquer AVANT et DURANT toute tâche de développement. L'IA doit relire ce fichier à chaque prompt lié au développement et vérifier que tout nouveau code / nouvelle modification respecte TOUT ce qui suit. Rien ne doit être omis.

Sommaire
- Objectif et périmètre
- Contraintes générales
- Architecture / arborescence obligatoire du repo
- Fichiers .md obligatoires
- Spécifications fonctionnelles détaillées (features)
- Comportement exact attendu (UX / UI)
- Données / format canonique et gestion des modifications
- Processus de build / déploiement local (sans Actions)
- Tests & Qualité
- Sécurité (obligatoire)
- Politique de dépendances & versions
- Exigences d'extensibilité / réutilisabilité
- Checklist à exécuter AVANT tout push sur main (procédure manuelle)
- Exemple de scripts npm exigés
- Exemples de schéma JSON pour machines.json
- Règles de livraison, changelog et gestion des modifications
- Annexes (méthodes recommandées, notes sur limitations)

---

1) Objectif et périmètre
- Construire une Single Page Application (SPA) front-only (React + Vite + TypeScript) publiée sur GitHub Pages à partir de la branche `main`. Aucun backend, aucune API d'écriture publique, toutes les modifications de données se font par commit/PR manuel dans le repo (fichier canonical JSON).
- Le site public doit permettre de lister, filtrer, rechercher, comparer et exporter des AP Wifi (≈ 2k–5k entrées, ~25 champs par entrée).
- Tout ce qui suit est CONTRAIGNANT : l'IA doit s'assurer que chaque élément listé est respecté.

2) Contraintes générales et non-fonctionnelles
- Stack tech : React + Vite + TypeScript (Node 18 LTS + npm). Le projet utilise npm et commitera `package-lock.json`.
- Pas de backend : aucune fonctionnalité d'écriture depuis le front vers le repo ou vers un service cloud. Les ajouts/modifs se font via commits/PRs.
- Déploiement simple : build local, commit du résultat dans `main` (voir section build).
- Publicité et confidentialité : le site est public. Aucune donnée sensible/clé secrète ne doit être présente dans le repo ou dans le code client.
- Performance : application fluide sur desktop et mobile. Temps de chargement initial réduit (<2s idéal sur connexion moyenne). Pagination, virtualisation et index de recherche sont obligatoires pour performance.
- Accessibilité & responsive : UI responsive et tests basiques d'accessibilité (contraste, taille police ajustable).

3) Architecture / Arborescence obligatoire du repo
Le repo doit suivre impérativement cette structure (les noms de dossiers/fichiers ne doivent pas être modifiés sans mise à jour simultanée de CONTRACT.md et architecture.md) :

- README.md
- CONTRACT.md (ce fichier)
- CHANGELOG.md
- ARCHITECTURE.md
- CHARTER.md (charte graphique et ressources réutilisables)
- PREREQUIS.md (installation, versions, commandes)
- /src
  - /components
    - /ui (buttons, topbar, inputs, table cells, context-menu, etc.)
    - /table (table core, row, cell, pin-logic)
    - /compare (compare panel)
    - /icons (SVG réutilisables)
  - /hooks
  - /workers (web worker code)
  - /styles
    - tokens.css (CSS variables thème)
    - layout.css
  - /utils (csv, export, sanitize, schema validation)
  - main.tsx
  - app.tsx
- /public
  - index.html (meta og tags, CSP meta placeholder)
  - og-image.png (image partagée)
  - favicon.ico
  - /data
    - machines.json (canonical)
  - .nojekyll
- /docs (OPTIONNEL : documentation buildée)
- /tests
  - /unit
  - /e2e
- package.json
- package-lock.json
- tsconfig.json
- vitest.config.ts
- playwright.config.ts
- .eslintrc.*, .prettierrc
- .github (OPTIONNEL si on utilise Actions plus tard, mais pour l'instant vide)
- scripts obligatoires mentionnés dans package.json (voir plus bas)

Remarques :
- Tous les composants UI (boutons, icônes, topbar...) doivent être dans /src/components/ui et réutilisables. Aucune duplication de SVG/markup.
- Les styles doivent reposer sur CSS variables (tokens) dans /src/styles/tokens.css pour permettre modification globale très facilement.

4) Fichiers .md obligatoires (contenu minimal requis)
- README.md : description du projet, quick start, commande build, comment déployer manuellement sur GitHub Pages (push /docs ou racine selon configuration).
- PREREQUIS.md : Node 18 LTS, npm version compatible, commandes, conventions git, checklists.
- ARCHITECTURE.md : architecture détaillée, diagrammes (textuels), justification de décisions (index search, virtualisation), où se trouve chaque responsabilité, schéma data, workflow local build -> push.
- CONTRACT.md : ce fichier (obligatoire).
- CHANGELOG.md : modèle Keep a Changelog, chaque modification doit être enregistrée.
- CHARTER.md : charte graphique (thème “GitHub light”), tokens couleurs, typographie, espacement, composants standards, emplacement des assets (icons, images, csv template).
- GUIDES/TESTING.md (ou inclus dans PREREQUIS.md) : comment lancer tests, seuils requis, comment ajouter tests pour nouvelle feature.

L'IA doit générer (si absent) des templates vides pour chacun de ces fichiers à la première mise en place du repo.

5) Spécifications fonctionnelles détaillées (exigences impératives)
Chaque point suivant est contraignant ; l'IA doit implémenter ou produire tests/guide qui vérifient la conformité.

5.1 Tableau principal
- Affiche la liste des AP depuis `public/data/machines.json`.
- Les deux premières colonnes sont "pinnées" (sticky) en colonne de gauche : CSS `position: sticky; left: 0/…` et gérées par la table logic. Doit rester visible lors du scroll horizontal.
- Virtualisation obligatoire (ex : react-window / react-virtual) pour éviter rendu DOM massif.
- Le tableau doit pouvoir afficher les lignes colorées (ligne sélectionnée pour comparaison). Sélection se fait via un bouton `Select` sur la ligne (aucune checkbox obligatoire).
- Clic droit sur une cellule : ouvrir un menu contextuel permettant `Filter = valeur` ou `Filter != valeur`. Ce menu doit être accessible via clavier ou touche longue mobile.
- Colonnes dynamiques : bouton/contrôle `Columns` pour activer/désactiver l'affichage de colonnes (mode "mist" demandé). Liste de colonnes stockée en configuration (localStorage pour pref UI).

5.2 Recherche & Filtres
- Recherche globale : champ unique qui recherche sur l'ensemble des champs pertinents. La recherche doit opérer sur l'ensemble des données (pas seulement la page courante).
- Recherche par colonne : possibilité d'ouvrir une recherche ciblée par colonne (champ dédié en en-tête ou panneau filtre).
- Implémentation recommandée : index FlexSearch (ou équivalent rapide) généré au build (voir section Data & Build) et chargé par le client pour requêtes très rapides. Si l'index n'existe pas, le client doit être capable de construire l'index en Web Worker (fallback) sans bloquer le thread principal.
- Les filtres combinés (search + colonnes) doivent être appliqués de façon efficace (opérations set intersection, puis pagination).

5.3 Pagination & Per-page
- L'utilisateur peut choisir le nombre d'AP par page (ex. 10, 25, 50, 100). 
- La recherche doit s'exécuter sur l'ensemble du dataset et produire un jeu de résultats qui est ensuite paginé. Si la recherche retourne > perPage, la navigation doit afficher un pager (prev/next/pages).
- Les chemins d'URL (query string) doivent refléter l'état (page, perPage, recherche, colonnes visibles, sélection) pour partageable / bookmarkable.

5.4 Comparaison
- Onglet `Compare` accessible depuis la page principale.
- On peut sélectionner jusqu'à 4 AP via le bouton `Select` sur les lignes. Lors de la sélection, la ligne est colorée (theme token color) et un petit compteur s'affiche. Si on dépasse 4, empêcher nouvelle sélection et afficher message.
- La page Compare affiche la grille comparatrice : modèle en haut (colonne horizontale), features listées verticalement sur la gauche. Comparaison côte-à-côte lisible sur mobile (transposition si écran étroit).
- Possibilité d'exporter la sélection en CSV.

5.5 Export / Import
- Export CSV : bouton `Export` pour exporter la vue courante (résultats + colonnes visibles) ou la sélection. Génération côté client depuis les données affichées (csv-stringify util).
- Template CSV : proposer un template CSV téléchargeable (`public/template/machines-template.csv`) décrivant l'ordre des champs et règles (valeurs requises, types).
- Upload direct vers GitHub REPO : interdis. Toute proposition d'ajout doit être fournie via PR/email manuelle. Le site doit afficher une notice claire expliquant comment contribuer (download template → remplir → ouvrir PR ou envoyer fichier).
- Le projet inclut un script de validation CSV -> JSON local afin que l'administrateur (toi) puisse convertir et valider avant commit.

5.6 UI / Theme / Accessibilité
- Thème : "GitHub light" (tones gris clairs, lisibilité maximale). Tous les tokens de couleur, tailles, espacements, hover effects et transitions doivent être dans CHARTER.md et implémentés via CSS variables.
- Tous les boutons, icônes et SVG doivent être réutilisables et stockés dans `/src/components/ui` et `/src/components/icons`.
- Taille de police ajustable (contrôleur UI : + / - / reset) via CSS variables.
- Hover effects subtils, animations performantes (prefer CSS transitions) et désactivables (réduire motion pour accessibilité).
- OG / meta tags : `og:title`, `og:description`, `og:image` (fichier public/og-image.png) pour miniature lors du partage.

6) Données / format canonique
- Format canonique : `public/data/machines.json` (JSON). Si contributors préfèrent YAML, ils doivent convertir offline puis commit JSON (un convertisseur peut être fourni en local).
- Schema : l'IA devra fournir un fichier `schemas/machines.schema.json` (JSON Schema v7 ou équivalent) décrivant tous les champs attendus (types, champs obligatoires, valeurs enums si applicables). Toute PR qui modifie le schema doit mettre à jour ARCHITECTURE.md et CHANGELOG.md.
- Taille attendue : 2k–5k entrées. Le fichier peut être compressé côté serveur (GitHub Pages + CDN) : cela dépendra du navigateur, mais l'architecture prévoit indexation pour rendre la recherche rapide.
- Emplacement : `public/data/machines.json` (DO NOT embed in app bundle). Le build script lira ce fichier pour générer l'index.

7) Build local & déploiement manuel (procédure exigée)
Contrainte : pas de GitHub Actions — processus manuel (simple) :

7.1 Prérequis locaux
- Node 18 LTS installé
- npm (version compatible)
- package-lock.json committé
- L'admin/dev doit exécuter localement les commandes décrites ci-dessous avant chaque push de production.

7.2 Commandes obligatoires (implémentées via scripts npm)
- npm ci
- npm run generate-index
  - Génère `public/data/index.json` (FlexSearch export) à partir de `public/data/machines.json`.
  - Valide `machines.json` via `schemas/machines.schema.json`.
- npm run build
  - construit l'application (vite build) en mode production, met les fichiers de build à l'emplacement attendu pour GitHub Pages (voir 7.3).
- npm run preview (local serveur statique pour vérifier build)
- npm run test (exécute unit + e2e)
- npm run lint
- npm run format

7.3 Emplacement build pour GitHub Pages (configuration choisie)
- Pour la simplicité et cohérence : la branche `main` sert GitHub Pages à partir du dossier `/docs` (Settings → Pages → Branch: main / Folder: /docs).
- Obligatoire : le script de build doit produire le site final dans `./docs` (commitable). L'administrateur (toi) vérifie localement `npm run preview` sur le `docs` build puis commit/push `docs/` et les assets.
- Le CONTRACT exige : NE PAS pousser le dossier `src` seul sans exécuter build & tests. Le build final doit être commit dans main under `docs/`.

8) Tests & qualité (obligatoire)
8.1 Exigences générales
- Tests unitaires : Vitest + React Testing Library. Tests obligatoires pour tous les composants critiques (table, search, compare, export, utils csv, sanitize).
- Tests e2e : Playwright — scénarios obligatoires : search globale, search par colonne, pin columns sticky comportement, pagination, sélection pour comparaison (max 4), export CSV, context menu filter, responsive mobile flows.
- L'IA doit fournir exemples de tests et coverage basique.
- Politique : tant que les tests unitaires et e2e ne sont pas tous au vert localement, l'admin ne doit pas pousser `docs/` sur main. L'IA doit générer un README/prereqs checklist et scripts pour exécuter localement ces tests.

8.2 Scripts test (exemples)
- test:unit -> vitest
- test:e2e -> playwright
- test -> test:unit && test:e2e

8.3 Validations automatisées locales
- `npm run generate-index` doit échouer si `machines.json` ne valide pas contre le JSON Schema.
- `npm run lint` doit être vert avant build.

9) Sécurité (obligatoire et non négociable)
- Pas de secrets ni tokens dans le repo, ni dans le client. Si un secret est nécessaire pour un outil local, il doit être stocké hors repo.
- Content Security Policy (CSP) : fournir une configuration CSP stricte dans index.html META tags et documentation pour appliquer via en-têtes si un proxy/CDN plus tard.
- Sanitize : toute donnée injectée dans le DOM doit être échappée/sanitized. Interdiction d'utiliser dangerouslySetInnerHTML sans justification solide et tests.
- SRI : pour tout CDN externe, fournir SRI hashes. Mais la politique préférera bundles locaux — éviter dépendances via CDN.
- Vulnerability scanning : run `npm audit` localement pré-merge et documenter processus. L'IA doit fournir un script `npm run audit` qui exécute `npm audit --audit-level=moderate` et échoue si vulnérabilités critiques trouvées.
- Mitigation DDOS : GitHub Pages ne protège pas totalement contre un trafic massif. Le contrat documente la limitation : sans CDN/WAF externe, on ne peut garantir neutralisation DDOS. L'IA doit documenter ces limites dans ARCHITECTURE.md et inclure recommandations (optionnel) pour mitigation (Cloudflare), mais ne doit pas configurer de services externes.
- Version visibility check : fournir un utilitaire de dev (test bypassable) qui affiche la version Node / versions de dépendances locales pour audit en dev. Ceci est uniquement pour vérifier environnements dev et ne doit pas être exposé en production.

10) Politique dépendances & versions
- Utiliser npm avec lockfile (package-lock.json committé).
- Dépendances strictement ensemencées (pas de wildcard major). Prefer exact version pins (no ^ or ~) OR use lockfile mandatory.
- Activer localement `npm audit` régulièrement. Documenter la procédure de mise à jour (Dependabot peut être activé, mais pour repo privé tu géreras manuellement).
- L'IA doit éviter l'utilisation de bibliothèques non maintenues ou avec peu d'adoption. Préférer libs stables (ex : FlexSearch, react-window, react-router, clsx…).

11) Extensibilité & réutilisabilité
- Tous les composants UI doivent être atomiques et réutilisables. Aucun code dupliqué.
- Les paramètres (couleurs, tailles, labels, colonnes) doivent être configurables via un objet de configuration central dans `/src/config`.
- Les champs de machines doivent être gérés via `columns` config (libellé, clé, type, sortable, filterable) pour éviter hardcoding.
- On doit pouvoir ajouter une colonne via modification de configuration sans toucher la structure du tableau.

12) Checklist avant push/publish (procédure manuelle que l'admin effectuera)
Avant chaque commit/push de `docs/` sur main (déploiement) :
- [ ] npm ci (propre lockfile)
- [ ] npm run lint (OK)
- [ ] npm run test (unit + e2e passés localement)
- [ ] npm run generate-index (OK, index généré)
- [ ] npm run build (build dans ./docs)
- [ ] npm run preview (vérifier application locally à partir ./docs)
- [ ] Vérifier OG image + meta tags
- [ ] Mettre à jour CHANGELOG.md (entry pour cette release)
- [ ] Commit `docs/` + tout changement et push main

13) Scripts npm obligatoires (définir dans package.json)
- "dev": "vite"
- "build": "vite build && node ./scripts/postbuild.js" (postbuild peut copier/transformer si besoin)
- "preview": "vite preview --port 4173"
- "generate-index": "node ./scripts/generate-index.js" (valide JSON schema + produit index)
- "test:unit": "vitest"
- "test:e2e": "playwright test"
- "test": "npm run test:unit && npm run test:e2e"
- "lint": "eslint 'src/**' --max-warnings=0"
- "format": "prettier --write ."
- "audit": "npm audit --audit-level=moderate"
- "export-csv": "node ./scripts/export-csv.js" (utilitaire pour admin)
- "validate-data": "node ./scripts/validate-data.js" (validate machines.json vs schema)

14) Schéma JSON / exemple minimal (obligatoire)
L'IA doit générer `schemas/machines.schema.json` et fournir un exemple `public/data/machines.example.json` (~50 entrées pour tests). Exemple de structure d'une entrée :

{
  "id": "string (unique)",
  "model": "string",
  "manufacturer": "string",
  "frequency": "2.4/5/6 GHz",
  "max_clients": number,
  "throughput_mbps": number,
  "antenna_count": number,
  "power_w": number,
  "...": "autres champs (25 champs au total)"
}

Chaque champ doit être typé dans le JSON Schema et décrit dans ARCHITECTURE.md.

15) CHANGELOG & gestion des versions
- Respecter Keep a Changelog format. Chaque merge vers main qui modifie comportement ou data doit inclure une entrée.
- Si changement d'architecture majeur intervient (ex: migration à backend), il faut mettre à jour ARCHITECTURE.md et obtenir confirmation explicite de l'administrateur.

16) Règles d'intégration pour l'IA dev
- Avant TOUTE PR ou commit (même local), l'IA vérifie :
  - que CONTRACT.md est lu et qu'aucun élément n'est omis ;
  - que les fichiers obligatoires existent et sont à jour (ARCHITECTURE.md, CHARTER.md, CHANGELOG.md, PREREQUIS.md) ;
  - que les tests sont fournis/ajoutés pour toute nouvelle feature et qu'ils couvrent le comportement critique ;
  - que la charte graphique (tokens) est utilisée pour tout nouveau style ;
  - que les versions des dépendances sont pins / lockfile committé ;
  - que la sécurité (sanitization, CSP meta tags) est prise en compte ;
  - que scripts npm listés existent et fonctionnent.

17) Documentation pour contributeurs
- Fournir dans README.md un paragraphe clair "How to contribute data" expliquant :
  - Télécharger template CSV
  - Remplir selon schema
  - Valider localement via `npm run validate-data`
  - Ouvrir PR (ou commit directement si administrateur)
  - Indiquer contact / procédure de review

18) Non-goals / limitations (à documenter dans ARCHITECTURE.md)
- Pas d'upload client→repo automatisé (interdit).
- Pas de base de données serveur gérée par ce projet.
- Pas de garantie absolue contre DDOS sans infra externe.

19) Livrables attendus de l'IA (première itération)
- Repo skeleton (fichiers listés) ou patch diffs pour repos existant.
- CONTRACT.md (ce fichier), ARCHITECTURE.md (détaillé), CHARTER.md, PREREQUIS.md, README.md, CHANGELOG.md (template).
- scripts/generate-index.js, scripts/validate-data.js, scripts/export-csv.js (Node)
- Schema JSON (schemas/machines.schema.json)
- public/data/machines.example.json (≈50 enregistrements)
- src minimal app scaffold (Vite + React + TypeScript) avec table, search, compare UI stubs, et tests unitaires d'exemple.
- .nojekyll dans public/docs root (ou ./docs after build)
- Instructions claires dans PREREQUIS.md pour le process local de build+test+deploy.

20) Contrôle final et acceptation
- L'admin (acstln) effectuera la vérification manuelle finale :
  - Comparer le travail contre CONTRACT.md (fichier que je fournirai) et le fichier de spécifications initial (si souhaité).
  - Tester localement tout le workflow (npm ci, generate-index, test, build, preview).
  - Valider que tous les tests passent et que le site se comporte comme spécifié.
- Après acceptation, tout développement futur doit continuer à respecter CONTRACT.md et à mettre à jour CHANGELOG.md et ARCHITECTURE.md au besoin.

---

Important — clause de conformité
- L'IA doit considérer ce document comme la référence unique et contraignante pour le développement initial et pour chaque modification fonctionnelle. Aucune fonctionnalité ne doit être livrée si elle contrevient à ce contrat.
- Toute modification du contrat (ajout/suppression d'exigences) doit être faite par écrit dans CONTRACT.md et signée (par commit) par l'administrateur.

---

Fin du contrat.  
Ce fichier est complet et exhaustif ; il doit être copié dans la racine du repo sous le nom CONTRACT.md et versionné.
