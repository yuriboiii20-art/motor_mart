# KAARZO — Design System & Visual Specification

This document preserves the visual identity, color palette, typography, component styling, and UI flow derived from the reference design. All architecture, pages, and sections will be built strictly according to your specifications while following this design blueprint.

---

## 1. Color Palette & Theme Tokens

| Token Name | Hex Code | Purpose & Usage |
|---|---|---|
| `--brand-gold` | `#F6C43D` | Primary accent, primary CTA buttons, active states, key highlights |
| `--brand-gold-hover` | `#E0AF2B` | Button hover states, interactive focus |
| `--brand-gold-light`| `rgba(246, 196, 61, 0.12)` | Subtle badge backgrounds, active pill tints |
| `--dark-bg` | `#111111` | Premium hero sections, dark mode sections, header/footer |
| `--dark-card` | `#1A1A1A` | Dark card backgrounds, elevated surfaces |
| `--dark-border` | `#2D2D2D` | Dark section borders and dividers |
| `--light-bg` | `#FFFFFF` | Primary content canvas, car listing grids |
| `--light-surface` | `#F8F9FA` | Secondary section background, alternate striping |
| `--text-primary` | `#1E2022` | Main titles, vehicle titles, high-contrast headings |
| `--text-muted` | `#6C757D` | Specs, descriptions, secondary metadata |
| `--border-subtle` | `#E9ECEF` | Card borders, input field borders, table lines |
| `--whatsapp-green` | `#25D366` | Direct dealer WhatsApp connect button |

---

## 2. Typography & Hierarchy

* **Primary Font Family**: Clean modern geometric sans-serif (`Outfit`, `Inter`, or `Plus Jakarta Sans`).
* **Headings (`H1`, `H2`, `H3`)**: Bold weight (700/800), tight letter-spacing, high-impact titles.
* **Badges & Labels**: Medium/Semi-bold (600), uppercase with slight letter-spacing (`0.5px - 1px`).
* **Body & Descriptions**: Regular (400) / Medium (500) with 1.5 - 1.6 line height for effortless readability.
* **Pricing & Metrics**: High-contrast, bold numerals (e.g. `₹ 14.50 Lakh` or `24,000 km`).

---

## 3. Core Component Library

### A. Car Display Card (The Signature Component)
* **Visual Frame**: Floating card with clean white or subtle gray background, soft `8px–12px` border-radius, and a smooth `0 8px 24px rgba(0,0,0,0.06)` hover elevation.
* **Image Container**: High-clarity 16:9 vehicle aspect ratio with category/status badge overlay (e.g., *“KA-05 Bangalore”*, *“Verified Dealer”*).
* **Details Block**:
  * Car Title & Year (e.g., *2022 Hyundai Creta SX (O)*)
  * Prominent Price Tag with brand gold accenting
  * 4-Grid / Inline Spec Pills (Fuel, Transmission, KM Driven, Ownership)
* **Action Buttons**: Dual CTA setup (e.g., Primary Gold *"View Details"* + Direct WhatsApp / Call button).

### B. Interactive Category & Filter Tabs
* Rounded pill selectors with smooth slide or background color transition from light gray to Brand Gold / Onyx when active.

### C. Trust Metrics & Stat Counters
* Clean numeric counter blocks with subtle divider lines and high-contrast typography.

### D. Lead Generation & Contact Forms
* Flat modern inputs with clear placeholder text, subtle border states, and an active focus ring using the brand gold token.

### E. Accordions & FAQ Blocks
* Bordered expandable rows with smooth chevron rotation and clear typographic contrast.

---

## 4. UI Flow & Visual Rhythm
* **Section Alternation**: Balanced contrast flow (Dark Impact Hero -> Clean Crisp Content -> Soft Tinted Features -> High-Contrast Dark Footer).
* **Micro-interactions**: Subtle hover scaling on vehicle images, smooth transitions on tab switches, and responsive touch-friendly targets for mobile users.

---
*Status: Saved and locked into project specifications for KAARZO.*
