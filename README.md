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

      <Button variant="outline" startIcon={<Icon name="check" size={16} />}>
        Save
      </Button>
    </div>
  );
}
```

## App builder

`@true-tech-team/ui-components/app` is an optional layer for pages that load data, keep state in
the URL, check permissions or need app services: `AppProvider`, `Page`, `Section`, URL param and
preference hooks, mutation feedback, router adapters, auth, flags, logging and a debug panel. It
is built on TanStack Query, which is an optional peer dependency (the main entry never imports it).

```bash
npm install @tanstack/react-query
```

Nest the providers with `GlobalProvider` **outside** and `AppProvider` **inside**. With the order
reversed, `AppLink` navigation guards silently stop working.

```tsx
import { GlobalProvider } from '@true-tech-team/ui-components';
import { AppProvider } from '@true-tech-team/ui-components/app';

<GlobalProvider>
  <AppProvider router={useAppRouter} translate={i18n.t} locale={i18n.language}>
    <Routes />
  </AppProvider>
</GlobalProvider>;
```

Without `router`, `AppProvider` uses the browser History API. For a framework, build an adapter
once at module scope from your router's own hooks (the library imports neither framework).

**Next.js App Router**

```tsx
'use client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createNextRouter } from '@true-tech-team/ui-components/app';

export const useAppRouter = createNextRouter({ useRouter, usePathname, useSearchParams, Link });
```

`AppProvider` needs no `<Suspense>`, but components that read URL params (`usePageParams`,
`usePreference`) need a `<Suspense>` boundary above them, per Next.js's rules for
`useSearchParams`. **Limitation:** Next.js cannot block navigation, so unsaved-changes guards
(`FormBuilder guardUnsaved`, `useUnsavedChanges`) protect `AppLink`, `useAppNavigate`, Dialog
close and tab close or reload, but not the browser Back button or your own `router.push` calls.

**React Router**

```tsx
import { Link, useBlocker, useLocation, useNavigate } from 'react-router';
import { createReactRouter } from '@true-tech-team/ui-components/app';

export const useAppRouter = createReactRouter({ useNavigate, useLocation, Link, useBlocker });
```

`useBlocker` (data routers only) is optional; with it, Back and Forward also ask the guards.

**Translation.** Pass your translate function and locale to the provider. Built-in text is
requested as `ui.<key>` (for example `ui.pageMessages.retry`); return nothing for keys you have
not translated and the English default is used. See `guidelines/foundations/labels.md`.

```tsx
<AppProvider translate={i18n.t} locale="fr-FR">
```

A loading, error, empty and forbidden state, a page title and `page_view` tracking come with
`Page`; a failed background refetch keeps the loaded content and shows an inline alert with Retry.

```tsx
<Page title="Orders" queries={[orders]} isEmpty={([rows]) => rows.length === 0}>
  <h1>Orders</h1>
  <OrdersTable rows={orders.data} />
</Page>
```

See the Storybook stories under "App Builder / Foundation" for each piece.

## Design guidelines & AI coding agents

The package ships research-backed design guidelines (WCAG 2.2 AA, NN/g, Baymard, Material 3,
Carbon) written as decision trees that coding agents can follow. They cover which component to
use, color, spacing, typography, layout, motion, accessibility, forms, data views, and
loading/empty/error states.

```
node_modules/@true-tech-team/ui-components/
├── llms.txt                     # index for LLM tools
└── guidelines/
    ├── README.md                # how to apply the rules
    ├── decision-tree.md         # start here
    ├── SKILL.md                 # Claude Code skill wrapper
    ├── components/              # choosing.md, catalog.md (includes the app builder, /app)
    ├── foundations/             # tokens, color, typography, spacing-layout, elevation-shape, motion, accessibility, labels
    └── patterns/                # forms, data-display, feedback-states, page-layout
```

**Point your agent at them.** Add this to your project's `AGENTS.md` or `CLAUDE.md`:

```md
## UI components

