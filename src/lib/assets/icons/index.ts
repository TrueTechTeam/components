// Icon imports
import Calendar from './calendar.svg?react';
import ChevronDown from './chevron-down.svg?react';
import ChevronUp from './chevron-up.svg?react';
import ChevronLeft from './chevron-left.svg?react';
import ChevronRight from './chevron-right.svg?react';
import Close from './close.svg?react';
import Check from './check.svg?react';
import Minus from './minus.svg?react';
import Plus from './plus.svg?react';
import Info from './info.svg?react';
import Help from './help.svg?react';
import Warning from './warning.svg?react';
import Error from './error.svg?react';
import Eye from './eye.svg?react';
import EyeOff from './eye-off.svg?react';
import Edit from './edit.svg?react';
import Copy from './copy.svg?react';
import Delete from './delete.svg?react';
import Settings from './settings.svg?react';
import Profile from './profile.svg?react';
import Preferences from './preferences.svg?react';
import Account from './account.svg?react';
import Logout from './logout.svg?react';

/**
 * Icon registry mapping icon names to SVG components
 */
export const iconRegistry = {
  calendar: Calendar,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  close: Close,
  check: Check,
  minus: Minus,
  plus: Plus,
  info: Info,
  help: Help,
  warning: Warning,
  error: Error,
  eye: Eye,
  'eye-off': EyeOff,
  edit: Edit,
  copy: Copy,
  delete: Delete,
  settings: Settings,
  profile: Profile,
  preferences: Preferences,
  account: Account,
  logout: Logout,
} as const;

/**
 * Available icon names
 */
export type IconName = keyof typeof iconRegistry;

/**
 * Named exports for direct import
 */
export {
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Close,
  Check,
  Minus,
  Plus,
  Info,
  Help,
  Warning,
  Error,
  Eye,
  EyeOff,
  Edit,
  Copy,
  Delete,
  Settings,
  Profile,
  Preferences,
  Account,
  Logout,
};

