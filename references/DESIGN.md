---
name: Luna Nail Studio
colors:
  surface: '#fff8f8'
  surface-dim: '#e8d5dc'
  surface-bright: '#fff8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f4'
  surface-container: '#fce9f0'
  surface-container-high: '#f7e3ea'
  surface-container-highest: '#f1dee4'
  on-surface: '#23191d'
  on-surface-variant: '#524347'
  inverse-surface: '#392d32'
  inverse-on-surface: '#ffecf2'
  outline: '#857277'
  outline-variant: '#d7c1c6'
  surface-tint: '#914563'
  primary: '#863c5a'
  on-primary: '#ffffff'
  primary-container: '#a35472'
  on-primary-container: '#ffecf0'
  inverse-primary: '#ffb0ca'
  secondary: '#7b545d'
  on-secondary: '#ffffff'
  secondary-container: '#fdcad5'
  on-secondary-container: '#79525c'
  tertiary: '#00622b'
  on-tertiary: '#ffffff'
  tertiary-container: '#007e39'
  on-tertiary-container: '#c1ffc7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e3'
  primary-fixed-dim: '#ffb0ca'
  on-primary-fixed: '#3d011f'
  on-primary-fixed-variant: '#752e4b'
  secondary-fixed: '#ffd9e1'
  secondary-fixed-dim: '#ebbac5'
  on-secondary-fixed: '#2f121b'
  on-secondary-fixed-variant: '#603c46'
  tertiary-fixed: '#6ffe94'
  tertiary-fixed-dim: '#4fe17b'
  on-tertiary-fixed: '#00210a'
  on-tertiary-fixed-variant: '#005323'
  background: '#fff8f8'
  on-background: '#23191d'
  surface-variant: '#f1dee4'
typography:
  display:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Playfair Display
    fontSize: 38px
    fontWeight: '400'
    lineHeight: 46px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: DM Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: DM Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.06em
  label-md:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: DM Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 4rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an intimate, high-end editorial presence for a boutique beauty and nail artistry studio based in Cali, Colombia. The aesthetic balances bespoke luxury with authentic warmth, avoiding clinical salon tropes or cold corporate aesthetics.

The design movement combines **Contemporary Editorial Minimalism** with **Warm Tactile Refinement**:
- **Generous White Space & Asymmetry:** Editorial magazine pacing that lets curated photography of nail artistry breathe.
- **Organic Warmth & Softness:** Warm linen-rose backdrops evoke a welcoming, pampering physical space.
- **Refined Detailing:** Ultra-thin hair-line borders, delicate monospaced or tracking-enhanced labels, and thoughtful typography pairings reflecting craftsmanship and precision.

## Colors

The palette draws inspiration from polished stone, soft rose pigments, and natural skin undertones, punctuated by an essential booking and communication channel.

- **Primary (`#A35472`):** Deep Mulberry Mauve. Used for primary CTAs, active states, key section highlights, and strong typographical accents.
- **Secondary (`#D6A6B1`):** Soft Dusty Rose. Used for pill tags, decorative divider lines, subtle badge backgrounds, and interactive hover tints.
- **Tertiary / Action Accent (`#1EBE5D`):** Balanced Emerald WhatsApp Green. Configured specifically to maintain WCAG AA compliance against warm neutral backdrops, reserved exclusively for direct concierge and booking actions.
- **Neutral Primary (`#30252A`):** Deep Espresso Plum. Replaces pure black to deliver high contrast with softened, luxurious warmth across all typography and icon outlines.
- **Surface Canvas (`#FFF9F6`):** Porcelain Blush. The primary page background.
- **Surface Container (`#F0E3DD`):** Warm Sand Cashmere. Used for secondary cards, inset treatment blocks, and alternating narrative sections.

## Typography

The typography pairing contrasts the expressive, haute-couture cadence of **Playfair Display** with the clear, geometric neutrality of **DM Sans**.

- **Editorial Headlines:** Headings embrace Italian/French editorial proportions. Larger display sizes feature negative letter-spacing for compact elegance, with italic accents permissible on single words for narrative cadence.
- **Labels & Badges:** Small badges, service categories, and studio metadata rely on uppercase `label-*` tokens with generous tracking (`0.06em` to `0.1em`) to reinforce craftsmanship.
- **Body & Pricing:** Set in DM Sans with open line heights to guarantee effortless readability across treatment descriptions, nail care guides, and pricing tables.

