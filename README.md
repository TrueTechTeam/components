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

### Buttons

#### Button
Versatile button component with multiple variants and sizes.

```tsx
<Button variant="primary" size="md" onClick={() => console.log('clicked')}>
  Click me
</Button>

<Button variant="outline" startIcon={<Icon name="check" />}>
  With Icon
</Button>
```

**Variants:** primary, secondary, outline, ghost
**Sizes:** sm, md, lg

#### IconButton
Button component optimized for icon-only display.

```tsx
<IconButton aria-label="Close" size="md">
  <Icon name="close" />
</IconButton>
```

### Display

#### Icon
SVG-based icon system with customizable size and color.

```tsx
<Icon name="check" size={24} color="var(--theme-primary)" />
```

**Available icons:** chevron-down, chevron-up, chevron-left, chevron-right, close, check, info, warning, error, eye, eye-off

### Inputs

#### Input
Text input with validation, formatting, and various configurations.

```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  validation={(value) => value.includes('@') ? { valid: true } : { valid: false, message: 'Invalid email' }}
/>
```

#### Autocomplete
Input with dropdown suggestions and filtering.

```tsx
<Autocomplete
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
  placeholder="Search..."
/>
```

#### Select
Dropdown select component with search and custom rendering.

```tsx
<Select
  options={[
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' }
  ]}
  placeholder="Select country"
/>
```

#### Checkbox
Checkbox input with labels and indeterminate state.

```tsx
<Checkbox label="Accept terms" checked={accepted} onChange={setAccepted} />
```

#### Radio & RadioGroup
Radio button inputs with group management.

```tsx
<RadioGroup value={selected} onChange={setSelected}>
  <Radio value="option1" label="Option 1" />
  <Radio value="option2" label="Option 2" />
</RadioGroup>
```

#### Toggle
Switch/toggle component for boolean states.

```tsx
<Toggle checked={enabled} onChange={setEnabled} label="Enable feature" />
```

#### Textarea
Multi-line text input with auto-resize.

```tsx
<Textarea
  label="Description"
  placeholder="Enter description"
  rows={4}
  maxLength={500}
/>
```

#### NumberInput
Numeric input with increment/decrement controls.

```tsx
<NumberInput
  label="Quantity"
  min={0}
  max={100}
  step={1}
  value={quantity}
  onChange={setQuantity}
/>
```

#### PhoneInput
International phone number input with country selection.

```tsx
<PhoneInput
  value={phone}
  onChange={setPhone}
  defaultCountry="US"
/>
```

#### Slider
Range slider with marks and custom formatting.

```tsx
<Slider
  min={0}
  max={100}
  value={volume}
  onChange={setVolume}
  marks={[0, 25, 50, 75, 100]}
/>
```

#### Rating
Star rating input component.

```tsx
<Rating value={rating} onChange={setRating} max={5} />
```

#### TagInput
Input for managing multiple tags.

```tsx
<TagInput
  tags={tags}
  onChange={setTags}
  placeholder="Add tag..."
/>
```

#### FilePicker
File upload component with drag-and-drop support.

```tsx
<FilePicker
  accept=".pdf,.doc,.docx"
  maxSize={5 * 1024 * 1024}
  onChange={(files) => console.log(files)}
/>
```

#### ColorPicker
Color selection with multiple format support (hex, rgb, hsl).

```tsx
<ColorPicker
  value={color}
  onChange={setColor}
  format="hex"
/>
```

#### DatePicker
Single date selection with calendar interface.

```tsx
<DatePicker
  value={date}
  onChange={setDate}
  minDate={new Date()}
/>
```

#### DateRangePicker
Date range selection with presets.

```tsx
<DateRangePicker
  startDate={startDate}
  endDate={endDate}
  onChange={(start, end) => {
    setStartDate(start);
    setEndDate(end);
  }}
  presets={[
    { label: 'Last 7 days', value: { start: -7, end: 0 } }
  ]}
/>
```

### Overlays

#### Portal
Render children in a different part of the DOM.

```tsx
<Portal>
  <div>This renders at document.body</div>
</Portal>
```

#### Popover
Floating content positioned relative to a trigger.

```tsx
<Popover
  trigger={<Button>Open Popover</Button>}
  content={<div>Popover content</div>}
/>
```

#### Tooltip
Hover tooltip with customizable positioning.

```tsx
<Tooltip content="Helpful information" position="top">
  <Button>Hover me</Button>
</Tooltip>
```

#### Dropdown
Dropdown menu with trigger and content.

```tsx
<Dropdown
  trigger={<Button>Options</Button>}
  content={
    <MenuList>
      <MenuItem>Action 1</MenuItem>
      <MenuItem>Action 2</MenuItem>
    </MenuList>
  }
/>
```

#### Menu
Flexible menu system with items, groups, and dividers.

