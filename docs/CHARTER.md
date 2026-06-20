# Charte Graphique - Catalogue AP Wifi

## Thème principal

**Inspiration**: GitHub Light

Principes :
- Lisibilité maximale
- Contraste élevé
- Minimalisme fonctionnel
- Cohérence visuelle

## Palette de couleurs

### Tokens CSS

Tous les tokens sont définis dans `src/styles/tokens.css` et utilisables via `var(--token-name)`.

### Couleurs principales

```css
/* Background */
--color-bg-primary: #ffffff;
--color-bg-secondary: #f6f8fa;
--color-bg-tertiary: #f0f3f6;
--color-bg-overlay: rgba(0, 0, 0, 0.05);

/* Text */
--color-text-primary: #1f2328;
--color-text-secondary: #636c76;
--color-text-tertiary: #8c959f;
--color-text-inverse: #ffffff;
--color-text-link: #0969da;
--color-text-link-hover: #0550ae;

/* Borders */
--color-border-default: #d1d9e0;
--color-border-muted: #e5e9ed;
--color-border-strong: #636c76;

/* Interactive */
--color-accent-primary: #0969da;
--color-accent-hover: #0550ae;
--color-accent-active: #033d8b;
--color-accent-subtle: #ddf4ff;

/* Status */
--color-success: #1a7f37;
--color-success-subtle: #d1f8d9;
--color-warning: #bf8700;
--color-warning-subtle: #fff8c5;
--color-error: #d1242f;
--color-error-subtle: #ffebe9;
--color-info: #0969da;
--color-info-subtle: #ddf4ff;

/* Selection & Highlight */
--color-selection-bg: #0969da15;
--color-selection-border: #0969da;
--color-highlight: #fff8c5;
```

### Couleurs fonctionnelles

```css
/* Table */
--color-table-header-bg: #f6f8fa;
--color-table-row-hover: #f6f8fa;
--color-table-row-selected: #ddf4ff;
--color-table-border: #d1d9e0;

/* Buttons */
--color-btn-primary-bg: #1f883d;
--color-btn-primary-hover: #1a7f37;
--color-btn-primary-text: #ffffff;
--color-btn-secondary-bg: #f6f8fa;
--color-btn-secondary-hover: #f0f3f6;
--color-btn-secondary-text: #1f2328;
--color-btn-danger-bg: #d1242f;
--color-btn-danger-hover: #a0111e;
--color-btn-danger-text: #ffffff;
```

## Typographie

### Fonts

```css
/* Système font stack (pas de web fonts pour performance) */
--font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", 
                     "Noto Sans", Helvetica, Arial, sans-serif;
--font-family-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, 
                    Consolas, "Liberation Mono", monospace;
```

### Échelle typographique

```css
/* Font sizes */
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 1.875rem;  /* 30px */

/* Font weights */
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Line heights */
--line-height-tight: 1.25;
--line-height-base: 1.5;
--line-height-relaxed: 1.75;
```

### Usage

- **Titres**: font-weight-semibold, line-height-tight
- **Corps de texte**: font-weight-normal, line-height-base
- **Libellés**: font-weight-medium, font-size-sm
- **Code/monospace**: font-family-mono, font-size-sm

## Espacements

```css
/* Spacing scale */
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Grille

```css
/* Container */
--container-max-width: 1280px;
--container-padding: var(--space-4);

/* Gaps */
--gap-xs: var(--space-1);
--gap-sm: var(--space-2);
--gap-md: var(--space-4);
--gap-lg: var(--space-6);
--gap-xl: var(--space-8);
```

## Composants

### Boutons

#### Primary Button
```css
background: var(--color-btn-primary-bg);
color: var(--color-btn-primary-text);
padding: var(--space-2) var(--space-4);
border-radius: var(--radius-md);
font-weight: var(--font-weight-medium);
```

#### Secondary Button
```css
background: var(--color-btn-secondary-bg);
color: var(--color-btn-secondary-text);
border: 1px solid var(--color-border-default);
```

#### States
- Hover: background change + subtle scale (1.02)
- Active: background darken + scale (0.98)
- Disabled: opacity 0.5 + cursor not-allowed

### Inputs

```css
background: var(--color-bg-primary);
border: 1px solid var(--color-border-default);
border-radius: var(--radius-md);
padding: var(--space-2) var(--space-3);
font-size: var(--font-size-sm);

/* Focus */
outline: 2px solid var(--color-accent-primary);
outline-offset: 2px;
```

### Cards

```css
background: var(--color-bg-primary);
border: 1px solid var(--color-border-default);
border-radius: var(--radius-lg);
padding: var(--space-4);
box-shadow: var(--shadow-sm);
```

### Tableau

```css
/* Header */
background: var(--color-table-header-bg);
font-weight: var(--font-weight-semibold);
padding: var(--space-3) var(--space-4);
border-bottom: 2px solid var(--color-border-default);

