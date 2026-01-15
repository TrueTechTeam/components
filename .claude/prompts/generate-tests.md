# Generate Tests Prompt Template

Use this prompt template when asking an agent to generate tests for a component.

## Prompt Template

```
Generate comprehensive tests for the [COMPONENT_NAME] component.

COMPONENT LOCATION:
libs/ui-components/src/lib/components/[category]/[ComponentName]/

TEST FILE TO CREATE:
[ComponentName].test.tsx

REQUIRED TEST CATEGORIES:

1. Rendering Tests
   - Renders with default props
   - Renders with all props provided
   - Renders children correctly
   - Renders with custom className

2. Variant Tests
   [List all variants to test]
   - Test each variant renders with correct data attribute
   - Verify default variant is applied

3. Size Tests
   [List all sizes to test]
   - Test each size renders with correct data attribute
   - Verify default size is applied

4. State Tests
   - Test disabled state (data-disabled="true")
   - Verify disabled state excludes attribute when false
   [Add other state tests like selected, loading, etc.]

5. Interaction Tests (if applicable)
   - Test onClick handler is called
   - Test onRemove handler is called (if removable)
   - Test keyboard interactions (Enter, Space, Escape)
   - Test click is prevented when disabled

6. Accessibility Tests
   - Test ARIA label is applied when provided
   - Test data-component attribute is present
   - Test role attribute (if applicable)
   - Test keyboard navigation (if interactive)
   - Test focus management

7. Ref Forwarding Test
   - Test ref is properly forwarded to DOM element
   - Verify ref.current is correct element type

MINIMUM COVERAGE: 70% (branches, functions, lines, statements)

TESTING BEST PRACTICES:
- Use Testing Library queries (screen.getByText, screen.getByRole)
- Test behavior, not implementation
- Use descriptive test names
- Group tests with describe blocks
- Test data attributes with expect().toHaveAttribute()
- Use userEvent for interactions
- Test accessibility with getByLabelText, getByRole

TEMPLATE TO USE:
libs/ui-components/.claude/templates/display-component.template.test.tsx

REFERENCE TESTS:
libs/ui-components/src/lib/components/inputs/TagInput/TagInput.test.tsx

AFTER WRITING TESTS:
```bash
# Run tests
npm run test [ComponentName].test.tsx

# Check coverage
npm run test:coverage [ComponentName].test.tsx
```

VALIDATION:
- All 7 categories covered
- 70%+ coverage achieved
- All variants tested
- All sizes tested
- Ref forwarding tested
- No skipped tests
```

## Example Usage

### Example: Badge Component Tests

```
Generate comprehensive tests for the Badge component.

COMPONENT LOCATION:
libs/ui-components/src/lib/components/display/Badge/

TEST FILE TO CREATE:
Badge.test.tsx

REQUIRED TEST CATEGORIES:

1. Rendering Tests
   - Renders with default props
   - Renders with all props provided
   - Renders children correctly
   - Renders with custom className

2. Variant Tests
   - primary, secondary, success, warning, danger
   - Each renders with correct data-variant attribute
   - Default is 'primary'

3. Size Tests
   - sm, md, lg
   - Each renders with correct data-size attribute
   - Default is 'md'

4. State Tests
   - disabled state (data-disabled="true")
   - Disabled attribute not present when false

5. Interaction Tests
   - Not applicable (Badge is not interactive)

6. Accessibility Tests
   - ARIA label applied when provided
   - data-component="badge" is present

7. Ref Forwarding Test
   - Ref forwarded to HTMLSpanElement
   - ref.current has correct content

TEMPLATE TO USE:
libs/ui-components/.claude/templates/display-component.template.test.tsx

REFERENCE TESTS:
libs/ui-components/src/lib/components/inputs/TagInput/TagInput.test.tsx
```

## Test Structure Template

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  describe('rendering', () => {
    // Rendering tests
  });

  describe('variants', () => {
    // All variant tests
  });

  describe('sizes', () => {
    // All size tests
  });

  describe('states', () => {
    // State tests (disabled, selected, etc.)
  });

  describe('interactions', () => {
    // Interaction tests (if applicable)
  });

  describe('accessibility', () => {
    // ARIA and accessibility tests
  });

  describe('ref forwarding', () => {
    // Ref test
  });
});
```

## Common Test Patterns

### Testing Data Attributes
```typescript
it('renders primary variant', () => {
  render(<Component variant="primary">Test</Component>);
  const element = screen.getByText('Test');
  expect(element).toHaveAttribute('data-variant', 'primary');
});
```

### Testing Boolean Attributes
```typescript
it('adds disabled attribute when disabled', () => {
  render(<Component disabled>Test</Component>);
  expect(screen.getByText('Test')).toHaveAttribute('data-disabled', 'true');
});

it('does not add disabled attribute when not disabled', () => {
  render(<Component>Test</Component>);
  expect(screen.getByText('Test')).not.toHaveAttribute('data-disabled');
});
```

### Testing Interactions
```typescript
import userEvent from '@testing-library/user-event';

it('calls onClick handler', async () => {
  const user = userEvent.setup();
  const handleClick = jest.fn();
  render(<Component onClick={handleClick}>Test</Component>);

  await user.click(screen.getByText('Test'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Testing Ref Forwarding
```typescript
it('forwards ref to element', () => {
  const ref = React.createRef<HTMLSpanElement>();
  render(<Component ref={ref}>Test</Component>);

  expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  expect(ref.current).toHaveTextContent('Test');
});
```

## Notes

- Always achieve 70%+ coverage
- Test all variants and sizes
- Test data attributes, not CSS classes
- Use descriptive test names
- Group related tests with describe blocks
- Test accessibility thoroughly
- Don't skip tests - fix failing tests instead
