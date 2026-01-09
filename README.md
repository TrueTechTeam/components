# @true-tech-team/ui-components

A comprehensive React component library built with TypeScript, SCSS Modules, and featuring a robust theming system with dark/light mode support.

## Features

- 🎨 **Comprehensive Theming** - 37 color families with 10 shades each (370+ colors)
- 🌓 **Dark/Light Mode** - Built-in theme switching with CSS variables
- 📏 **4px Grid System** - Consistent spacing throughout
- 🎯 **Type-Safe** - Full TypeScript support with comprehensive types
- 🧩 **Component Library** - Reusable, customizable components
- 🎭 **Icon System** - SVG-based icons with easy customization
- 🛠️ **Utility Classes** - 500+ utility classes for rapid development
- 📦 **Tree-Shakeable** - Optimized bundle sizes
- ♿ **Accessible** - Built with accessibility in mind

## Installation

```bash
npm install @true-tech-team/ui-components
```

## Quick Start

### Wrap your app with GlobalProvider

```tsx
import { GlobalProvider } from '@true-tech-team/ui-components';

function App() {
  return (
    <GlobalProvider themeConfig={{ mode: 'light' }}>
      <YourApp />
    </GlobalProvider>
  );
}
```

### Use components

```tsx
import { Button, Icon } from '@true-tech-team/ui-components';

function MyComponent() {
  return (
    <div>
      <Button variant="primary" size="md">
        Click me
      </Button>

      <Button
        variant="outline"
        startIcon={<Icon name="check" size={16} />}
      >
        Save
      </Button>
    </div>
  );
}
```

## Components

### Button

```tsx
<Button variant="primary" size="md">Click me</Button>
```

**Variants:** primary, secondary, outline, ghost
**Sizes:** sm, md, lg

### Icon

```tsx
<Icon name="check" size={24} color="var(--theme-primary)" />
```

**Available icons:** chevron-down, chevron-up, chevron-left, chevron-right, close, check, info, warning, error

## Theming

### Toggle Theme

```tsx
import { useTheme } from '@true-tech-team/ui-components';

function ThemeToggle() {
  const { mode, toggleMode } = useTheme();
  return <button onClick={toggleMode}>Current: {mode}</button>;
}
```

### Utility Classes

**Spacing (4px grid):**
```html
<div class="m-4 p-2">Margin 16px, Padding 8px</div>
```

**Flexbox:**
```html
<div class="flex items-center justify-between gap-4">...</div>
```

**Colors:**
```html
<div class="bg-primary text-on-primary">...</div>
```

## Development

```bash
# Build library
nx build ui-components

# Run tests
nx test ui-components

# Lint
nx lint ui-components
```

## License

MIT