/* Cell */
padding: var(--space-3) var(--space-4);
border-bottom: 1px solid var(--color-border-muted);

/* Row hover */
background: var(--color-table-row-hover);

/* Row selected */
background: var(--color-table-row-selected);
border-left: 3px solid var(--color-accent-primary);
```

## Effets et animations

### Border radius

```css
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-xl: 12px;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
```

### Transitions

```css
--transition-fast: 150ms ease-in-out;
--transition-base: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;

/* Usage */
transition: all var(--transition-base);
```

### Animations

- **Hover**: scale légère (1.02) ou background change
- **Click**: scale (0.98) + feedback visuel
- **Loading**: spin ou pulse
- **Entrée**: fade-in + slide-up (350ms)

**Respect prefers-reduced-motion**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Icônes

### Source

Icônes SVG custom (stockées dans `src/components/icons/`)

### Style

- Stroke width: 1.5-2px
- Viewbox: 24x24
- Couleur: currentColor (hérite du parent)
- Taille: 16px, 20px, 24px selon contexte

### Icônes requises

- SearchIcon
- FilterIcon
- SortAscIcon / SortDescIcon
- CloseIcon
- CheckIcon
- ChevronDownIcon / ChevronUpIcon
- ExportIcon
- CompareIcon
- MenuIcon (mobile)
- SettingsIcon
- PlusIcon / MinusIcon
- ExternalLinkIcon

## Responsive

### Breakpoints

```css
--breakpoint-sm: 640px;   /* Mobile large */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
```

### Media queries

```css
@media (max-width: 639px) { /* Mobile */ }
@media (min-width: 640px) and (max-width: 767px) { /* Mobile large */ }
@media (min-width: 768px) and (max-width: 1023px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

### Stratégie

- Mobile-first approach
- Touch targets: minimum 44x44px
- Font size: minimum 16px (éviter zoom iOS)
- Navigation: hamburger menu sur mobile

## Accessibilité

### Contraste

- Texte normal: minimum 4.5:1
- Texte large (≥18px): minimum 3:1
- UI Components: minimum 3:1

### Focus

```css
/* Focus visible */
outline: 2px solid var(--color-accent-primary);
outline-offset: 2px;
border-radius: var(--radius-sm);
```

### ARIA

- Utiliser aria-label sur icônes seules
- aria-expanded sur accordéons
- aria-selected sur items sélectionnés
- role="button" sur éléments cliquables non-button

### Taille de police ajustable

```css
/* User control via UI */
html.font-size-sm { font-size: 14px; }
html.font-size-base { font-size: 16px; } /* default */
html.font-size-lg { font-size: 18px; }
```

## Assets

### Emplacement

- **Icônes SVG**: `src/components/icons/`
- **Images**: `public/images/`
- **OG Image**: `public/og-image.png` (1200x630px)
- **Favicon**: `public/favicon.ico`
- **Templates**: `public/template/`

### OG Image

Dimensions: 1200x630px  
Format: PNG  
Contenu: Logo + titre "Catalogue AP Wifi" + visuel représentatif

### Favicon

Générer multi-tailles :
- favicon.ico (multi-resolution)
- apple-touch-icon.png (180x180)
- favicon-32x32.png
- favicon-16x16.png

## Exemples de code

### Utilisation des tokens

```tsx
// Button component
<button
  style={{
    backgroundColor: 'var(--color-btn-primary-bg)',
    color: 'var(--color-btn-primary-text)',
    padding: 'var(--space-2) var(--space-4)',
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-base)',
  }}
>
  Primary Button
</button>

// Card component
<div
  style={{
    backgroundColor: 'var(--color-bg-primary)',
    border: '1px solid var(--color-border-default)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-4)',
    boxShadow: 'var(--shadow-sm)',
  }}
>
  Card content
</div>
```

### Classes utilitaires (optionnel)

Créer classes réutilisables dans `src/styles/utilities.css` :

```css
.btn-primary { /* ... */ }
.btn-secondary { /* ... */ }
.card { /* ... */ }
.text-primary { color: var(--color-text-primary); }
.text-secondary { color: var(--color-text-secondary); }
```

## Maintenance

### Ajout de nouveaux tokens

1. Ajouter dans `src/styles/tokens.css`
2. Documenter dans CHARTER.md
3. Utiliser le nouveau token dans composants
4. Mettre à jour CHANGELOG.md

### Modification de tokens existants

⚠️ **Attention**: Changement global affectant tous les composants

1. Tester impact sur tous les composants
2. Vérifier contraste/accessibilité
3. Documenter changement dans CHANGELOG.md

---

**Version**: 1.0  
**Dernière mise à jour**: 2026-01-20  
**Auteur**: acstln
