# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.10] - 2026-01-29

### Changed

- Comprehensive component library update with improved styling and accessibility
- Updated Button, IconButton, and ToggleButton components with refined styling
- Enhanced display components (Accordion, Avatar, Badge, Card, Carousel, Chip, etc.)
- Improved drag-and-drop components (DndProvider, SortableList, SortableGrid, KanbanBoard)
- Updated filter components with better state management and styling
- Enhanced form components (FormBuilder) with improved validation
- Updated input components (Autocomplete, Checkbox, DatePicker, Input, Select, etc.)
- Refined Icon component and added new icon variants
- Improved Storybook configuration and stories
- Updated test configurations and improved test coverage
- Enhanced SCSS modules across all components for better theming consistency

## [0.0.6] - 2026-01-29

### Added

- New display components:
  - List - Comprehensive list component with selection, virtualization, and keyboard navigation
  - ListItem - Individual list items with icons, actions, and selection states
  - ListGroup - Grouped list items with headers
  - ListHeader - List headers with sorting controls
  - ListEmpty - Empty state display for lists
  - ListSearch - Integrated search functionality for lists
  - ListSkeleton - Loading skeleton for lists
  - Table - Data table component with sorting, selection, and pagination
  - TableHeader - Table header with sortable columns
  - TableBody - Table body container
  - TableRow - Table rows with selection and expansion
  - TableCell - Table cells with alignment and formatting
  - TableSearch - Integrated search for tables
  - TableSkeleton - Loading skeleton for tables
- New drag-and-drop (dnd) components:
  - DndProvider - Context provider for drag-and-drop functionality
  - DragHandle - Handle component for initiating drag operations
  - DragOverlay - Visual overlay during drag operations
  - SortableList - Reorderable list with drag-and-drop
  - SortableGrid - Reorderable grid layout with drag-and-drop
  - KanbanBoard - Kanban-style board with draggable cards between columns
  - ResizablePanels - Resizable panel layouts
- New filters system:
  - FilterContext - Context provider for filter state management
  - Filter fields (text, select, date range, number range, etc.)
  - Filter layouts (inline, popover, sidebar)
  - Filter hooks for state management and persistence

### Changed

- Improved Collapse component animations and transitions
- Enhanced OverflowText with better tooltip integration
- Updated TruncatedList with smoother expand/collapse behavior
- Improved NumberInput with better keyboard handling
- Enhanced Dropdown positioning and accessibility
- Updated Popover with improved positioning logic
- Enhanced Tooltip styling and positioning
- Improved ToastProvider with better queue management

## [0.0.5] - 2026-01-25

### Added

- New navigation components:
  - Stepper - Multi-step progress indicator with customizable steps
  - Breadcrumbs - Navigation breadcrumb trail with path utilities
  - Navbar - Responsive navigation bar with collapsible menu
  - SideNav - Sidebar navigation with groups and dividers
  - Pagination - Page navigation with customizable controls
  - BottomNavigation - Mobile-friendly bottom navigation bar
  - CollapsibleSidebar - Expandable/collapsible sidebar
  - NavLink - Navigation link with active state styling
- New layout components:
  - Panes - Resizable split pane layouts
  - ResponsiveStack - Stack layout that adapts to screen size
  - AdaptiveGrid - Auto-adjusting grid layout
  - MasonryLayout - Pinterest-style masonry grid
- New display components:
  - Tabs - Tabbed content navigation
  - ScrollArea - Custom scrollable container
  - OverflowText - Text with overflow handling and tooltips
  - TruncatedList - List with show more/less functionality
- New input components:
  - CheckboxGroup - Group of related checkboxes with shared state
- New button components:
  - ButtonToggleGroup - Group of toggle buttons with single/multi selection
  - ToggleButton - Individual toggle button component
- New icons:
  - BookmarkFilled, HeartFilled, StarFilled, ThumbsUpFilled (filled variants)
  - ChevronsLeft, ChevronsRight (double chevrons)
  - More (three dots menu icon)
- New hooks:
  - useResizeObserver - Hook for observing element resize events

### Changed

- Updated Card component styles
- Updated Tooltip styles
- Enhanced useAlert and useDialog hooks

## [0.0.4] - 2026-01-19

### Added

