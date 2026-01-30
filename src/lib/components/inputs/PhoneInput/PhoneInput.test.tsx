import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhoneInput } from './PhoneInput';

// Mock scrollIntoView which isn't implemented in JSDOM
beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

describe('PhoneInput', () => {
  it('should render', () => {
    render(<PhoneInput />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<PhoneInput label="Phone Number" />);
    expect(screen.getByText('Phone Number')).toBeInTheDocument();
  });

  it('should show default country', () => {
    render(<PhoneInput defaultCountry="US" />);
    expect(screen.getByText('+1')).toBeInTheDocument();
    expect(screen.getByText('🇺🇸')).toBeInTheDocument();
  });

  it('should handle phone number input', () => {
    const handleChange = jest.fn();
    render(<PhoneInput onChange={handleChange} defaultCountry="US" />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '5551234567' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('should format phone number based on country', () => {
    render(<PhoneInput defaultCountry="US" autoFormat />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '5551234567' } });

    // US format is (###) ###-####
    expect(input.value).toMatch(/\(\d{3}\) \d{3}-\d{4}/);
  });

  it('should open country dropdown on button click', async () => {
    const user = userEvent.setup();
    render(<PhoneInput defaultCountry="US" />);

    const countryButton = screen.getByLabelText('Select country');
    await user.click(countryButton);

    // Should show country list with flags and dial codes (Select options only show these, not names)
    await waitFor(() => {
      // Multiple dial codes should be visible in the dropdown
      const dialCodes = screen.getAllByText(/^\+\d+$/);
      expect(dialCodes.length).toBeGreaterThan(1);
    });
  });

  it('should filter countries on search', async () => {
    const user = userEvent.setup();
    render(<PhoneInput defaultCountry="US" showCountrySearch />);

    // Open dropdown
    const countryButton = screen.getByLabelText('Select country');
    await user.click(countryButton);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search countries...')).toBeInTheDocument();
    });

    // Search by country code (Select filters by option.value, which is the country code)
    const searchInput = screen.getByPlaceholderText('Search countries...');
    await user.type(searchInput, 'DE');

    await waitFor(() => {
      // Germany's dial code +49 should be visible
      expect(screen.getByText('+49')).toBeInTheDocument();
      // US dial code +1 should not be in menu items (only in trigger)
      const dialCodes = screen.getAllByText('+1');
      console.log(dialCodes);
      // Only one +1 should exist (the one in the select trigger), not in the filtered menu
      expect(dialCodes.length).toBe(1);
    });
  });

  it('should change country on selection', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<PhoneInput defaultCountry="US" onChange={handleChange} />);

    // Open dropdown
    const countryButton = screen.getByLabelText('Select country');
    await user.click(countryButton);

    // Wait for dropdown to open and show options
    await waitFor(() => {
      // Should see German flag in the dropdown
      expect(screen.getByText('🇩🇪')).toBeInTheDocument();
    });

    // Select Germany by clicking on its flag
    const germanyFlag = screen.getByText('🇩🇪');
    await user.click(germanyFlag);

    // Verify country changed - the trigger should now show German flag and dial code
    await waitFor(() => {
      expect(screen.getByText('+49')).toBeInTheDocument();
    });
  });

  it('should show error state', () => {
    render(<PhoneInput label="Phone Number" error errorMessage="Invalid phone number" />);

    expect(screen.getByText('Invalid phone number')).toBeInTheDocument();
  });

  it('should show required indicator', () => {
    render(<PhoneInput label="Phone Number" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should be disabled', () => {
    render(<PhoneInput disabled />);

    const input = screen.getByRole('textbox');
    const countryButton = screen.getByLabelText('Select country');

    expect(input).toBeDisabled();
    expect(countryButton).toHaveAttribute('aria-disabled', 'true');
  });

  it('should not format when autoFormat is false', () => {
    render(<PhoneInput defaultCountry="US" autoFormat={false} />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '5551234567' } });

    // Should keep the raw input without formatting
    expect(input.value).toBe('5551234567');
  });

  it('should work in controlled mode', () => {
    const { rerender } = render(<PhoneInput value="5551234567" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('5551234567');

    rerender(<PhoneInput value="5559876543" />);
    expect(input.value).toBe('5559876543');
  });
});
