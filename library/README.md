# Liquid Glass UI

Apple Liquid Glass design language React component library with real SVG `feDisplacementMap` refraction — not just `backdrop-filter: blur()`.

## Install

```bash
npm install liquid-glass-ui
# or
bun add liquid-glass-ui
# or
yarn add liquid-glass-ui
```

### Peer dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```

## Quick start

```tsx
import { GlassButton, GlassCard, LiquidGlass, LiquidGlassHost } from "liquid-glass-ui";
import "liquid-glass-ui/css";

export default function App() {
  return (
    <>
      <LiquidGlassHost />
      <GlassCard refraction>
        <h2>Hello Liquid Glass</h2>
        <GlassButton variant="primary">Click me</GlassButton>
      </GlassCard>
    </>
  );
}
```

## What makes this different

Most "glassmorphism" libraries use `backdrop-filter: blur()` — that's just frosted plastic. This library implements **real optical refraction** using the same technique as [shuding/liquid-glass](https://github.com/shuding/liquid-glass):

1. A **signed distance field** (SDF) generates a per-pixel displacement map via `roundedRectSDF` + `smoothStep`
2. The map is baked to a PNG in a **Web Worker** (main thread never blocks)
3. An SVG `<feImage>` + `<feDisplacementMap>` filter references the map
4. The filter runs inside `backdrop-filter: url(#filter)`, so each pixel samples the backdrop from a **displaced location** — producing true lens-like magnification at the rim

## Material system

Three glass strengths, each tuned for a different UI layer:

| Material | Use case | Blur | Opacity |
|----------|----------|------|---------|
| `thin` | Toolbars, floating controls | 14px | 55% |
| `regular` | Cards, popovers, sidebars | 24px | 68% |
| `strong` | Modals, sheets, focus areas | 36px | 82% |

```tsx
<LiquidGlass material="thin" radius={20}>Toolbar</LiquidGlass>
<LiquidGlass material="regular" radius={24}>Card</LiquidGlass>
<LiquidGlass material="strong" radius={28}>Modal</LiquidGlass>
```

## Components

**General**: Button, Icon, Typography
**Layout**: Grid, Layout, Divider, Space, Container
**Navigation**: Menu, Breadcrumb, Pagination, Steps, Tabs, Dropdown, Anchor
**Data Entry**: Input, Select, Checkbox, Radio, Switch, Slider, Form
**Data Display**: Table, List, Card, Tag, Badge, Avatar, Progress, Collapse, Statistic, Empty, Skeleton, Tree, Timeline
**Feedback**: Modal, Drawer, Alert, Message, Notification, Result, Spin, Tooltip, Popover, BackTop
**Business**: SearchBox, FilterBar, ProForm, DetailPanel
**Primitives**: LiquidGlass, GlassSurface, useGlassRefraction, LiquidGlassHost

## Refraction API

```tsx
import { useGlassRefraction, LiquidGlass, LiquidGlassHost } from "liquid-glass-ui";

// Hook — attach to any element
function MyPanel() {
  const { ref, backdropFilter } = useGlassRefraction({
    enabled: true,
    radius: 20,
    shape: "rounded", // "rounded" | "circle" | "pill" | "square"
    strength: 0.7,    // 0.4 = subtle, 0.7 = standard, 0.85 = strong
  });

  return (
    <div
      ref={ref}
      style={{ backdropFilter, WebkitBackdropFilter: backdropFilter }}
      className="glass glass-edge"
    >
      Real refraction
    </div>
  );
}

// Component — wrapper with auto resize
<LiquidGlass
  radius={28}
  shape="rounded"
  strength={0.7}
  material="regular"
  specular
  edge
>
  Content
</LiquidGlass>
```

**Important**: Mount `<LiquidGlassHost />` once at your app root — it renders the SVG `<defs>` containing all registered displacement map filters.

## Theming

The library ships with a complete CSS token system supporting **Light and Dark mode**:

```css
/* Import once in your app */
@import "liquid-glass-ui/css";
```

Toggle dark mode by adding the `dark` class to `<html>`:

```tsx
<html className="dark">
```

### Custom tokens

Override any CSS variable to customize the glass material:

```css
:root {
  --glass-regular-bg: rgba(255, 255, 255, 0.8);
  --glass-regular-edge: rgba(15, 23, 42, 0.15);
  --glass-blur-regular: 30px;
  --glass-saturation: 1.8;
}
```

## Framework support

- **Next.js** (App Router & Pages Router)
- **Vite**
- **Remix**
- **Any React 18+ project**

### Tailwind CSS

The library uses Tailwind utility classes. If your project uses Tailwind, add the library to your `content` config:

```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/liquid-glass-ui/dist/**/*.{js,cjs}",
  ],
}
```

## License

MIT
