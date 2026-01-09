import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PhoneInput } from './PhoneInput';

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

  it('should open country dropdown on button click', () => {
    render(<PhoneInput defaultCountry="US" />);

    const countryButton = screen.getByLabelText('Select country');
    fireEvent.click(countryButton);

    // Should show country list
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  it('should filter countries on search', async () => {
    render(<PhoneInput defaultCountry="US" showCountrySearch />);

    // Open dropdown
    const countryButton = screen.getByLabelText('Select country');
    fireEvent.click(countryButton);

    // Search for "Germany"
    const searchInput = screen.getByPlaceholderText('Search countries...');
    fireEvent.change(searchInput, { target: { value: 'Germany' } });

    await waitFor(() => {
      expect(screen.getByText('Germany')).toBeInTheDocument();
      expect(screen.queryByText('United States')).not.toBeInTheDocument();
    });
  });

  it('should change country on selection', () => {
    const handleChange = jest.fn();
    render(<PhoneInput defaultCountry="US" onChange={handleChange} />);

    // Open dropdown
    const countryButton = screen.getByLabelText('Select country');
    fireEvent.click(countryButton);

    // Select Germany
    const germanyOption = screen.getByText('Germany');
    fireEvent.click(germanyOption);

    // Verify country changed
    expect(screen.getByText('+49')).toBeInTheDocument();
    expect(screen.getByText('🇩🇪')).toBeInTheDocument();
  });

  it('should show error state', () => {
    render(
      <PhoneInput
        label="Phone Number"
        error
        errorMessage="Invalid phone number"
      />
    );

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
    expect(countryButton).toBeDisabled();
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
