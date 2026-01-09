import { render, screen, fireEvent } from '@testing-library/react';
import { Dropdown } from './Dropdown';
import { MenuList, MenuItem } from '../Menu';

describe('Dropdown', () => {
  const TestDropdown = ({
    onSelectionChange = jest.fn(),
  }) => (
    <Dropdown label="Select Option" onSelectionChange={onSelectionChange}>
      <MenuList>
        <MenuItem itemKey="option-1">Option 1</MenuItem>
        <MenuItem itemKey="option-2">Option 2</MenuItem>
        <MenuItem itemKey="option-3">Option 3</MenuItem>
      </MenuList>
    </Dropdown>
  );

  describe('rendering', () => {
    it('should render dropdown button', () => {
      render(<TestDropdown />);

      expect(screen.getByText('Select Option')).toBeInTheDocument();
    });

    it('should render chevron by default', () => {
      render(<TestDropdown />);

      const chevron = document.querySelector('[data-open]');
      expect(chevron).toBeInTheDocument();
    });

    it('should not render chevron when showChevron is false', () => {
      render(
        <Dropdown label="No Chevron" showChevron={false}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      const chevron = document.querySelector('[data-open]');
      expect(chevron).not.toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should open menu on button click', () => {
      render(<TestDropdown />);

      fireEvent.click(screen.getByText('Select Option'));

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should close menu when clicking outside', () => {
      render(<TestDropdown />);

      fireEvent.click(screen.getByText('Select Option'));
      expect(screen.getByText('Option 1')).toBeInTheDocument();

      fireEvent.mouseDown(document.body);
      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('should rotate chevron when open', () => {
      render(<TestDropdown />);

      const chevron = document.querySelector('[data-open]');
      expect(chevron).not.toHaveAttribute('data-open', 'true');

      fireEvent.click(screen.getByText('Select Option'));

      expect(chevron).toHaveAttribute('data-open', 'true');
    });
  });

  describe('variants', () => {
    it.each(['primary', 'secondary', 'outline', 'ghost'] as const)(
      'should apply %s variant',
      (variant) => {
        render(
          <Dropdown label="Dropdown" variant={variant}>
            <MenuList>
              <MenuItem itemKey="1">Item 1</MenuItem>
            </MenuList>
          </Dropdown>
        );

        const button = screen.getByText('Dropdown');
        expect(button).toHaveAttribute('data-variant', variant);
      }
    );
  });

  describe('sizes', () => {
    it.each(['sm', 'md', 'lg'] as const)('should apply %s size', (size) => {
      render(
        <Dropdown label="Dropdown" size={size}>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      const button = screen.getByText('Dropdown');
      expect(button).toHaveAttribute('data-size', size);
    });
  });

  describe('icon', () => {
    it('should render icon', () => {
      render(
        <Dropdown label="With Icon" icon="settings">
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      expect(screen.getByText('With Icon')).toBeInTheDocument();
    });
  });

  describe('full width', () => {
    it('should apply fullWidth prop to button', () => {
      render(
        <Dropdown label="Full Width" fullWidth>
          <MenuList>
            <MenuItem itemKey="1">Item 1</MenuItem>
          </MenuList>
        </Dropdown>
      );

      const button = screen.getByText('Full Width');
      expect(button).toHaveAttribute('data-full-width', 'true');
    });
  });
});
