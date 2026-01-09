import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from './Input';
import { iconRegistry } from '../../../assets/icons';

// Dynamically generate icon options from iconRegistry
const iconOptions = [null, ...Object.keys(iconRegistry)] as const;

const meta: Meta<typeof Input> = {
  title: 'Inputs/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time'],
      description: 'HTML input type',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the input is read-only',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
    error: {
      control: 'boolean',
      description: 'Whether the input is in error state',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the input is in loading state',
    },
    showClearButton: {
      control: 'boolean',
      description: 'Show clear button when input has value',
    },
    showPasswordToggle: {
      control: 'boolean',
      description: 'Show password visibility toggle',
    },
    showCounter: {
      control: 'boolean',
      description: 'Show character counter',
    },
    startIcon: {
      control: 'select',
      options: iconOptions,
      description: 'Icon to display at start',
    },
    endIcon: {
      control: 'select',
      options: iconOptions,
      description: 'Icon to display at end',
    },
    validateOn: {
      control: 'select',
      options: ['blur', 'change', 'submit', 'manual'],
      description: 'When to trigger validation',
    },
    // Hide complex controls
    onChange: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    onClear: { table: { disable: true } },
    onEnterPress: { table: { disable: true } },
    onValidate: { table: { disable: true } },
    inputFilter: { table: { disable: true } },
    formatMask: { table: { disable: true } },
    validationRegex: { table: { disable: true } },
    className: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    'aria-label': { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

/**
 * Default input with primary variant
 */
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

/**
 * Input with label and helper text
 */
export const WithLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      <Input label="Email" placeholder="Enter your email" helperText="We'll never share your email" />
      <Input label="Name" placeholder="Enter your name" required />
      <Input
        label="Website"
        placeholder="https://example.com"
        helperText="Enter a valid URL"
        type="url"
      />
    </div>
  ),
};

/**
 * Input with icons
 */
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Input placeholder="Search..." startIcon="check" />
      <Input placeholder="Email" endIcon="info" />
      <Input placeholder="With both icons" startIcon="check" endIcon="info" />
      <Input placeholder="Warning" startIcon="warning" variant="outline" />
    </div>
  ),
};

/**
 * Input with prefix and suffix
 */
export const WithPrefixSuffix: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Input label="Amount" prefix="$" placeholder="0.00" type="number" />
      <Input label="Website" prefix="https://" placeholder="example.com" />
      <Input label="Weight" suffix="kg" placeholder="0" type="number" />
      <Input label="Price" prefix="$" suffix="USD" placeholder="0.00" type="number" />
    </div>
  ),
};

/**
 * Input with character counter
 */
const WithCharacterCounterComponent = () => {
  const [value, setValue] = useState('');
  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="Bio"
        placeholder="Tell us about yourself"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        maxLength={200}
        showCounter
        helperText="Maximum 200 characters"
      />
    </div>
  );
};

export const WithCharacterCounter: Story = {
  render: () => <WithCharacterCounterComponent />,
};

/**
 * Phone number with format mask
 */
const PhoneNumberComponent = () => {
  const [value, setValue] = useState('');
  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="Phone Number"
        type="tel"
        placeholder="(555) 123-4567"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        formatMask="(###) ###-####"
        inputFilter={/^[0-9\s()-]*$/}
        helperText="Format: (555) 123-4567"
        startIcon="check"
      />
    </div>
  );
};

export const PhoneNumber: Story = {
  render: () => <PhoneNumberComponent />,
};

/**
 * Credit card with format mask
 */
const CreditCardComponent = () => {
  const [value, setValue] = useState('');
  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="Credit Card Number"
        placeholder="1234 5678 9012 3456"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        formatMask="#### #### #### ####"
        inputFilter={/^[0-9\s]*$/}
        maxLength={19}
        helperText="16 digits"
      />
    </div>
  );
};

export const CreditCard: Story = {
  render: () => <CreditCardComponent />,
};

/**
 * SSN with format mask
 */
const SSNComponent = () => {
  const [value, setValue] = useState('');
  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="Social Security Number"
        placeholder="123-45-6789"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        formatMask="###-##-####"
        inputFilter={/^[0-9-]*$/}
        helperText="Format: 123-45-6789"
      />
    </div>
  );
};

export const SSN: Story = {
  render: () => <SSNComponent />,
};

/**
 * ZIP code with format mask
 */
const ZipCodeComponent = () => {
  const [value, setValue] = useState('');
  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="ZIP Code"
        placeholder="12345-6789"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        formatMask="#####-####"
        inputFilter={/^[0-9-]*$/}
        helperText="Format: 12345-6789 or 12345"
        startIcon="info"
      />
    </div>
  );
};

export const ZipCode: Story = {
  render: () => <ZipCodeComponent />,
};

/**
 * Date with format mask
 */
const DateFormatComponent = () => {
  const [value, setValue] = useState('');
  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="Date"
        placeholder="MM/DD/YYYY"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        formatMask="##/##/####"
        inputFilter={/^[0-9/]*$/}
        helperText="Format: MM/DD/YYYY"
        startIcon="calendar"
      />
    </div>
  );
};

