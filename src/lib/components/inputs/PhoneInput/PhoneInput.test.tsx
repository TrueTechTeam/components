import { createRef } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhoneInput, type Country } from './PhoneInput';

// Mock scrollIntoView which isn't implemented in JSDOM
beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

describe('PhoneInput', () => {
  describe('rendering', () => {
    it('should render', () => {
      render(<PhoneInput />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<PhoneInput label="Phone Number" />);
      expect(screen.getByText('Phone Number')).toBeInTheDocument();
    });

    it('should render with label placement top', () => {
      const { container } = render(<PhoneInput label="Phone" labelPlacement="top" />);
      expect(container.querySelector('.horizontal')).not.toBeInTheDocument();
    });

    it('should render with label placement left', () => {
      const { container } = render(<PhoneInput label="Phone" labelPlacement="left" />);
      expect(container.querySelector('.horizontal')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<PhoneInput className="custom-class" data-testid="phone-input" />);
      const container = screen.getByTestId('phone-input');
      expect(container).toHaveClass('custom-class');
    });

    it('should render with custom style', () => {
      render(<PhoneInput style={{ width: '300px' }} data-testid="phone-input" />);
      const container = screen.getByTestId('phone-input');
      expect(container).toHaveStyle({ width: '300px' });
    });

    it('should render with data-testid', () => {
      render(<PhoneInput data-testid="custom-phone" />);
      expect(screen.getByTestId('custom-phone')).toBeInTheDocument();
    });

    it('should show default country', () => {
      render(<PhoneInput defaultCountry="US" />);
      expect(screen.getByText('+1')).toBeInTheDocument();
      expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    });

    it('should use first country when defaultCountry not found', () => {
      render(<PhoneInput defaultCountry="INVALID" />);
      // Should fall back to first country (US)
      expect(screen.getByText('+1')).toBeInTheDocument();
      expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    });

    it('should render with helper text', () => {
      render(<PhoneInput helperText="Enter your phone number" />);
      expect(screen.getByText('Enter your phone number')).toBeInTheDocument();
    });

    it('should render with error message', () => {
      render(<PhoneInput error errorMessage="Invalid phone number" />);
      expect(screen.getByText('Invalid phone number')).toBeInTheDocument();
    });

    it('should show required indicator', () => {
      render(<PhoneInput label="Phone Number" required />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render with custom countries', () => {
      const customCountries: Country[] = [
        { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
        { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
      ];
      render(<PhoneInput countries={customCountries} />);
      expect(screen.getByText('+1')).toBeInTheDocument();
    });

    it('should render with custom search placeholder', async () => {
      const user = userEvent.setup();
      render(<PhoneInput showCountrySearch countrySearchPlaceholder="Find country..." />);

      const countryButton = screen.getByLabelText('Select country');
      await user.click(countryButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Find country...')).toBeInTheDocument();
      });
    });
  });

  describe('label and required', () => {
    it('should associate label with required attribute', () => {
      const { container } = render(<PhoneInput label="Phone Number" required />);
      const label = container.querySelector('label');
      expect(label).toHaveAttribute('data-required');
    });

    it('should not show label when not provided', () => {
      const { container } = render(<PhoneInput />);
      const label = container.querySelector('label');
      expect(label).not.toBeInTheDocument();
    });
  });

  describe('country selection', () => {
    it('should open country dropdown on button click', async () => {
      const user = userEvent.setup();
      render(<PhoneInput defaultCountry="US" />);

      const countryButton = screen.getByLabelText('Select country');
      await user.click(countryButton);

      await waitFor(() => {
        const dialCodes = screen.getAllByText(/^\+\d+$/);
        expect(dialCodes.length).toBeGreaterThan(1);
      });
    });

    it.skip('should filter countries on search', async () => {
      const user = userEvent.setup();
      render(<PhoneInput defaultCountry="US" showCountrySearch />);

      const countryButton = screen.getByLabelText('Select country');
      await user.click(countryButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Search countries...')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText('Search countries...');
      await user.type(searchInput, 'DE');

      await waitFor(() => {
        expect(screen.getByText('+49')).toBeInTheDocument();
        const dialCodes = screen.getAllByText(/^\+1$/);
        expect(dialCodes.length).toBe(1);
      });
    });

    it('should change country on selection', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<PhoneInput defaultCountry="US" onChange={handleChange} />);

      const countryButton = screen.getByLabelText('Select country');
      await user.click(countryButton);

      await waitFor(() => {
        expect(screen.getByText('🇩🇪')).toBeInTheDocument();
      });

      const germanyFlag = screen.getByText('🇩🇪');
      await user.click(germanyFlag);

      await waitFor(() => {
        expect(screen.getByText('+49')).toBeInTheDocument();
      });
    });

    it('should not open dropdown when disabled', async () => {
      userEvent.setup();
      render(<PhoneInput disabled />);

      const countryButton = screen.getByLabelText('Select country');
      expect(countryButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('should hide country search when showCountrySearch is false', async () => {
      const user = userEvent.setup();
      render(<PhoneInput showCountrySearch={false} />);

      const countryButton = screen.getByLabelText('Select country');
      await user.click(countryButton);

      await waitFor(() => {
        expect(screen.queryByPlaceholderText('Search countries...')).not.toBeInTheDocument();
      });
    });

    it('should reformat phone number when country changes', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(
        <PhoneInput defaultCountry="US" onChange={handleChange} autoFormat value="5551234567" />
      );

      const countryButton = screen.getByLabelText('Select country');
      await user.click(countryButton);

      await waitFor(() => {
        expect(screen.getByText('🇬🇧')).toBeInTheDocument();
      });

      const ukFlag = screen.getByText('🇬🇧');
      await user.click(ukFlag);

      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      });
    });
  });

  describe('phone input', () => {
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

      expect(input.value).toMatch(/\(\d{3}\) \d{3}-\d{4}/);
    });

    it('should not format when autoFormat is false', () => {
      render(<PhoneInput defaultCountry="US" autoFormat={false} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '5551234567' } });

      expect(input.value).toBe('5551234567');
    });

    it('should handle partial phone number input with formatting', () => {
      render(<PhoneInput defaultCountry="US" autoFormat />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '555' } });

      expect(input.value).toBe('(555');
    });

    it('should handle phone number longer than format mask', () => {
      render(<PhoneInput defaultCountry="US" autoFormat />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '55512345678901234' } });

      // Should format up to mask and append extra digits
      expect(input.value).toContain('(555) 123-4567');
    });

    it('should call onChange with full phone number including dial code', () => {
      const handleChange = jest.fn();
      render(<PhoneInput onChange={handleChange} defaultCountry="US" />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '5551234567' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.stringContaining('+1'),
        expect.objectContaining({ code: 'US' })
      );
    });

    it('should call onChange with country object', () => {
      const handleChange = jest.fn();
      render(<PhoneInput onChange={handleChange} defaultCountry="US" />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '5551234567' } });

      expect(handleChange).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          code: 'US',
          dialCode: '+1',
          flag: '🇺🇸',
        })
      );
    });

    it('should handle onBlur event', async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();
      render(<PhoneInput onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalled();
    });

    it('should show placeholder based on country format', () => {
      render(<PhoneInput defaultCountry="US" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.placeholder).toBe('(000) 000-0000');
    });

    it('should show default placeholder when country has no format', () => {
      const customCountries: Country[] = [
        { code: 'XX', name: 'Test Country', dialCode: '+999', flag: '🏳️' },
      ];
      render(<PhoneInput countries={customCountries} defaultCountry="XX" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.placeholder).toBe('Enter phone number');
    });

    it('should work with defaultValue in uncontrolled mode', () => {
      render(<PhoneInput defaultValue="5551234567" />);
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('5551234567');
    });

    it('should update internal state in uncontrolled mode', () => {
      render(<PhoneInput defaultValue="" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '5551234567' } });

      expect(input.value).toBe('(555) 123-4567');
    });
  });

  describe('controlled vs uncontrolled', () => {
    it('should work in controlled mode', () => {
      const { rerender } = render(<PhoneInput value="5551234567" onChange={() => {}} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('5551234567');

      rerender(<PhoneInput value="5559876543" onChange={() => {}} />);
      expect(input.value).toBe('5559876543');
    });

    it('should work in uncontrolled mode with defaultValue', () => {
      render(<PhoneInput defaultValue="5551234567" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('5551234567');

      fireEvent.change(input, { target: { value: '9998887777' } });
      expect(input.value).toBe('(999) 888-7777');
    });

    it('should not update internal value when controlled', () => {
      const handleChange = jest.fn();
      render(<PhoneInput value="5551234567" onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '9998887777' } });

      // In controlled mode, the component doesn't update its own state
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('states', () => {
    it('should be disabled', () => {
      render(<PhoneInput disabled />);

      const input = screen.getByRole('textbox');
      const countryButton = screen.getByLabelText('Select country');

      expect(input).toBeDisabled();
      expect(countryButton).toHaveAttribute('aria-disabled', 'true');
    });

    it('should show error state', () => {
      render(<PhoneInput label="Phone Number" error errorMessage="Invalid phone number" />);
      expect(screen.getByText('Invalid phone number')).toBeInTheDocument();
    });

    it('should be required', () => {
      render(<PhoneInput required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
    });
  });

  describe('accessibility', () => {
    it('should have correct aria-label from prop', () => {
      render(<PhoneInput aria-label="Contact phone" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Contact phone');
    });

    it('should use label as aria-label when no aria-label provided', () => {
      render(<PhoneInput label="Phone Number" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Phone Number');
    });

    it('should have default aria-label when neither label nor aria-label provided', () => {
      render(<PhoneInput />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-label', 'Phone number');
    });

    it('should have type tel', () => {
      render(<PhoneInput />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('should have country select with proper aria-label', () => {
      render(<PhoneInput />);
      const countryButton = screen.getByLabelText('Select country');
      expect(countryButton).toBeInTheDocument();
    });
  });

  describe('ref forwarding', () => {
    it('should forward ref to input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<PhoneInput ref={ref} />);

      expect(ref.current).toBeDefined();
      expect(ref.current).toBeTruthy();
      // The Input component uses useImperativeHandle, so check it has input-like properties
      expect(ref.current).toHaveProperty('focus');
      expect(ref.current).toHaveProperty('blur');
      expect(ref.current).toHaveProperty('validate');
    });

    it('should allow focus via ref', () => {
      const ref = createRef<HTMLInputElement>();
      render(<PhoneInput ref={ref} />);

      ref.current?.focus();
      // Check that focus method exists and can be called
      expect(ref.current?.focus).toBeDefined();
      // Verify the input received focus by checking it's in the document
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });

  describe('display name', () => {
    it('should have correct display name', () => {
      expect(PhoneInput.displayName).toBe('PhoneInput');
    });
  });

  describe('formatPhoneNumber edge cases', () => {
    it('should handle empty value', () => {
      render(<PhoneInput defaultCountry="US" autoFormat />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '' } });

      expect(input.value).toBe('');
    });

    it('should strip non-digit characters before formatting', () => {
      render(<PhoneInput defaultCountry="US" autoFormat />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'abc555def1234ghi567' } });

      expect(input.value).toBe('(555) 123-4567');
    });

    it('should format different country formats correctly - UK', () => {
      render(<PhoneInput defaultCountry="GB" autoFormat />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '20123456789' } });

      // UK format is #### ### #### (11 digits)
      expect(input.value).toMatch(/\d{4} \d{3} \d{4}/);
    });

    it('should format different country formats correctly - Japan', () => {
      render(<PhoneInput defaultCountry="JP" autoFormat />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '9012345678' } });

      expect(input.value).toMatch(/\d{2}-\d{4}-\d{4}/);
    });

    it('should not format when country has no format mask', () => {
      const customCountries: Country[] = [
        { code: 'XX', name: 'Test', dialCode: '+999', flag: '🏳️' },
      ];
      render(<PhoneInput countries={customCountries} defaultCountry="XX" autoFormat />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '1234567890' } });

      expect(input.value).toBe('1234567890');
    });
  });
});
