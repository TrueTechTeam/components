import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

describe('Select', () => {
  it('should render', () => {
    render(<Select options={options} aria-label="Test select" />);
    expect(screen.getByRole('button', { name: 'Test select' })).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Select label="Country" options={options} />);
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('should render placeholder when no value selected', () => {
    render(<Select options={options} placeholder="Select an option" />);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('should display selected option label', () => {
    render(<Select options={options} value="2" onChange={() => {}} />);
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should open menu on trigger click', async () => {
    const user = userEvent.setup();
    render(<Select options={options} aria-label="Test select" />);

    const trigger = screen.getByRole('button', { name: 'Test select' });
    await user.click(trigger);

    // Menu should open and show options
    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });
  });

  it('should call onChange when selection changes', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    render(<Select options={options} onChange={handleChange} aria-label="Test select" />);

    const trigger = screen.getByRole('button', { name: 'Test select' });
    await user.click(trigger);

    // Wait for menu to open
    await waitFor(() => {
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    // Click on option
    await user.click(screen.getByText('Option 2'));

    expect(handleChange).toHaveBeenCalledWith('2', expect.any(Object));
  });

  it('should not open when disabled', async () => {
    const user = userEvent.setup();
    render(<Select options={options} disabled aria-label="Test select" />);

    const trigger = screen.getByRole('button', { name: 'Test select' });
    expect(trigger).toHaveAttribute('aria-disabled', 'true');

    await user.click(trigger);

    // Menu should not open, placeholder should remain
    expect(screen.getByText('Select an option')).toBeInTheDocument();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('should render with groups', () => {
    const groupedOptions = [
      { value: '1', label: 'Option 1', group: 'Group A' },
      { value: '2', label: 'Option 2', group: 'Group A' },
      { value: '3', label: 'Option 3', group: 'Group B' },
    ];

    render(<Select options={groupedOptions} aria-label="Test select" />);
    expect(screen.getByRole('button', { name: 'Test select' })).toBeInTheDocument();
  });
});
