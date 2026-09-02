/**
 * Script to extract all CSS variable names from theme files
 * This is used by the Stylelint plugin to validate CSS variable usage
 */

const fs = require('fs');
const path = require('path');

/**
 * Extracts CSS custom property names from SCSS content
 * @param {string} content - SCSS file content
 * @returns {Set<string>} Set of CSS variable names (including --)
 */
function extractCSSVariables(content) {
  const variables = new Set();

  // Match CSS custom properties: --variable-name: value;
  const cssVarRegex = /--([\w-]+)\s*:/g;
  let match;

  while ((match = cssVarRegex.exec(content)) !== null) {
    variables.add(`--${match[1]}`);
  }

  return variables;
}

/**
 * Reads all theme files and extracts CSS variables
 * @param {string} themePath - Path to theme directory
 * @returns {Set<string>} Set of all CSS variable names
 */
function getThemeVariables(themePath) {
  const allVariables = new Set();

  try {
    const files = fs.readdirSync(themePath);

    files.forEach((file) => {
      if (file.endsWith('.scss')) {
        const filePath = path.join(themePath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const variables = extractCSSVariables(content);

        variables.forEach((v) => allVariables.add(v));
      }
    });
  } catch (error) {
    console.error('Error reading theme files:', error);
  }

  return allVariables;
}

module.exports = {
  extractCSSVariables,
  getThemeVariables,
};