This app uses `@true-tech-team/ui-components`. Before writing or changing UI, read
`node_modules/@true-tech-team/ui-components/guidelines/decision-tree.md` and follow the linked
rules (cite rule IDs like `CHOOSE-INPUT-4` in summaries). Use library components before custom
markup, and CSS tokens (`var(--spacing-md)`, `var(--theme-text-primary)`) instead of raw values.
```

**Or install it as a Claude Code skill** so it loads automatically for UI work:

```bash
mkdir -p .claude/skills
cp -r node_modules/@true-tech-team/ui-components/guidelines .claude/skills/ui-components-design
```

Re-copy after upgrading the package to pick up guideline changes.

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

**Available icons:** chevron-down, chevron-up, chevron-left, chevron-right, close, check, info, warning, error, eye, eye-off, user, users, building, dollar, chart-line, chart-bar, trending-down, and more

#### Avatar

User profile avatars with image, initials, and icon variants.

```tsx
<Avatar src="/path/to/image.jpg" alt="User name" size="md" />
<Avatar initials="JD" size="lg" />
<Avatar icon={<Icon name="user" />} variant="secondary" />
```

**Sizes:** xs, sm, md, lg, xl
**Variants:** primary, secondary, tertiary

#### Badge

Notification badges with count display.

```tsx
<Badge count={5} variant="primary" />
<Badge count={99} max={99} variant="error" />
```

#### Chip

Interactive chips for tags and selections.

```tsx
<Chip label="React" onDelete={() => {}} />
<Chip label="TypeScript" variant="outlined" />
```

#### Pill

Status and category pills.

```tsx
<Pill label="Active" variant="success" />
<Pill label="Pending" variant="warning" />
```

#### Tag

Labeling and categorization tags.

```tsx
<Tag>New</Tag>
<Tag variant="success">Available</Tag>
```

#### StatusIndicator

Status indicator dots with labels.

```tsx
<StatusIndicator status="online" label="Online" />
<StatusIndicator status="offline" label="Offline" />
```

#### ProgressBar

Linear progress bars with labels and variants.

```tsx
<ProgressBar value={75} max={100} variant="primary" />
<ProgressBar value={50} label="50%" showLabel />
```

#### CircularProgress

Circular progress indicators.

```tsx
<CircularProgress value={75} size={64} />
<CircularProgress indeterminate size={48} />
```

#### Skeleton

Loading skeleton screens for content placeholders.

```tsx
<Skeleton variant="text" width="100%" />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width={200} height={100} />
```

#### KPI

Key Performance Indicator display component.

```tsx
<KPI
  value="$45,231"
  label="Total Revenue"
  trend={12.5}
  trendDirection="up"
  icon={<Icon name="dollar" />}
/>
```

#### Stat

Statistical display component for metrics.

```tsx
<Stat label="Total Users" value="1,234" change="+12.5%" changeType="increase" />
```

#### List

Comprehensive list component with selection, virtualization, and keyboard navigation.

```tsx
<List
  items={users}
  renderItem={(user) => (
    <ListItem
      key={user.id}
      primary={user.name}
      secondary={user.email}
      icon={<Icon name="user" />}
    />
  )}
  selectable
  onSelectionChange={(selected) => console.log(selected)}
/>
```

#### Table

Data table component with sorting, selection, and pagination.

```tsx
<Table
  data={users}
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', sortable: true },
  ]}
  selectable
  pagination={{ pageSize: 10 }}
  onSort={(key, direction) => console.log(key, direction)}
/>
```

### Drag and Drop

#### SortableList

Reorderable list with drag-and-drop functionality.

```tsx
<DndProvider>
  <SortableList
    items={items}
    onReorder={(newOrder) => setItems(newOrder)}
    renderItem={(item) => (
      <div>
        <DragHandle />
        {item.label}
      </div>
    )}
  />
</DndProvider>
```

#### SortableGrid

Reorderable grid layout with drag-and-drop.

```tsx
<DndProvider>
  <SortableGrid
    items={gridItems}
    columns={3}
    onReorder={(newOrder) => setGridItems(newOrder)}
    renderItem={(item) => <Card>{item.content}</Card>}
  />
</DndProvider>
```

#### KanbanBoard

Kanban-style board with draggable cards between columns.

```tsx
<DndProvider>
  <KanbanBoard
    columns={[
      { id: 'todo', title: 'To Do', items: todoItems },
      { id: 'progress', title: 'In Progress', items: progressItems },
      { id: 'done', title: 'Done', items: doneItems },
    ]}
    onCardMove={(cardId, fromColumn, toColumn) => handleMove(cardId, fromColumn, toColumn)}
  />
