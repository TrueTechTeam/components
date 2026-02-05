import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    ignores: ['.claude/**', '**/*.template.*', '**/*.md'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {
      // Disable overly strict rules from nx flat/react preset
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',

      // Accessibility rules that are too strict for a UI component library:
      // - UI components often need tabindex on custom elements for keyboard navigation
      'jsx-a11y/no-noninteractive-tabindex': 'off',
      // - Custom components often need click/keyboard handlers on divs
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      // - Custom components may need interactive roles (e.g., menu items using li elements)
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'off',
      // - Deprecated rule; modern browsers handle emojis well
      'jsx-a11y/accessible-emoji': 'off',
      // - Often gives false positives with custom form components
      'jsx-a11y/label-has-associated-control': 'off',
      // - Array index keys are sometimes necessary when items have no stable ID
      'react/no-array-index-key': 'off',
      // - autoFocus is a common and intentional prop on Input components
      'jsx-a11y/no-autofocus': 'off',
      // - Focus is often managed programmatically in UI component libraries
      'jsx-a11y/interactive-supports-focus': 'off',
      // - Some ARIA attributes on custom roles are intentional design patterns
      'jsx-a11y/role-supports-aria-props': 'off',
      // - Mouse events without keyboard alternatives are common in hover interactions
      'jsx-a11y/mouse-events-have-key-events': 'off',
    },
  },
];
