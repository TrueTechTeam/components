import { render, screen } from '@testing-library/react';
import { Icon } from './Icon';

describe('Icon', () => {
  describe('rendering', () => {
    it('should render an icon', () => {
      render(<Icon name="check" />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(<Icon name="check" className="custom-icon" />);
      const icon = screen.getByRole('img');
      expect(icon).toHaveClass('custom-icon');
    });

    it('should render with data-testid', () => {
      render(<Icon name="check" data-testid="custom-icon" />);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('should have default data-testid', () => {
      render(<Icon name="check" />);
      expect(screen.getByTestId('icon-check')).toBeInTheDocument();
    });
  });

  describe('all icons', () => {
    const iconNames = [
      'chevron-down',
      'chevron-up',
      'chevron-left',
      'chevron-right',
      'close',
      'check',
      'info',
      'warning',
      'error',
    ] as const;

    it.each(iconNames)('should render %s icon', (name) => {
      render(<Icon name={name} />);
      expect(screen.getByTestId(`icon-${name}`)).toBeInTheDocument();
    });
  });

  describe('size', () => {
    it('should render with default size', () => {
      render(<Icon name="check" />);
      const icon = screen.getByRole('img');
      expect(icon).toHaveStyle({ '--icon-size': '24px' });
    });

    it('should render with custom numeric size', () => {
      render(<Icon name="check" size={32} />);
      const icon = screen.getByRole('img');
      expect(icon).toHaveStyle({ '--icon-size': '32px' });
    });

    it('should render with custom string size', () => {
      render(<Icon name="check" size="2rem" />);
      const icon = screen.getByRole('img');
      expect(icon).toHaveStyle({ '--icon-size': '2rem' });
    });
  });

  describe('color', () => {
    it('should render with default color', () => {
      render(<Icon name="check" />);
      const icon = screen.getByRole('img');
      expect(icon).toHaveStyle({ '--icon-color': 'currentColor' });
    });

    it('should render with custom color', () => {
      render(<Icon name="check" color="#ff0000" />);
      const icon = screen.getByRole('img');
      expect(icon).toHaveStyle({ '--icon-color': '#ff0000' });
    });

    it('should render with CSS variable color', () => {
      render(<Icon name="check" color="var(--theme-primary)" />);
      const icon = screen.getByRole('img');
      expect(icon).toHaveStyle({ '--icon-color': 'var(--theme-primary)' });
    });
  });

  describe('accessibility', () => {
    it('should have role="img"', () => {
      render(<Icon name="check" />);
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should have aria-label from prop', () => {
      render(<Icon name="check" aria-label="Success" />);
      expect(screen.getByLabelText('Success')).toBeInTheDocument();
    });

    it('should have aria-label from title', () => {
      render(<Icon name="check" title="Check mark" />);
      expect(screen.getByLabelText('Check mark')).toBeInTheDocument();
    });

    it('should use icon name as default aria-label', () => {
      render(<Icon name="check" />);
      expect(screen.getByLabelText('check')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should warn and return null for invalid icon name', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const { container } = render(<Icon name={'invalid' as any} />);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Icon "invalid" not found in registry'
      );
      expect(container.firstChild).toBeNull();
      consoleWarnSpy.mockRestore();
    });
  });
});
