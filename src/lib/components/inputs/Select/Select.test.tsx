import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from './Select';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

describe('Select', () => {
  it('should render', () => {
    render(<Select options={options} aria-label="Test select" />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Select label="Country" options={options} />);
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(<Select options={options} />);
    const select = screen.getByRole('combobox');
    expect(select.children).toHaveLength(3);
  });

  it('should handle controlled value', () => {
    const { rerender } = render(
      <Select options={options} value="1" onChange={() => {}} />
    );
    expect(screen.getByRole('combobox')).toHaveValue('1');

    rerender(<Select options={options} value="2" onChange={() => {}} />);
    expect(screen.getByRole('combobox')).toHaveValue('2');
  });

  it('should call onChange when selection changes', () => {
    const handleChange = jest.fn();
    render(<Select options={options} onChange={handleChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '2' } });

    expect(handleChange).toHaveBeenCalledWith('2', expect.any(Object));
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Select options={options} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('should render option groups', () => {
    const groupedOptions = [
      { value: '1', label: 'Option 1', group: 'Group A' },
      { value: '2', label: 'Option 2', group: 'Group A' },
      { value: '3', label: 'Option 3', group: 'Group B' },
    ];

    render(<Select options={groupedOptions} />);
    const select = screen.getByRole('combobox');
    const optgroups = select.querySelectorAll('optgroup');
    expect(optgroups).toHaveLength(2);
  });
});
