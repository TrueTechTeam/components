/**
 * Custom Stylelint plugin to validate CSS variables exist in theme files or current file
 */

const stylelint = require('stylelint');
const path = require('path');
const { getThemeVariables } = require('./extract-theme-vars');

const ruleName = 'true-tech/css-variables-in-theme';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (varName) =>
    `CSS variable "${varName}" is not defined in the theme files (src/lib/styles/theme/) or in the current file`,
});

const meta = {
  url: 'https://github.com/true-tech-team/linting-rules',
};

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary, secondaryOptions, context) => {
  return (root, result) => {
    const validOptions = stylelint.utils.validateOptions(result, ruleName, {
      actual: primary,
      possible: [true, false],
    });

    if (!validOptions || !primary) {
      return;
    }

    // Get the path to the theme directory
    const themePath = path.resolve(process.cwd(), 'src/lib/styles/theme');

    // Extract all valid CSS variables from theme files
    const themeVariables = getThemeVariables(themePath);

    // Extract all CSS variables defined in the current file
    const fileVariables = new Set();
    root.walkDecls((decl) => {
      if (decl.prop.startsWith('--')) {
        fileVariables.add(decl.prop);
      }
    });

    // Combine theme variables and file-local variables
    const allValidVariables = new Set([...themeVariables, ...fileVariables]);

    // Track undefined variables to avoid duplicate reports
    const reportedVariables = new Set();

    // Walk through the AST and check all CSS variable usages
    root.walkDecls((decl) => {
      const value = decl.value;

      // Match var(--variable-name) usage
      const varUsageRegex = /var\((--[\w-]+)(?:,\s*[^)]+)?\)/g;
      let match;

      while ((match = varUsageRegex.exec(value)) !== null) {
        const varName = match[1];

        // Check if this variable is defined in theme files or current file
        if (!allValidVariables.has(varName)) {
          // Only report once per variable
          const key = `${decl.source.start.line}:${decl.source.start.column}:${varName}`;
          if (!reportedVariables.has(key)) {
            reportedVariables.add(key);

            stylelint.utils.report({
              message: messages.rejected(varName),
              node: decl,
              result,
              ruleName,
              word: varName,
            });
          }
        }
      }
    });

    // Also check for CSS variable definitions that might reference other variables
    root.walkDecls((decl) => {
      // Check if this is a CSS variable definition
      if (decl.prop.startsWith('--')) {
        const value = decl.value;

        // Check if the value uses var()
        const varUsageRegex = /var\((--[\w-]+)(?:,\s*[^)]+)?\)/g;
        let match;

        while ((match = varUsageRegex.exec(value)) !== null) {
          const varName = match[1];

          // Check if this variable is defined in theme files or current file
          if (!allValidVariables.has(varName)) {
            const key = `${decl.source.start.line}:${decl.source.start.column}:${varName}`;
            if (!reportedVariables.has(key)) {
              reportedVariables.add(key);

              stylelint.utils.report({
                message: messages.rejected(varName),
                node: decl,
                result,
                ruleName,
                word: varName,
              });
            }
          }
        }
      }
    });
  };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

module.exports = stylelint.createPlugin(ruleName, ruleFunction);