## Layout & Spacing

The layout is built upon an intentional 12-column desktop grid with a maximum content container of `1240px`. Mobile layouts fold cleanly into a 4-column structure.

- **Negative Space Rhythm:** Generous vertical section offsets (using multiples of `space-xl`, typically 5rem to 7.5rem) provide an unhurried, boutique ambiance.
- **Asymmetric Composition:** Image galleries and service menus use staggered two-column and three-column arrangements, pairing portrait-oriented photography (`3:4` or `4:5` aspect ratios) with parallel descriptive copy.
- **Safe Bleeds:** Gallery teasers and Instagram highlights may bleed outside grid margins on mobile devices into horizontal kinetic snap carousels.

## Elevation & Depth

To maintain a bespoke print-editorial presence, depth is communicated through **tonal layering and hairline boundaries** rather than standard digital drop shadows.

- **Tonal Stepping:** Surfaces layer naturally. Canvas (`#FFF9F6`) sits below Card Insets (`#F0E3DD`), which in turn sit below elevated modal sheets (`#FFFFFF`).
- **Hairline Ghost Borders:** Outlines measure precisely `1px solid rgba(163, 84, 114, 0.15)`. This delicate separation replaces box shadows across cards and floating navigation bars.
- **Diffused Ambient Glow:** For floating CTAs (such as the persistent WhatsApp Concierge button), use an ultra-diffused, soft-tinted shadow: `box-shadow: 0 12px 32px -4px rgba(48, 37, 42, 0.12)`. No harsh dark shadows or multi-layered skeuomorphic bevels.

## Shapes

The studio utilizes a soft, organic geometric foundation (`roundedness: 2` / base `0.5rem`).

- **Cards & Visual Containers:** Standard corner radius sits at `0.5rem` (`rounded-md`) to `1rem` (`rounded-lg`), imparting tailored softness without feeling overly toy-like.
- **Pill Exceptions:** Interactive filter chips, status tags, and button elements use full pill shaping (`9999px`) to echo the curvature of manicured nails and hand silhouettes.
- **Arch Motifs:** Featured imagery showcases soft Roman arch top-radii (`border-top-left-radius: 9999px`, `border-top-right-radius: 9999px`) on hero spotlights to accentuate artisanal beauty.

## Components

### Buttons
- **Primary Studio Action:** Deep Mulberry (`#A35472`) background, crisp `#FFF9F6` text, pill-shaped (`9999px`), with `padding: 0.875rem 2rem`. Subtle hover shift: scale up to `rgba(163, 84, 114, 0.92)`.
- **Secondary / Ghost:** Transparent background enclosed by `1px solid #A35472` with `#A35472` typography. Soft `#F0E3DD` wash on hover.
- **WhatsApp Direct Concierge:** `#1EBE5D` fill with pure white typography and custom chat glyph, featuring a diffused soft shadow for fast booking from mobile screens.

### Service & Price Cards
- Background: `#F0E3DD` with `1px solid rgba(163, 84, 114, 0.12)`.
- Internal padding: `space-lg` (`1.5rem`).
- Typography alignment: Service title in `Playfair Display` on the left, dotted leader line, and price in `DM Sans` (`600` weight) on the right. Treatment duration displayed as a small uppercase subtitle.

### Chips & Badges
- Category filters (e.g., *Nail Art*, *Acrílicas*, *Spa Pedicure*): Compact pill containers in `#FFF9F6` with `1px solid #D6A6B1`. Active chip switches to `#A35472` with light text.

### Form Inputs
- Text inputs and date pickers feature a minimal underline or enclosed box with `#FFF9F6` background and `1px solid rgba(48, 37, 42, 0.2)`. Focus state transitions crisply to `#A35472` outline with zero fuzzy browser rings.

### Lookbook Photo Frames
- Custom image frames with minimal `4px` inner border mats and subtle arch geometry, allowing high-resolution detail of nail designs to remain the hero.