</DndProvider>
```

#### ResizablePanels

Resizable panel layouts for split views.

```tsx
<ResizablePanels direction="horizontal">
  <Panel defaultSize={30} minSize={20}>
    <Sidebar />
  </Panel>
  <Panel>
    <MainContent />
  </Panel>
</ResizablePanels>
```

### Filters

#### Filter System

Comprehensive filtering system with various field types and layouts.

```tsx
<FilterProvider filters={filters} onChange={(filters) => console.log(filters)}>
  <FilterBar>
    <TextFilter field="name" label="Name" />
    <SelectFilter
      field="status"
      label="Status"
      options={[
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ]}
    />
    <DateRangeFilter field="createdAt" label="Created" />
    <NumberRangeFilter field="price" label="Price" min={0} max={1000} />
  </FilterBar>
</FilterProvider>
```

### Inputs

#### Input

Text input with validation, formatting, and various configurations.

```tsx
<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  validation={(value) =>
    value.includes('@') ? { valid: true } : { valid: false, message: 'Invalid email' }
  }
/>
```

#### Autocomplete

Input with dropdown suggestions and filtering.

```tsx
<Autocomplete
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
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
    { value: 'ca', label: 'Canada' },
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
<Textarea label="Description" placeholder="Enter description" rows={4} maxLength={500} />
```

#### NumberInput

Numeric input with increment/decrement controls.

```tsx
<NumberInput label="Quantity" min={0} max={100} step={1} value={quantity} onChange={setQuantity} />
```

#### PhoneInput

International phone number input with country selection.

```tsx
<PhoneInput value={phone} onChange={setPhone} defaultCountry="US" />
```

#### Slider

Range slider with marks and custom formatting.

```tsx
<Slider min={0} max={100} value={volume} onChange={setVolume} marks={[0, 25, 50, 75, 100]} />
```

#### Rating

Star rating input component.

```tsx
<Rating value={rating} onChange={setRating} max={5} />
```

#### TagInput

Input for managing multiple tags.

```tsx
<TagInput tags={tags} onChange={setTags} placeholder="Add tag..." />
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
<ColorPicker value={color} onChange={setColor} format="hex" />
```

#### DatePicker

Single date selection with calendar interface.

```tsx
<DatePicker value={date} onChange={setDate} minDate={new Date()} />
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
  presets={[{ label: 'Last 7 days', value: { start: -7, end: 0 } }]}
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
<Popover trigger={<Button>Open Popover</Button>} content={<div>Popover content</div>} />
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

### Navigation

#### Stepper

Multi-step progress indicator for wizard-like interfaces.

```tsx
<Stepper activeStep={1}>
  <Step label="Account" description="Create your account" />
  <Step label="Profile" description="Set up your profile" />
  <Step label="Review" description="Review and submit" />
</Stepper>
```

#### Breadcrumbs

Navigation breadcrumb trail for hierarchical page structure.

```tsx
<Breadcrumbs>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
  <BreadcrumbItem>Current Page</BreadcrumbItem>
</Breadcrumbs>
```

#### Navbar

Responsive navigation bar with collapsible menu support.

```tsx
<Navbar>
  <NavbarBrand>My App</NavbarBrand>
  <NavbarToggle />
  <NavbarCollapse>
    <NavbarNav>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/about">About</NavLink>
    </NavbarNav>
    <NavbarActions>
      <Button>Sign In</Button>
    </NavbarActions>
  </NavbarCollapse>
</Navbar>
```

#### SideNav

Sidebar navigation with groups, items, and dividers.

```tsx
<SideNav>
  <SideNavGroup label="Main">
    <SideNavItem icon={<Icon name="home" />} href="/">
      Dashboard
    </SideNavItem>
    <SideNavItem icon={<Icon name="users" />} href="/users">
      Users
    </SideNavItem>
  </SideNavGroup>
  <SideNavDivider />
  <SideNavItem icon={<Icon name="settings" />} href="/settings">
    Settings
  </SideNavItem>
</SideNav>
```