export const DateFormat: Story = {
  render: () => <DateFormatComponent />,
};

/**
 * Time with format mask
 */
const TimeFormatComponent = () => {
  const [value, setValue] = useState('');
  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="Time"
        placeholder="HH:MM:SS"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        formatMask="##:##:##"
        inputFilter={/^[0-9:]*$/}
        helperText="Format: HH:MM:SS (24-hour)"
        startIcon="clock"
      />
    </div>
  );
};

export const TimeFormat: Story = {
  render: () => <TimeFormatComponent />,
};

/**
 * License plate with format mask
 */
const LicensePlateComponent = () => {
  const [value, setValue] = useState('');
  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="License Plate"
        placeholder="ABC-1234"
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        formatMask="AAA-####"
        inputFilter={/^[A-Z0-9-]*$/}
        helperText="Format: ABC-1234"
      />
    </div>
  );
};

export const LicensePlate: Story = {
  render: () => <LicensePlateComponent />,
};

/**
 * IP Address with format mask
 */
const IPAddressComponent = () => {
  const [value, setValue] = useState('');
  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="IP Address"
        placeholder="192.168.1.1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        formatMask="###.###.###.###"
        inputFilter={/^[0-9.]*$/}
        helperText="Format: 192.168.1.1"
        startIcon="info"
      />
    </div>
  );
};

export const IPAddress: Story = {
  render: () => <IPAddressComponent />,
};

/**
 * All format mask examples
 */
const FormatMaskExamplesComponent = () => {
  const [phone, setPhone] = useState('');
  const [card, setCard] = useState('');
  const [ssn, setSSN] = useState('');
  const [zip, setZip] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [plate, setPlate] = useState('');
  const [ip, setIP] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
      <h3>Format Mask Examples</h3>

      <Input
        label="Phone Number"
        placeholder="(555) 123-4567"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        formatMask="(###) ###-####"
        inputFilter={/^[0-9\s()-]*$/}
        helperText="(###) ###-####"
        startIcon="check"
      />

      <Input
        label="Credit Card"
        placeholder="1234 5678 9012 3456"
        value={card}
        onChange={(e) => setCard(e.target.value)}
        formatMask="#### #### #### ####"
        inputFilter={/^[0-9\s]*$/}
        maxLength={19}
        helperText="#### #### #### ####"
      />

      <Input
        label="Social Security Number"
        placeholder="123-45-6789"
        value={ssn}
        onChange={(e) => setSSN(e.target.value)}
        formatMask="###-##-####"
        inputFilter={/^[0-9-]*$/}
        helperText="###-##-####"
      />

      <Input
        label="ZIP Code"
        placeholder="12345-6789"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
        formatMask="#####-####"
        inputFilter={/^[0-9-]*$/}
        helperText="#####-####"
      />

      <Input
        label="Date"
        placeholder="12/31/2024"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        formatMask="##/##/####"
        inputFilter={/^[0-9/]*$/}
        helperText="MM/DD/YYYY"
        startIcon="calendar"
      />

      <Input
        label="Time"
        placeholder="14:30:00"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        formatMask="##:##:##"
        inputFilter={/^[0-9:]*$/}
        helperText="HH:MM:SS"
        startIcon="clock"
      />

      <Input
        label="License Plate"
        placeholder="ABC-1234"
        value={plate}
        onChange={(e) => setPlate(e.target.value.toUpperCase())}
        formatMask="AAA-####"
        inputFilter={/^[A-Z0-9-]*$/}
        helperText="AAA-####"
      />

      <Input
        label="IP Address"
        placeholder="192.168.1.1"
        value={ip}
        onChange={(e) => setIP(e.target.value)}
        formatMask="###.###.###.###"
        inputFilter={/^[0-9.]*$/}
        helperText="###.###.###.###"
      />
    </div>
  );
};

export const FormatMaskExamples: Story = {
  render: () => <FormatMaskExamplesComponent />,
};

/**
 * Email validation
 */
const EmailValidationComponent = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="Email Address"
        type="email"
        placeholder="user@example.com"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError('');
        }}
        validationRegex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
        validateOn="blur"
        onValidate={(result) => {
          if (!result.isValid && result.value) {
            setError('Please enter a valid email address');
          } else {
            setError('');
          }
        }}
        errorMessage={error}
        required
        startIcon="check"
      />
    </div>
  );
};

export const EmailValidation: Story = {
  render: () => <EmailValidationComponent />,
};

/**
 * Password with validation and toggle
 */
const PasswordWithValidationComponent = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError('');
        }}
        validationRegex={/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/}
        validateOn="blur"
        onValidate={(result) => {
          if (!result.isValid && result.value) {
            setError('Password must be at least 8 characters with letters and numbers');
          } else {
            setError('');
          }
        }}
        errorMessage={error}
        helperText="Minimum 8 characters, at least 1 letter and 1 number"
        required
        showPasswordToggle
      />
    </div>
  );
};

