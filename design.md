# Retro Portfolio Design System

This document extracts and defines the design system used in the project based on the CSS and React components.

## 1. Typography

- **Heading Font**: `"Space Grotesk", sans-serif`
  - Used for titles, display text, and headings to give a modern, geometric retro feel.
- **Body Font**: `"DM Sans", sans-serif`
  - Used for paragraph text, UI elements, and general reading for clean legibility.

## 2. Color Palette

The color scheme relies on soft pastel retro colors contrasted by a strong dark color for borders and shadows.

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `--color-retro-bg` | `#FFF8EC` | Main app background (off-white/cream) |
| `--color-retro-dark` | `#2D2A26` | Text, borders, and shadows (dark charcoal) |
| `--color-retro-yellow` | `#FFD56B` | Accents, ornaments, highlights |
| `--color-retro-blue` | `#B8CCE2` | Accents, ornaments, highlights |
| `--color-retro-pink` | `#FFBCB0` | Accents, ornaments, highlights |
| `--color-retro-mint` | `#B5D8B0` | Accents, ornaments, highlights |
| `--color-retro-white` | `#FFFFFF` | Card backgrounds, button backgrounds |
| `--color-retro-grey` | `#F5F0E8` | Secondary backgrounds, subtle contrast |

## 3. Structural & Visual Elements

### Background
- **Pattern**: A radial-gradient polka dot pattern overlaying the main background.
- **Dots**: `rgba(45, 42, 38, 0.15)` at `1.5px` size, spaced `24px` apart.

### Borders and Shadows (Neobrutalism / Retro Styling)
The design uses strong, solid borders and offset box shadows to create a tactile, sticker-like feel.

- **Border Width**: `2.5px solid var(--color-retro-dark)`
- **Standard Shadow**: `3px 3px 0px var(--color-retro-dark)`
- **Small Shadow**: `2px 2px 0px var(--color-retro-dark)`

## 4. Components

### Cards (`.retro-card`)
- **Background**: White
- **Border**: `2.5px solid var(--color-retro-dark)`
- **Border Radius**: `1rem` (16px)
- **Shadow**: `3px 3px 0px var(--color-retro-dark)`

### Buttons (`.btn-retro`)
- **Border**: `2.5px solid var(--color-retro-dark)`
- **Shadow**: `3px 3px 0px var(--color-retro-dark)`
- **Hover State**: Button translates up and left `(-2px, -2px)`, shadow increases to `5px 5px 0px`.
- **Active State**: Button translates down and right `(3px, 3px)`, shadow reduces to `0 0 0`.

### Pills / Badges (`.retro-pill`)
- Same base styles as buttons but with `border-radius: 9999px` (fully rounded).

### Navigation Links (`.nav-link`)
- **Padding**: `0.375rem 1rem`
- **Font Size**: `0.75rem`, Bold (`700`)
- **Hover/Active State**: Gains a white background, dark border, and `2px 2px 0px` shadow.

## 5. Animations & Transitions

### Page Transitions
Managed by `framer-motion`:
- **Enter**: Elements scale up from `0.98`, translate from `y: 15`, and blur reduces from `8px` to `0px`.
- **Exit**: Elements scale down to `0.98`, translate to `y: -15`, and blur increases to `8px`.
- **Stagger**: Child elements animate in with a `0.08s` stagger delay.

### Ornaments & Decorative Elements
The background features floating decorative SVG shapes (asterisks, hearts, squiggles, circles) and recolored logo marks.
- **Float Animation (`floaty`)**: Elements gently bob up and down (`-15px`) while slightly rotating.
- **Colors**: These ornaments use the retro accent colors (pink, yellow, mint, blue) with low opacity (`0.10` - `0.25`) to avoid distracting from the main content.