#### Pagination

Page navigation with customizable controls.

```tsx
<Pagination currentPage={page} totalPages={10} onPageChange={setPage} showFirstLast />
```

#### BottomNavigation

Mobile-friendly bottom navigation bar.

```tsx
<BottomNavigation value={tab} onChange={setTab}>
  <BottomNavigationItem icon={<Icon name="home" />} label="Home" value="home" />
  <BottomNavigationItem icon={<Icon name="search" />} label="Search" value="search" />
  <BottomNavigationItem icon={<Icon name="user" />} label="Profile" value="profile" />
</BottomNavigation>
```

#### Tabs

Tabbed content navigation.

```tsx
<Tabs defaultValue="tab1">
  <TabList>
    <Tab value="tab1">Tab 1</Tab>
    <Tab value="tab2">Tab 2</Tab>
  </TabList>
  <TabPanel value="tab1">Content 1</TabPanel>
  <TabPanel value="tab2">Content 2</TabPanel>
</Tabs>
```

### Layout

#### Panes

Resizable split pane layouts.

```tsx
<Panes direction="horizontal">
  <Pane minSize={200}>Left Panel</Pane>
  <Pane>Right Panel</Pane>
</Panes>
```

#### ResponsiveStack

Stack layout that adapts to screen size.

```tsx
<ResponsiveStack breakpoint={768} spacing={4}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</ResponsiveStack>
```

#### AdaptiveGrid

Auto-adjusting grid layout based on container width.

```tsx
<AdaptiveGrid minItemWidth={250} gap={16}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</AdaptiveGrid>
```

#### MasonryLayout

Pinterest-style masonry grid for variable-height items.

```tsx
<MasonryLayout columns={3} gap={16}>
  <Card>Short content</Card>
  <Card>Much longer content that takes more space</Card>
  <Card>Medium content</Card>
</MasonryLayout>
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
      validation: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
    },
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
            primary: '#007bff',
          },
        },
      }}
    >
      <YourApp />
    </GlobalProvider>
  );
}
```

### Generate a theme with the Theme Builder

Open **Theme Builder** (the first item in Storybook), pick a mood and colors or edit tokens
directly, check the contrast report, and download `theme.json`. Then pass it to the provider:

```tsx
import { GlobalProvider } from '@true-tech-team/ui-components';
import '@true-tech-team/ui-components/index.css';
import theme from './theme.json';

<GlobalProvider themeConfig={theme}>
  <YourApp />
</GlobalProvider>;
```

`themeConfig.theme` accepts `colors`, per-mode `modes.light|dark.colors`, `spacing`,
`typography`, `borderRadius` and `shadows`. See `guidelines/foundations/tokens.md` for the
variable mapping.

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
import { hexToRgb, rgbToHsl, isLightColor, getBrightness } from '@true-tech-team/ui-components';

const rgb = hexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
const hsl = rgbToHsl(255, 0, 0); // { h: 0, s: 100, l: 50 }
const isLight = isLightColor('#ffffff'); // true
```

OKLCH, contrast and theme helpers (used by the Theme Builder):

- `hexToOklch` / `oklchToHex` - convert between hex and OKLCH (`oklchToHex` gamut-maps to sRGB)
- `parseColorToOklch` - parse hex, `rgb()`, `hsl()` or `oklch()` into OKLCH (null if invalid)
- `rotateHue` - rotate a hue angle and normalise it to [0, 360)
- `getRelativeLuminance` / `getContrastRatio` - WCAG 2.x luminance and contrast for hex,
  `rgb()` or `hsl()` colors (`NaN` for unparseable input)
- `themeOverrideToCssVars` - turn a `ThemeOverride` into the CSS variables `GlobalProvider` sets

### Date Utils

```tsx
import { formatDate, getDaysInMonth, isDateInRange, addDays } from '@true-tech-team/ui-components';

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

Storybook will be available at http://localhost:6006.

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

[True Tech Team UI Components Github](https://github.com/TrueTechTeam/true-tech-team/tree/master/libs/ui-components)

## Storybook

[True Tech Team React Components](https://truetechteamcomponents.netlify.app)

## License

MIT
