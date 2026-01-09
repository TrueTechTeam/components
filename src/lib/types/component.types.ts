import type { ReactNode, CSSProperties } from 'react';

/**
 * Base props that all components should accept
 */
export interface BaseComponentProps {
  /**
   * Additional CSS class name
   */
  className?: string;

  /**
   * Data test ID for testing
   */
  'data-testid'?: string;

  /**
   * ARIA label for accessibility
   */
  'aria-label'?: string;

  /**
   * Custom inline styles
   */
  style?: CSSProperties;

  /**
   * Component children
   */
  children?: ReactNode;
}

/**
 * Props for components that support size variations
 */
export type ComponentSize = 'sm' | 'md' | 'lg';

/**
 * Extended size options for components with more granular sizing
 */
export type ExtendedComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Props for components that support color variants
 */
export type ComponentVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'success'
  | 'warning'
  | 'danger';

/**
 * Props for components that support semantic colors
 */
export type SemanticColor = 'success' | 'warning' | 'error' | 'info';

/**
 * Common button-like component props
 */
export interface ButtonBaseProps extends BaseComponentProps {
  /**
   * Whether the component is disabled
   */
  disabled?: boolean;

  /**
   * Click handler
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;

  /**
   * Type attribute for button elements
   */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Common input-like component props
 */
export interface InputBaseProps extends BaseComponentProps {
  /**
   * Whether the input is disabled
   */
  disabled?: boolean;

  /**
   * Whether the input is read-only
   */
  readOnly?: boolean;

  /**
   * Whether the input is required
   */
  required?: boolean;

  /**
   * Input name attribute
   */
  name?: string;

  /**
   * Input value
   */
  value?: string;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Change handler
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * CSS variable customization props
 */
export type CSSVariables = Record<string, string | number>;

/**
 * Component decorator props
 */
export interface ComponentDecoratorProps {
  /**
   * Component name for data-component attribute and BEM naming
   */
  componentName: string;

  /**
   * CSS module classes for the root element
   */
  className?: string;

  /**
   * Test ID for testing
   */
  'data-testid'?: string;

  /**
   * Custom CSS variables for component customization
   */
  cssVariables?: CSSVariables;

  /**
   * Root element type
   */
  as?: keyof JSX.IntrinsicElements;

  /**
   * Children to render
   */
  children: ReactNode;

  /**
   * Additional props to spread on root element
   */
  [key: string]: unknown;
}