- New display components:
  - Accordion - Collapsible content sections
  - Card - Content container with various styles
  - Carousel - Image/content slideshow component
  - Collapse - Animated collapsible panel
  - CountUp - Animated number counter
  - FlipCard - Interactive flip animation card
  - Reveal - Scroll-triggered reveal animations
  - Spinner - Loading spinner component
  - LoadingOverlay - Full-screen loading overlay
- Added `loading` prop to Toggle component
- Added additional status types to Avatar (`online`, `offline`, `away`, `busy`)
- Added aria-label to StatusIndicator for accessibility

### Changed

- Updated StatusIndicator to support user presence status types
- Improved test coverage and fixed failing tests
- Updated ESLint configuration to ignore template files
- Updated Jest configuration to exclude template test files

### Fixed

- Fixed React hooks rule violations in Storybook stories
- Fixed Button component ref forwarding type casting
- Fixed Pill component test queries to use correct selectors
- Removed non-existent ExpandableCard export

## [0.0.3] - 2026-01-17

### Changed

- Migrated icon system from individual SVG files to React component-based icons
- Updated Icon component to use new icon component architecture
- Updated Button component with improved icon integration
- Updated IconButton component with new icon system
- Updated Input component with icon support improvements
- Updated form components (Autocomplete, Checkbox, DatePicker, Radio, Rating, Select) with new icon handling
- Updated overlay components (Dropdown, Menu) with new icon integration

### Removed

- Removed individual SVG icon files in favor of React icon components
- Removed legacy icon index exports

## [0.0.2] - 2026-01-14

### Added

- New display components now exported:
  - Badge - Notification badges with count display
  - Chip - Interactive chips for tags and selections
  - Label - Text labels for forms and UI elements
  - Pill - Status and category pills
  - Tag - Labeling and categorization tags
  - Avatar - User profile avatars with image, initials, and icon variants
  - StatusIndicator - Status indicator dots
  - ProgressBar - Linear progress bars
  - CircularProgress - Circular progress indicators
  - Stat - Statistical display component
  - KPI - Key Performance Indicator display component
  - Skeleton - Loading skeleton screens
- New icons added to icon library:
  - user, users, building, dollar
  - chart-line, chart-bar, trending-down

### Changed

- Updated Storybook preview decorator with improved centering and flexbox layout
- Refined theme color variables for better consistency:
  - Updated success, warning, and error colors in both light and dark themes
  - Adjusted hover, active, and disabled states for semantic colors
  - Added info-500 token for consistency
- Improved component exports in display/index.ts for better tree-shaking

### Fixed

- Fixed Jest configuration: changed `coverageThresholds` to `coverageThreshold`
- Updated SVG mock in test-setup.ts to properly return React elements
- Added .claude directory to lint ignore patterns

### Removed

- Removed documentation markdown files (moved to dedicated docs):
  - COMPONENT_ORGANIZATION.md
  - COMPONENT_STYLE_GUIDE.md
  - REORGANIZATION_SUMMARY.md
  - STORYBOOK_CLEANUP_REPORT.md
  - STORYBOOK_REORGANIZATION.md

## [0.0.1] - 2026-01-14

### Added

- Initial release of @true-tech-team/react-components
- Display components:
  - Avatar - User profile avatars with image, initials, and icon variants
  - Badge - Notification badges with count display
  - Chip - Interactive chips for tags and selections
  - CircularProgress - Circular progress indicators
  - Icon - SVG icon component with extensive icon library
  - KPI - Key Performance Indicator display component
  - Pill - Status and category pills
  - ProgressBar - Linear progress bars
  - Skeleton - Loading skeleton screens
  - StatusIndicator - Status indicator dots
  - Tag - Labeling and categorization tags
- Theme support with light and dark mode variants
- Storybook documentation for all components
- TypeScript definitions
- Jest testing setup
- ESLint and Prettier configuration

### Infrastructure

- NX monorepo setup
- Build scripts for ESM and CJS outputs
- Test coverage configuration
- Storybook integration

[Unreleased]: https://github.com/your-org/true-tech-team/compare/v0.0.10...HEAD
[0.0.10]: https://github.com/your-org/true-tech-team/compare/v0.0.6...v0.0.10
[0.0.6]: https://github.com/your-org/true-tech-team/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/your-org/true-tech-team/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/your-org/true-tech-team/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/your-org/true-tech-team/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/your-org/true-tech-team/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/your-org/true-tech-team/releases/tag/v0.0.1