```tsx
<Menu>
  <MenuList>
    <MenuItem onClick={() => console.log('Edit')}>Edit</MenuItem>
    <MenuItem onClick={() => console.log('Delete')}>Delete</MenuItem>
    <MenuDivider />
    <MenuGroup label="More options">
      <MenuItem>Settings</MenuItem>
    </MenuGroup>
  </MenuList>
</Menu>
```

### Forms

#### FormBuilder
Dynamic form builder with validation and state management.

```tsx
<FormBuilder
  fields={[
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      validation: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true
    }
  ]}
  onSubmit={(values) => console.log(values)}
/>
```

## Theming

### Theme Configuration

The library includes a comprehensive theming system with 37 color families and 10 shades each, providing 370+ colors out of the box.

```tsx
import { GlobalProvider } from '@true-tech-team/ui-components';

function App() {
  return (
    <GlobalProvider
      themeConfig={{
        mode: 'light',
        // Optional: override theme values
        overrides: {
          colors: {
            primary: '#007bff'
          }
        }
      }}
    >
      <YourApp />
    </GlobalProvider>
  );
}
```

### Toggle Theme

```tsx
import { useTheme } from '@true-tech-team/ui-components';

function ThemeToggle() {
  const { mode, toggleMode } = useTheme();
  return <button onClick={toggleMode}>Current: {mode}</button>;
}
```

### CSS Variables

All theme values are exposed as CSS variables for easy customization:

```css
.custom-element {
  color: var(--theme-primary);
  background: var(--theme-surface);
  border-radius: var(--theme-radius-md);
  padding: var(--theme-spacing-4);
}
```

### Utility Classes

**Spacing (4px grid):**
```html
<div class="m-4 p-2">Margin 16px, Padding 8px</div>
<div class="mt-2 mb-4 px-6">Margin top 8px, bottom 16px, padding x 24px</div>
```

**Flexbox:**
```html
<div class="flex items-center justify-between gap-4">...</div>
<div class="flex-col items-start">...</div>
```

**Grid:**
```html
<div class="grid grid-cols-3 gap-4">...</div>
```

**Colors:**
```html
<div class="bg-primary text-on-primary">...</div>
<div class="bg-surface text-on-surface">...</div>
```

**Typography:**
```html
<h1 class="text-2xl font-bold">Heading</h1>
<p class="text-sm text-secondary">Small text</p>
```

## Utility Functions

### Theme Utils

```tsx
import { getThemeValue, setThemeValue, pxToRem, gridSpacing } from '@true-tech-team/ui-components';

// Get theme values
const primaryColor = getThemeValue('--theme-primary');

// Convert pixels to rem
const remValue = pxToRem(16); // '1rem'

// Grid-based spacing
const spacing = gridSpacing(4); // '16px' (4 * 4px grid)
```

### Color Utils

```tsx
import {
  hexToRgb,
  rgbToHsl,
  isLightColor,
  getBrightness
} from '@true-tech-team/ui-components';

const rgb = hexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
const hsl = rgbToHsl(255, 0, 0); // { h: 0, s: 100, l: 50 }
const isLight = isLightColor('#ffffff'); // true
```

### Date Utils

```tsx
import {
  formatDate,
  getDaysInMonth,
  isDateInRange,
  addDays
} from '@true-tech-team/ui-components';

const formatted = formatDate(new Date(), 'YYYY-MM-DD');
const daysInMonth = getDaysInMonth(2024, 0); // January 2024
const inRange = isDateInRange(date, startDate, endDate);
const futureDate = addDays(new Date(), 7);
```

### Validation Utils

```tsx
import { validators, combineValidators } from '@true-tech-team/ui-components';

const emailValidator = validators.email();
const requiredValidator = validators.required('This field is required');
const combined = combineValidators([requiredValidator, emailValidator]);

const result = combined('test@example.com');
```

## Development

### Building

```bash
# Build library for production
nx build ui-components --configuration=production

# Build for development
nx build ui-components --configuration=development
```

The build output will be in `dist/libs/ui-components/`.

### Testing

```bash
# Run tests
nx test ui-components

# Run tests in watch mode
nx test ui-components --watch

# Run tests with coverage
nx test ui-components --coverage
```

### Linting

```bash
# Lint
nx lint ui-components

# Lint and fix
nx lint ui-components --fix
```

### Storybook

View and interact with all components in Storybook:

```bash
# Start Storybook dev server
nx storybook ui-components

# Build Storybook static site
nx build-storybook ui-components
```

Storybook will be available at [http://localhost:6006](http://localhost:6006).

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## TypeScript

This library is written in TypeScript and includes type definitions. All components, props, and utilities are fully typed for the best development experience.

## Contributing

Contributions are welcome! Please ensure all tests pass and follow the existing code style.

## Repository

[https://github.com/true-tech-team/true-tech-team](https://github.com/true-tech-team/true-tech-team)

## License

MIT
