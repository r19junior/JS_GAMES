# SJ Games: Global Design System (v1.0)

This document serves as the official source of truth for the **"Elite Brutalist"** design system used in the SJ Games platform for Colegio San José. It ensures visual consistency across all components and future enhancements.

---

## 1. Design Philosophy: "Elite Brutalist"
The system combines the raw, high-contrast energy of **Brutalism** (heavy borders, sharp shadows, bold typography) with a **Premium/Elite** layer (neon accents, glassmorphism, fluid animations).

- **High Contrast**: Always use black/white foundations.
- **Aggressive Typography**: Heavy font weights and italicized headings.
- **Dynamic Feedback**: Interactive elements should feel alive through micro-animations.

---

## 2. Color Palette

| Category | Token | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | `RED_ACCENT` | `#DE0A0A` | Identity, highlights, primary buttons, glow effects. |
| **Neutral** | `DRK_PRIMARY` | `#000000` | Backgrounds, heavy borders, dominant cards. |
| **Neutral** | `LGT_PRIMARY` | `#FFFFFF` | Hero cards, secondary text, input fields. |
| **Status** | `GLD_ACCENT` | `#FACC15` | Action alerts, test modes, "Special" tags. |
| **Utility** | `GLASS_NAV` | `rgba(0,0,0,0.9)` | Blurred navigation and overlays. |

---

## 3. Typography Rules

### Headings (Hero/H1/H2)
- **Rules**: Font-black, uppercase, italic, tracking-tighter.
- **Implementation**: `className="font-black italic font-heading tracking-tighter uppercase"`

### The "Command Center" Clock
To prevent layout breaks, use the **Double Clamp** methodology:
- **HH Unit**: `text-[clamp(2rem,6vw,4rem)]`
- **MM:SS Unit**: `text-[clamp(3.5rem,12vw,8rem)]`
- **Tabular Nums**: Always use `font-variant-numeric: tabular-nums` for timers.

---

## 4. Components & UI Patterns

### Card Architecture
Cards are the backbone of the UI. There are two primary types:
1. **Classic Brutalist**: 4px black border, solid shadow (e.g., `shadow-[8px_8px_0px_#000]`).
2. **Elite Premium**: No border, massive blurred shadow (`shadow-[20px_20px_60px_rgba(0,0,0,0.1)]`), inner neon glow.

### Interactive Elements
- **Tier 1 Buttons**: Black background, white text, red 4px shadow offset.
- **Glassmorphism**: Use `backdrop_blur-xl` with `bg-black/90` and a thin `border-white/10`.
- **Active State Nav**: Glow animation (`shadow-[0_0_20px_rgba(222,10,10,0.4)]`).

---

## 5. Animation Constants (Framer Motion)

The "Elite" feel is achieved through specific easing:
```typescript
const ELITE_ENTRY = { 
  type: "spring", 
  stiffness: 260, 
  damping: 20 
};

const LOGO_FLOATING = {
  y: [0, -15, 0],
  rotateZ: [0, 1, 0, -1, 0],
  transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
};
```

---

## 6. Layout & Responsiveness
- **Desktop Grid**: 12-column system (`lg:grid-cols-12`).
- **Breakpoint Rule**: Content switches from 12-cols to a single-stack at `1024px` (lg).
- **Safe Zone**: Maintain a 48px padding (`pb-48`) at the bottom of the `main` tag to clear the fixed navigation bar.

---

> [!TIP]
> **Pro Tip**: When adding new games or features, always start with a black border and then "Elite" it up with a subtle red glow or a floating animation.
