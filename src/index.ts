// Styles
import './lib/styles/index.scss';

// Providers
export { GlobalProvider } from './lib/providers';
export type { GlobalProviderProps } from './lib/providers';

// Contexts
export { ThemeProvider, useTheme } from './lib/contexts';
export type { ThemeProviderProps } from './lib/contexts';

// Hooks
export { useTheme as useThemeHook } from './lib/hooks';

// Types
export type {
  // Theme types
  ColorFamily,
  ColorShade,
  ThemeColorTokens,
  ThemeSpacing,
  ThemeTypography,
  ThemeBorderRadius,
  ThemeShadows,
  Theme,
  ThemeOverride,
  ThemeConfig,
  ThemeMode,
  // Component types
  BaseComponentProps,
  ComponentSize,
  ComponentVariant,
  SemanticColor,
  ButtonBaseProps,
  InputBaseProps,
  CSSVariables,
  ComponentDecoratorProps,
} from './lib/types';

// Decorators
export { withComponentDecorator } from './lib/decorators';

// Utils
export {
  getThemeValue,
  getColorValue,
  setThemeValue,
  applyThemeValues,
  pxToRem,
  gridSpacing,
  isDarkMode,
  getThemeMode,
} from './lib/utils';

// Validation Utils
export { validators, combineValidators } from './lib/utils/validation';

// Color Utils
export {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  rgbToString,
  hslToString,
  parseColorToRgb,
  isValidHex,
  getBrightness,
  isLightColor,
} from './lib/utils/colorUtils';
export type { RGB, HSL, RGBA, HSLA } from './lib/utils/colorUtils';

// Date Utils
export {
  getDaysInMonth,
  getFirstDayOfMonth,
  getCalendarDays,
  isSameDay,
  isToday,
  isDateInRange,
  isDateBefore,
  isDateAfter,
  formatDate,
  parseDate,
  getMonthName,
  getDayName,
  addMonths,
  addDays,
  getDaysDifference,
  isLeapYear,
  clampDate,
  isDateDisabled,
  getYearRange,
  startOfDay,
  endOfDay,
} from './lib/utils/dateUtils';

// Components
export * from './lib/components';

// Icons
export { iconRegistry, type IconName } from './lib/assets/icons';
export {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Close,
  Check,
  Info,
  Warning,
  Error,
  Eye,
  EyeOff,
} from './lib/assets/icons';