export const PasswordWithValidation: Story = {
  render: () => <PasswordWithValidationComponent />,
};

/**
 * Input with clear button
 */
const WithClearButtonComponent = () => {
  const [value, setValue] = useState('Initial value');
  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="Search"
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        showClearButton
        onClear={() => console.log('Cleared!')}
        startIcon="check"
      />
    </div>
  );
};

export const WithClearButton: Story = {
  render: () => <WithClearButtonComponent />,
};

/**
 * Loading state
 */
export const LoadingState: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Input label="Processing..." placeholder="Loading..." loading />
      <Input
        label="Searching..."
        placeholder="Search..."
        loading
        value="Searching for results..."
        onChange={() => {}}
      />
      <Input label="With icon" placeholder="Loading..." loading startIcon="check" />
    </div>
  ),
};

/**
 * Error states
 */
export const ErrorStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '400px' }}>
      <Input
        label="Email"
        value="invalid-email"
        onChange={() => {}}
        error
        errorMessage="Please enter a valid email address"
      />
      <Input
        label="Username"
        value="ab"
        onChange={() => {}}
        errorMessage="Username must be at least 3 characters"
        startIcon="warning"
      />
      <Input
        label="Password"
        type="password"
        value="weak"
        onChange={() => {}}
        error
        errorMessage="Password is too weak"
      />
    </div>
  ),
};

/**
 * Disabled and readonly states
 */
export const DisabledReadonly: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Input label="Disabled" placeholder="Cannot edit" disabled />
      <Input
        label="Disabled with value"
        value="Disabled value"
        onChange={() => {}}
        disabled
      />
      <Input label="Read-only" value="Read-only value" onChange={() => {}}readOnly />
      <Input
        label="Read-only with icon"
        value="Read-only value"
        onChange={() => {}}
        readOnly
        startIcon="info"
      />
    </div>
  ),
};

/**
 * Different input types
 */
export const InputTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Input label="Text" type="text" placeholder="Text input" />
      <Input label="Email" type="email" placeholder="user@example.com" />
      <Input label="Password" type="password" placeholder="Password" />
      <Input label="Number" type="number" placeholder="123" />
      <Input label="Telephone" type="tel" placeholder="(555) 123-4567" />
      <Input label="URL" type="url" placeholder="https://example.com" />
      <Input label="Search" type="search" placeholder="Search..." />
      <Input label="Date" type="date" />
      <Input label="Time" type="time" />
    </div>
  ),
};

/**
 * Numbers only (input filter example)
 */
const NumbersOnlyComponent = () => {
  const [value, setValue] = useState('');
  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="Numbers Only"
        placeholder="Enter numbers only"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputFilter={/^[0-9]*$/}
        helperText="Only numeric characters allowed"
      />
    </div>
  );
};

export const NumbersOnly: Story = {
  render: () => <NumbersOnlyComponent />,
};

/**
 * Letters only (input filter example)
 */
const LettersOnlyComponent = () => {
  const [value, setValue] = useState('');
  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        label="Letters Only"
        placeholder="Enter letters only"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        inputFilter={/^[a-zA-Z\s]*$/}
        helperText="Only alphabetic characters allowed"
      />
    </div>
  );
};

export const LettersOnly: Story = {
  render: () => <LettersOnlyComponent />,
};

/**
 * Comprehensive example with all features
 */
const ComprehensiveComponent = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [bio, setBio] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
      <h3>User Registration Form</h3>

      <Input
        label="Email Address"
        type="email"
        placeholder="user@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError('');
        }}
        validationRegex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
        validateOn="blur"
        onValidate={(result) => {
          if (!result.isValid && result.value) {
            setEmailError('Please enter a valid email address');
          }
        }}
        errorMessage={emailError}
        required
        startIcon="check"
        showClearButton
        onClear={() => setEmail('')}
      />

      <Input
        label="Phone Number"
        type="tel"
        placeholder="(555) 123-4567"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        formatMask="(###) ###-####"
        inputFilter={/^[0-9\s()-]*$/}
        helperText="US phone number format"
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="Create a strong password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError('');
        }}
        validationRegex={/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/}
        validateOn="blur"
        onValidate={(result) => {
          if (!result.isValid && result.value) {
            setPasswordError('Password must be at least 8 characters with letters and numbers');
          }
        }}
        errorMessage={passwordError}
        helperText="Minimum 8 characters, at least 1 letter and 1 number"
        required
        showPasswordToggle
      />

      <Input
        label="Bio"
        placeholder="Tell us about yourself..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        maxLength={200}
        showCounter
        helperText="Maximum 200 characters"
      />
    </div>
  );
};

export const Comprehensive: Story = {
  render: () => <ComprehensiveComponent />,
};

/**
 * Interactive playground
 */
export const Playground: Story = {
  args: {
    label: 'Label',
    placeholder: 'Enter text...',
    helperText: 'Helper text',
    type: 'text',
    disabled: false,
    readOnly: false,
    required: false,
    error: false,
    loading: false,
    showClearButton: false,
    showPasswordToggle: true,
    showCounter: true,
  },
};
