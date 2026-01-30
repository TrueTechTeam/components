import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, useEffect } from 'react';
import './Theme.stories.scss';
import Button from '../../components/buttons/Button';

// ============================================================================
// TYPES
// ============================================================================

interface ColorSwatchProps {
  name: string;
  variable: string;
  showValue?: boolean;
}

interface SpacingBlockProps {
  name: string;
  variable: string;
  size: string;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function ColorSwatch({ name, variable, showValue = true }: ColorSwatchProps) {
  const [computedColor, setComputedColor] = useState('');

  useEffect(() => {
    const color = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    setComputedColor((prev) => (prev !== color ? color : prev));
  }, [variable]);

  return (
    <div className="theme-story__color-swatch">
      <div className="theme-story__color-preview" style={{ backgroundColor: `var(${variable})` }} />
      <div className="theme-story__color-info">
        <span className="theme-story__color-name">{name}</span>
        <code className="theme-story__color-variable">{variable}</code>
        {showValue && computedColor && (
          <span className="theme-story__color-value">{computedColor}</span>
        )}
      </div>
    </div>
  );
}

function SpacingBlock({ name, variable, size }: SpacingBlockProps) {
  return (
    <div className="theme-story__spacing-item">
      <div className="theme-story__spacing-visual">
        <div
          className="theme-story__spacing-block"
          style={{ width: `var(${variable})`, height: `var(${variable})` }}
        />
      </div>
      <div className="theme-story__spacing-info">
        <span className="theme-story__spacing-name">{name}</span>
        <code className="theme-story__spacing-variable">{variable}</code>
        <span className="theme-story__spacing-value">{size}</span>
      </div>
    </div>
  );
}

function RadiusBlock({ name, variable, size }: { name: string; variable: string; size: string }) {
  return (
    <div className="theme-story__radius-item">
      <div className="theme-story__radius-preview" style={{ borderRadius: `var(${variable})` }} />
      <div className="theme-story__radius-info">
        <span className="theme-story__radius-name">{name}</span>
        <code className="theme-story__radius-variable">{variable}</code>
        <span className="theme-story__radius-value">{size}</span>
      </div>
    </div>
  );
}

function ShadowBlock({ name, variable }: { name: string; variable: string }) {
  return (
    <div className="theme-story__shadow-item">
      <div className="theme-story__shadow-preview" style={{ boxShadow: `var(${variable})` }} />
      <div className="theme-story__shadow-info">
        <span className="theme-story__shadow-name">{name}</span>
        <code className="theme-story__shadow-variable">{variable}</code>
      </div>
    </div>
  );
}

function TransitionBlock({
  name,
  variable,
  duration,
}: {
  name: string;
  variable: string;
  duration: string;
}) {
  const [active, setActive] = useState(false);

  return (
    <div className="theme-story__transition-item">
      <button
        type="button"
        className={`theme-story__transition-preview ${active ? 'active' : ''}`}
        style={{ transition: `var(${variable})` }}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
      >
        Hover me
      </button>
      <div className="theme-story__transition-info">
        <span className="theme-story__transition-name">{name}</span>
        <code className="theme-story__transition-variable">{variable}</code>
        <span className="theme-story__transition-value">{duration}</span>
      </div>
    </div>
  );
}

// ============================================================================
// COLOR PALETTE STORY
// ============================================================================

const colorFamilies = [
  { name: 'Red', prefix: '--color-red' },
  { name: 'Orange', prefix: '--color-orange' },
  { name: 'Amber', prefix: '--color-amber' },
  { name: 'Yellow', prefix: '--color-yellow' },
  { name: 'Lime', prefix: '--color-lime' },
  { name: 'Green', prefix: '--color-green' },
  { name: 'Emerald', prefix: '--color-emerald' },
  { name: 'Teal', prefix: '--color-teal' },
  { name: 'Cyan', prefix: '--color-cyan' },
  { name: 'Sky', prefix: '--color-sky' },
  { name: 'Blue', prefix: '--color-blue' },
  { name: 'Indigo', prefix: '--color-indigo' },
  { name: 'Violet', prefix: '--color-violet' },
  { name: 'Purple', prefix: '--color-purple' },
  { name: 'Fuchsia', prefix: '--color-fuchsia' },
  { name: 'Pink', prefix: '--color-pink' },
  { name: 'Rose', prefix: '--color-rose' },
  { name: 'Slate', prefix: '--color-slate' },
  { name: 'Gray', prefix: '--color-gray' },
  { name: 'Zinc', prefix: '--color-zinc' },
  { name: 'Neutral', prefix: '--color-neutral' },
  { name: 'Stone', prefix: '--color-stone' },
  { name: 'Brown', prefix: '--color-brown' },
  { name: 'Copper', prefix: '--color-copper' },
  { name: 'Gold', prefix: '--color-gold' },
  { name: 'Silver', prefix: '--color-silver' },
  { name: 'Olive', prefix: '--color-olive' },
  { name: 'Mint', prefix: '--color-mint' },
  { name: 'Navy', prefix: '--color-navy' },
  { name: 'Coral', prefix: '--color-coral' },
  { name: 'Turquoise', prefix: '--color-turquoise' },
  { name: 'Magenta', prefix: '--color-magenta' },
];

const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

function ColorPaletteStory() {
  const [filter, setFilter] = useState('');

  const filteredFamilies = colorFamilies.filter((family) =>
    family.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="theme-story">
      <div className="theme-story__header">
        <h2>Color Palette</h2>
        <p>A comprehensive color palette with 32 color families, each with 10 shades (50-900).</p>
        <input
          type="text"
          placeholder="Filter colors..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="theme-story__filter-input"
        />
      </div>

      <div className="theme-story__section">
        <h3>Black & White</h3>
        <div className="theme-story__color-row">
          <ColorSwatch name="Black" variable="--color-black" />
          <ColorSwatch name="White" variable="--color-white" />
        </div>
      </div>

      {filteredFamilies.map((family) => (
        <div key={family.name} className="theme-story__section">
          <h3>{family.name}</h3>
          <div className="theme-story__color-scale">
            {shades.map((shade) => (
              <div key={shade} className="theme-story__color-scale-item">
                <div
                  className="theme-story__color-scale-preview"
                  style={{ backgroundColor: `var(${family.prefix}-${shade})` }}
                />
                <span className="theme-story__color-scale-shade">{shade}</span>
              </div>
            ))}
          </div>
          <code className="theme-story__color-scale-variable">{family.prefix}-[50-900]</code>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// THEME TOKENS STORY
// ============================================================================

function ThemeTokensStory() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, [theme]);

  return (
    <div className="theme-story">
      <div className="theme-story__header">
        <h2>Theme Tokens</h2>
        <p>Semantic color tokens that adapt to light and dark themes.</p>
        <div className="theme-story__theme-toggle">
          <Button
            variant={theme === 'light' ? 'primary' : 'secondary'}
            onClick={() => setTheme('light')}
          >
            Light
          </Button>
          <Button
            variant={theme === 'dark' ? 'primary' : 'secondary'}
            onClick={() => setTheme('dark')}
          >
            Dark
          </Button>
        </div>
      </div>

      <div className="theme-story__section">
        <h3>Primary Colors</h3>
        <div className="theme-story__token-grid">
          <ColorSwatch name="Primary" variable="--theme-primary" />
          <ColorSwatch name="Primary Hover" variable="--theme-primary-hover" />
          <ColorSwatch name="Primary Active" variable="--theme-primary-active" />
          <ColorSwatch name="Primary Disabled" variable="--theme-primary-disabled" />
        </div>
        <h4>Primary Shades</h4>
        <div className="theme-story__token-grid">
          <ColorSwatch name="50" variable="--theme-primary-50" />
          <ColorSwatch name="100" variable="--theme-primary-100" />
          <ColorSwatch name="200" variable="--theme-primary-200" />
          <ColorSwatch name="500" variable="--theme-primary-500" />
          <ColorSwatch name="600" variable="--theme-primary-600" />
          <ColorSwatch name="700" variable="--theme-primary-700" />
          <ColorSwatch name="900" variable="--theme-primary-900" />
        </div>
      </div>

      <div className="theme-story__section">
        <h3>Secondary Colors</h3>
        <div className="theme-story__token-grid">
          <ColorSwatch name="Secondary" variable="--theme-secondary" />
          <ColorSwatch name="Secondary Hover" variable="--theme-secondary-hover" />
          <ColorSwatch name="Secondary Active" variable="--theme-secondary-active" />
          <ColorSwatch name="Secondary Disabled" variable="--theme-secondary-disabled" />
        </div>
      </div>

      <div className="theme-story__section">
        <h3>Tertiary Colors</h3>
        <div className="theme-story__token-grid">
          <ColorSwatch name="Tertiary" variable="--theme-tertiary" />
          <ColorSwatch name="50" variable="--theme-tertiary-50" />
          <ColorSwatch name="100" variable="--theme-tertiary-100" />
          <ColorSwatch name="200" variable="--theme-tertiary-200" />
          <ColorSwatch name="400" variable="--theme-tertiary-400" />
          <ColorSwatch name="500" variable="--theme-tertiary-500" />
          <ColorSwatch name="700" variable="--theme-tertiary-700" />
        </div>
      </div>

      <div className="theme-story__section">
        <h3>Semantic Colors</h3>
        <div className="theme-story__token-grid">
          <ColorSwatch name="Success" variable="--theme-success" />
          <ColorSwatch name="Warning" variable="--theme-warning" />
          <ColorSwatch name="Error" variable="--theme-error" />
          <ColorSwatch name="Info" variable="--theme-info" />
        </div>
      </div>

      <div className="theme-story__section">
        <h3>Backgrounds</h3>
        <div className="theme-story__token-grid">
          <ColorSwatch name="Primary" variable="--theme-background-primary" />
          <ColorSwatch name="Secondary" variable="--theme-background-secondary" />
          <ColorSwatch name="Tertiary" variable="--theme-background-tertiary" />
        </div>
      </div>

      <div className="theme-story__section">
        <h3>Surfaces</h3>
        <div className="theme-story__token-grid">
          <ColorSwatch name="Primary" variable="--theme-surface-primary" />
          <ColorSwatch name="Secondary" variable="--theme-surface-secondary" />
          <ColorSwatch name="Elevated" variable="--theme-surface-elevated" />
        </div>
      </div>

      <div className="theme-story__section">
        <h3>Text Colors</h3>
        <div className="theme-story__text-samples">
          <div className="theme-story__text-sample" style={{ color: 'var(--theme-text-primary)' }}>
            <span>Primary Text</span>
            <code>--theme-text-primary</code>
          </div>
          <div
            className="theme-story__text-sample"
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            <span>Secondary Text</span>
            <code>--theme-text-secondary</code>
          </div>
          <div className="theme-story__text-sample" style={{ color: 'var(--theme-text-tertiary)' }}>
            <span>Tertiary Text</span>
            <code>--theme-text-tertiary</code>
          </div>
          <div className="theme-story__text-sample" style={{ color: 'var(--theme-text-disabled)' }}>
            <span>Disabled Text</span>
            <code>--theme-text-disabled</code>
          </div>
        </div>
      </div>

      <div className="theme-story__section">
        <h3>Borders</h3>
        <div className="theme-story__border-samples">
          <div
            className="theme-story__border-sample"
            style={{ borderColor: 'var(--theme-border-primary)' }}
          >
            <span>Primary Border</span>
            <code>--theme-border-primary</code>
          </div>
          <div
            className="theme-story__border-sample"
            style={{ borderColor: 'var(--theme-border-secondary)' }}
          >
            <span>Secondary Border</span>
            <code>--theme-border-secondary</code>
          </div>
          <div
            className="theme-story__border-sample"
            style={{ borderColor: 'var(--theme-border-focus)' }}
          >
            <span>Focus Border</span>
            <code>--theme-border-focus</code>
          </div>
        </div>
      </div>

      <div className="theme-story__section">
        <h3>Interactive States</h3>
        <div className="theme-story__token-grid">
          <ColorSwatch name="Hover" variable="--theme-interactive-hover" />
          <ColorSwatch name="Focus" variable="--theme-interactive-focus" />
          <ColorSwatch name="Active" variable="--theme-interactive-active" />
          <ColorSwatch name="Disabled" variable="--theme-interactive-disabled" />
        </div>
      </div>

      <div className="theme-story__section">
        <h3>Form Controls</h3>
        <div className="theme-story__token-grid">
          <ColorSwatch name="Input BG" variable="--theme-input-bg" />
          <ColorSwatch name="Input Border" variable="--theme-input-border" />
          <ColorSwatch name="Input Border Hover" variable="--theme-input-border-hover" />
          <ColorSwatch name="Input Border Focus" variable="--theme-input-border-focus" />
          <ColorSwatch name="Control BG" variable="--theme-control-bg" />
          <ColorSwatch name="Control BG Checked" variable="--theme-control-bg-checked" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SPACING STORY
// ============================================================================

function SpacingStory() {
  return (
    <div className="theme-story">
      <div className="theme-story__header">
        <h2>Spacing Scale</h2>
        <p>A consistent spacing scale based on a 4px grid system.</p>
      </div>

      <div className="theme-story__section">
        <h3>Spacing Variables</h3>
        <div className="theme-story__spacing-grid">
          <SpacingBlock name="Unit" variable="--spacing-unit" size="4px" />
          <SpacingBlock name="XS" variable="--spacing-xs" size="4px" />
          <SpacingBlock name="SM" variable="--spacing-sm" size="8px" />
          <SpacingBlock name="MD" variable="--spacing-md" size="16px" />
          <SpacingBlock name="LG" variable="--spacing-lg" size="24px" />
          <SpacingBlock name="XL" variable="--spacing-xl" size="32px" />
          <SpacingBlock name="XXL" variable="--spacing-xxl" size="48px" />
        </div>
      </div>

      <div className="theme-story__section">
        <h3>Usage Examples</h3>
        <div className="theme-story__usage-example">
          <code>padding: var(--spacing-md);</code>
          <div className="theme-story__usage-preview" style={{ padding: 'var(--spacing-md)' }}>
            Content with 16px padding
          </div>
        </div>
        <div className="theme-story__usage-example">
          <code>gap: var(--spacing-sm);</code>
          <div className="theme-story__usage-preview-flex" style={{ gap: 'var(--spacing-sm)' }}>
            <div>Item 1</div>
            <div>Item 2</div>
            <div>Item 3</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TYPOGRAPHY STORY
// ============================================================================

function TypographyStory() {
  return (
    <div className="theme-story">
      <div className="theme-story__header">
        <h2>Typography</h2>
        <p>Font families, sizes, weights, and line heights.</p>
      </div>

      <div className="theme-story__section">
        <h3>Font Families</h3>
        <div className="theme-story__font-samples">
          <div
            className="theme-story__font-sample"
            style={{ fontFamily: 'var(--font-family-primary)' }}
          >
            <span>Primary Font Family</span>
            <code>--font-family-primary</code>
            <p>The quick brown fox jumps over the lazy dog.</p>
          </div>
          <div
            className="theme-story__font-sample"
            style={{ fontFamily: 'var(--font-family-mono)' }}
          >
            <span>Mono Font Family</span>
            <code>--font-family-mono</code>
            <p>const hello = &quot;world&quot;;</p>
          </div>
        </div>
      </div>

      <div className="theme-story__section">
        <h3>Font Sizes</h3>
        <div className="theme-story__font-size-samples">
          {[
            { name: 'XS', variable: '--font-size-xs', size: '12px' },
            { name: 'SM', variable: '--font-size-sm', size: '14px' },
            { name: 'Base', variable: '--font-size-base', size: '16px' },
            { name: 'LG', variable: '--font-size-lg', size: '18px' },
            { name: 'XL', variable: '--font-size-xl', size: '20px' },
            { name: '2XL', variable: '--font-size-2xl', size: '24px' },
            { name: '3XL', variable: '--font-size-3xl', size: '30px' },
            { name: '4XL', variable: '--font-size-4xl', size: '36px' },
          ].map((item) => (
            <div key={item.name} className="theme-story__font-size-sample">
              <span style={{ fontSize: `var(${item.variable})` }}>Aa</span>
              <div className="theme-story__font-size-info">
                <strong>{item.name}</strong>
                <code>{item.variable}</code>
                <span>{item.size}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="theme-story__section">
        <h3>Font Weights</h3>
        <div className="theme-story__font-weight-samples">
          {[
            { name: 'Light', variable: '--font-weight-light', weight: '300' },
            { name: 'Normal', variable: '--font-weight-normal', weight: '400' },
            { name: 'Medium', variable: '--font-weight-medium', weight: '500' },
            { name: 'Semibold', variable: '--font-weight-semibold', weight: '600' },
            { name: 'Bold', variable: '--font-weight-bold', weight: '700' },
          ].map((item) => (
            <div key={item.name} className="theme-story__font-weight-sample">
              <span style={{ fontWeight: `var(${item.variable})` }}>The quick brown fox</span>
              <div className="theme-story__font-weight-info">
                <strong>{item.name}</strong>
                <code>{item.variable}</code>
                <span>{item.weight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="theme-story__section">
        <h3>Line Heights</h3>
        <div className="theme-story__line-height-samples">
          {[
            { name: 'Tight', variable: '--line-height-tight', value: '1.25' },
            { name: 'Normal', variable: '--line-height-normal', value: '1.5' },
            { name: 'Relaxed', variable: '--line-height-relaxed', value: '1.75' },
          ].map((item) => (
            <div key={item.name} className="theme-story__line-height-sample">
              <div style={{ lineHeight: `var(${item.variable})` }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </div>
              <div className="theme-story__line-height-info">
                <strong>{item.name}</strong>
                <code>{item.variable}</code>
                <span>{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// BORDERS & RADIUS STORY
// ============================================================================

function BordersStory() {
  return (
    <div className="theme-story">
      <div className="theme-story__header">
        <h2>Border Radius</h2>
        <p>Consistent border radius values for rounded corners.</p>
      </div>

      <div className="theme-story__section">
        <h3>Radius Scale</h3>
        <div className="theme-story__radius-grid">
          <RadiusBlock name="None" variable="--radius-none" size="0" />
          <RadiusBlock name="SM" variable="--radius-sm" size="4px" />
          <RadiusBlock name="MD" variable="--radius-md" size="8px" />
          <RadiusBlock name="LG" variable="--radius-lg" size="12px" />
          <RadiusBlock name="XL" variable="--radius-xl" size="16px" />
          <RadiusBlock name="Full" variable="--radius-full" size="9999px" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SHADOWS STORY
// ============================================================================

function ShadowsStory() {
  return (
    <div className="theme-story">
      <div className="theme-story__header">
        <h2>Shadows</h2>
        <p>Elevation shadows for depth and hierarchy.</p>
      </div>

      <div className="theme-story__section">
        <h3>Shadow Scale</h3>
        <div className="theme-story__shadow-grid">
          <ShadowBlock name="Small" variable="--theme-shadow-sm" />
          <ShadowBlock name="Medium" variable="--theme-shadow-md" />
          <ShadowBlock name="Large" variable="--theme-shadow-lg" />
          <ShadowBlock name="Extra Large" variable="--theme-shadow-xl" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TRANSITIONS STORY
// ============================================================================

function TransitionsStory() {
  return (
    <div className="theme-story">
      <div className="theme-story__header">
        <h2>Transitions</h2>
        <p>Consistent animation timing for smooth interactions.</p>
      </div>

      <div className="theme-story__section">
        <h3>Transition Speeds</h3>
        <div className="theme-story__transition-grid">
          <TransitionBlock name="Fast" variable="--transition-fast" duration="150ms" />
          <TransitionBlock name="Normal" variable="--transition-normal" duration="250ms" />
          <TransitionBlock name="Slow" variable="--transition-slow" duration="350ms" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Z-INDEX STORY
// ============================================================================

function ZIndexStory() {
  return (
    <div className="theme-story">
      <div className="theme-story__header">
        <h2>Z-Index Scale</h2>
        <p>Consistent z-index values for layering UI elements.</p>
      </div>

      <div className="theme-story__section">
        <h3>Z-Index Values</h3>
        <div className="theme-story__zindex-visualization">
          {[
            { name: 'Tooltip', variable: '--z-tooltip', value: '1600' },
            { name: 'Popover', variable: '--z-popover', value: '1500' },
            { name: 'Modal', variable: '--z-modal', value: '1400' },
            { name: 'Modal Backdrop', variable: '--z-modal-backdrop', value: '1300' },
            { name: 'Fixed', variable: '--z-fixed', value: '1200' },
            { name: 'Sticky', variable: '--z-sticky', value: '1100' },
            { name: 'Dropdown', variable: '--z-dropdown', value: '1000' },
          ].map((item, index) => (
            <div
              key={item.name}
              className="theme-story__zindex-layer"
              style={{
                zIndex: parseInt(item.value),
                transform: `translateY(${index * 8}px)`,
              }}
            >
              <span className="theme-story__zindex-name">{item.name}</span>
              <code className="theme-story__zindex-variable">{item.variable}</code>
              <span className="theme-story__zindex-value">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ALL VARIABLES STORY
// ============================================================================

function AllVariablesStory() {
  return (
    <div className="theme-story">
      <div className="theme-story__header">
        <h2>All CSS Variables</h2>
        <p>Complete reference of all available CSS custom properties.</p>
      </div>

      <div className="theme-story__variables-table">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Variable</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3}>
                <strong>Spacing</strong>
              </td>
            </tr>
            <tr>
              <td>Spacing</td>
              <td>
                <code>--spacing-unit</code>
              </td>
              <td>4px</td>
            </tr>
            <tr>
              <td>Spacing</td>
              <td>
                <code>--spacing-xs</code>
              </td>
              <td>4px</td>
            </tr>
            <tr>
              <td>Spacing</td>
              <td>
                <code>--spacing-sm</code>
              </td>
              <td>8px</td>
            </tr>
            <tr>
              <td>Spacing</td>
              <td>
                <code>--spacing-md</code>
              </td>
              <td>16px</td>
            </tr>
            <tr>
              <td>Spacing</td>
              <td>
                <code>--spacing-lg</code>
              </td>
              <td>24px</td>
            </tr>
            <tr>
              <td>Spacing</td>
              <td>
                <code>--spacing-xl</code>
              </td>
              <td>32px</td>
            </tr>
            <tr>
              <td>Spacing</td>
              <td>
                <code>--spacing-xxl</code>
              </td>
              <td>48px</td>
            </tr>

            <tr>
              <td colSpan={3}>
                <strong>Border Radius</strong>
              </td>
            </tr>
            <tr>
              <td>Radius</td>
              <td>
                <code>--radius-none</code>
              </td>
              <td>0</td>
            </tr>
            <tr>
              <td>Radius</td>
              <td>
                <code>--radius-sm</code>
              </td>
              <td>4px</td>
            </tr>
            <tr>
              <td>Radius</td>
              <td>
                <code>--radius-md</code>
              </td>
              <td>8px</td>
            </tr>
            <tr>
              <td>Radius</td>
              <td>
                <code>--radius-lg</code>
              </td>
              <td>12px</td>
            </tr>
            <tr>
              <td>Radius</td>
              <td>
                <code>--radius-xl</code>
              </td>
              <td>16px</td>
            </tr>
            <tr>
              <td>Radius</td>
              <td>
                <code>--radius-full</code>
              </td>
              <td>9999px</td>
            </tr>

            <tr>
              <td colSpan={3}>
                <strong>Typography</strong>
              </td>
            </tr>
            <tr>
              <td>Font</td>
              <td>
                <code>--font-family-primary</code>
              </td>
              <td>system-ui, ...</td>
            </tr>
            <tr>
              <td>Font</td>
              <td>
                <code>--font-family-mono</code>
              </td>
              <td>Courier New, monospace</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>
                <code>--font-size-xs</code>
              </td>
              <td>0.75rem (12px)</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>
                <code>--font-size-sm</code>
              </td>
              <td>0.875rem (14px)</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>
                <code>--font-size-base</code>
              </td>
              <td>1rem (16px)</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>
                <code>--font-size-lg</code>
              </td>
              <td>1.125rem (18px)</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>
                <code>--font-size-xl</code>
              </td>
              <td>1.25rem (20px)</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>
                <code>--font-size-2xl</code>
              </td>
              <td>1.5rem (24px)</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>
                <code>--font-size-3xl</code>
              </td>
              <td>1.875rem (30px)</td>
            </tr>
            <tr>
              <td>Size</td>
              <td>
                <code>--font-size-4xl</code>
              </td>
              <td>2.25rem (36px)</td>
            </tr>
            <tr>
              <td>Weight</td>
              <td>
                <code>--font-weight-light</code>
              </td>
              <td>300</td>
            </tr>
            <tr>
              <td>Weight</td>
              <td>
                <code>--font-weight-normal</code>
              </td>
              <td>400</td>
            </tr>
            <tr>
              <td>Weight</td>
              <td>
                <code>--font-weight-medium</code>
              </td>
              <td>500</td>
            </tr>
            <tr>
              <td>Weight</td>
              <td>
                <code>--font-weight-semibold</code>
              </td>
              <td>600</td>
            </tr>
            <tr>
              <td>Weight</td>
              <td>
                <code>--font-weight-bold</code>
              </td>
              <td>700</td>
            </tr>
            <tr>
              <td>Line Height</td>
              <td>
                <code>--line-height-tight</code>
              </td>
              <td>1.25</td>
            </tr>
            <tr>
              <td>Line Height</td>
              <td>
                <code>--line-height-normal</code>
              </td>
              <td>1.5</td>
            </tr>
            <tr>
              <td>Line Height</td>
              <td>
                <code>--line-height-relaxed</code>
              </td>
              <td>1.75</td>
            </tr>

            <tr>
              <td colSpan={3}>
                <strong>Transitions</strong>
              </td>
            </tr>
            <tr>
              <td>Transition</td>
              <td>
                <code>--transition-fast</code>
              </td>
              <td>150ms ease-in-out</td>
            </tr>
            <tr>
              <td>Transition</td>
              <td>
                <code>--transition-normal</code>
              </td>
              <td>250ms ease-in-out</td>
            </tr>
            <tr>
              <td>Transition</td>
              <td>
                <code>--transition-slow</code>
              </td>
              <td>350ms ease-in-out</td>
            </tr>

            <tr>
              <td colSpan={3}>
                <strong>Z-Index</strong>
              </td>
            </tr>
            <tr>
              <td>Z-Index</td>
              <td>
                <code>--z-dropdown</code>
              </td>
              <td>1000</td>
            </tr>
            <tr>
              <td>Z-Index</td>
              <td>
                <code>--z-sticky</code>
              </td>
              <td>1100</td>
            </tr>
            <tr>
              <td>Z-Index</td>
              <td>
                <code>--z-fixed</code>
              </td>
              <td>1200</td>
            </tr>
            <tr>
              <td>Z-Index</td>
              <td>
                <code>--z-modal-backdrop</code>
              </td>
              <td>1300</td>
            </tr>
            <tr>
              <td>Z-Index</td>
              <td>
                <code>--z-modal</code>
              </td>
              <td>1400</td>
            </tr>
            <tr>
              <td>Z-Index</td>
              <td>
                <code>--z-popover</code>
              </td>
              <td>1500</td>
            </tr>
            <tr>
              <td>Z-Index</td>
              <td>
                <code>--z-tooltip</code>
              </td>
              <td>1600</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// META & EXPORTS
// ============================================================================

const meta: Meta = {
  title: 'Theme/CSS Variables',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Theme CSS Variables

This design system uses CSS custom properties (variables) for consistent styling across all components.

## Categories

- **Color Palette**: 32 color families with 10 shades each (50-900)
- **Theme Tokens**: Semantic colors that adapt to light/dark themes
- **Spacing**: 4px grid-based spacing scale
- **Typography**: Font families, sizes, weights, and line heights
- **Borders**: Consistent border radius values
- **Shadows**: Elevation shadows for depth
- **Transitions**: Animation timing presets
- **Z-Index**: Layering scale for UI elements

## Usage

\`\`\`css
.my-component {
  background: var(--theme-surface-primary);
  color: var(--theme-text-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  box-shadow: var(--theme-shadow-sm);
  transition: var(--transition-normal);
}
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const ColorPalette: Story = {
  name: 'Color Palette',
  render: () => <ColorPaletteStory />,
  parameters: {
    docs: {
      description: {
        story: 'Complete color palette with 32 color families and 10 shades each.',
      },
    },
  },
};

export const ThemeTokens: Story = {
  name: 'Theme Tokens',
  render: () => <ThemeTokensStory />,
  parameters: {
    docs: {
      description: {
        story: 'Semantic theme tokens that adapt to light and dark modes.',
      },
    },
  },
};

export const Spacing: Story = {
  name: 'Spacing',
  render: () => <SpacingStory />,
  parameters: {
    docs: {
      description: {
        story: 'Spacing scale based on a 4px grid system.',
      },
    },
  },
};

export const Typography: Story = {
  name: 'Typography',
  render: () => <TypographyStory />,
  parameters: {
    docs: {
      description: {
        story: 'Typography tokens including font families, sizes, weights, and line heights.',
      },
    },
  },
};

export const Borders: Story = {
  name: 'Border Radius',
  render: () => <BordersStory />,
  parameters: {
    docs: {
      description: {
        story: 'Border radius scale for consistent rounded corners.',
      },
    },
  },
};

export const Shadows: Story = {
  name: 'Shadows',
  render: () => <ShadowsStory />,
  parameters: {
    docs: {
      description: {
        story: 'Box shadow presets for elevation and depth.',
      },
    },
  },
};

export const Transitions: Story = {
  name: 'Transitions',
  render: () => <TransitionsStory />,
  parameters: {
    docs: {
      description: {
        story: 'Transition timing presets for smooth animations.',
      },
    },
  },
};

export const ZIndex: Story = {
  name: 'Z-Index',
  render: () => <ZIndexStory />,
  parameters: {
    docs: {
      description: {
        story: 'Z-index scale for proper layering of UI elements.',
      },
    },
  },
};

export const AllVariables: Story = {
  name: 'All Variables',
  render: () => <AllVariablesStory />,
  parameters: {
    docs: {
      description: {
        story: 'Complete reference table of all CSS custom properties.',
      },
    },
  },
};
