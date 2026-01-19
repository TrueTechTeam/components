# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/your-org/true-tech-team/compare/v0.0.4...HEAD
[0.0.4]: https://github.com/your-org/true-tech-team/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/your-org/true-tech-team/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/your-org/true-tech-team/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/your-org/true-tech-team/releases/tag/v0.0.1
