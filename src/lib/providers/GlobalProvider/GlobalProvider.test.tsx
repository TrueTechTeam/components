import React from 'react';
import { render, screen, renderHook, waitFor } from '@testing-library/react';
import { GlobalProvider } from './GlobalProvider';
import { useTheme } from '../../contexts/ThemeContext';
import type { ThemeConfig } from '../../types';

describe('GlobalProvider', () => {
  beforeEach(() => {
    // Clear any CSS custom properties set on document element
    document.documentElement.style.cssText = '';
  });

  describe('rendering', () => {
    it('should render children', () => {
      render(
        <GlobalProvider>
          <div>Test Child</div>
        </GlobalProvider>
      );
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <GlobalProvider>
          <div>Child 1</div>
          <div>Child 2</div>
        </GlobalProvider>
      );
      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('should render nested components', () => {
      render(
        <GlobalProvider>
          <div>
            <span>Nested Content</span>
          </div>
        </GlobalProvider>
      );
      expect(screen.getByText('Nested Content')).toBeInTheDocument();
    });
  });

  describe('ThemeProvider integration', () => {
    it('should provide ThemeContext with default light mode', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => <GlobalProvider>{children}</GlobalProvider>,
      });

      expect(result.current.mode).toBe('light');
    });

    it('should provide ThemeContext with custom theme config', () => {
      const themeConfig: ThemeConfig = { mode: 'dark' };
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }) => (
          <GlobalProvider themeConfig={themeConfig}>{children}</GlobalProvider>
        ),
      });

      expect(result.current.mode).toBe('dark');
    });

    it('should apply data-theme attribute to document', () => {
      const themeConfig: ThemeConfig = { mode: 'dark' };
      render(
        <GlobalProvider themeConfig={themeConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('theme overrides', () => {
    it('should apply CSS custom properties when theme override is provided', () => {
      const themeConfig: ThemeConfig = {
        mode: 'light',
        theme: {
          colors: {
            primary: '#ff0000',
            secondary: '#00ff00',
          },
        },
      };

      render(
        <GlobalProvider themeConfig={themeConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--theme-primary')).toBe('#ff0000');
      expect(root.style.getPropertyValue('--theme-secondary')).toBe('#00ff00');
    });

    it('should convert camelCase color keys to kebab-case CSS variables', () => {
      const themeConfig: ThemeConfig = {
        mode: 'light',
        theme: {
          colors: {
            primaryHover: '#ffcccc',
            secondaryActive: '#003300',
          },
        },
      };

      render(
        <GlobalProvider themeConfig={themeConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--theme-primary-hover')).toBe('#ffcccc');
      expect(root.style.getPropertyValue('--theme-secondary-active')).toBe('#003300');
    });

    it('should skip null or undefined color values', () => {
      const themeConfig: ThemeConfig = {
        mode: 'light',
        theme: {
          colors: {
            primary: '#ff0000',
            secondary: undefined,
          },
        },
      };

      render(
        <GlobalProvider themeConfig={themeConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--theme-primary')).toBe('#ff0000');
      expect(root.style.getPropertyValue('--theme-secondary')).toBe('');
    });

    it('should not apply theme overrides when injectGlobalStyles is false', () => {
      const themeConfig: ThemeConfig = {
        mode: 'light',
        theme: {
          colors: {
            primary: '#ff0000',
          },
        },
      };

      render(
        <GlobalProvider themeConfig={themeConfig} injectGlobalStyles={false}>
          <div>Content</div>
        </GlobalProvider>
      );

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--theme-primary')).toBe('');
    });

    it('should apply theme overrides when injectGlobalStyles is true', () => {
      const themeConfig: ThemeConfig = {
        mode: 'light',
        theme: {
          colors: {
            primary: '#ff0000',
          },
        },
      };

      render(
        <GlobalProvider themeConfig={themeConfig} injectGlobalStyles>
          <div>Content</div>
        </GlobalProvider>
      );

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--theme-primary')).toBe('#ff0000');
    });

    it('should default injectGlobalStyles to true', () => {
      const themeConfig: ThemeConfig = {
        mode: 'light',
        theme: {
          colors: {
            primary: '#ff0000',
          },
        },
      };

      render(
        <GlobalProvider themeConfig={themeConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--theme-primary')).toBe('#ff0000');
    });
  });

  describe('provider configurations', () => {
    it('should render without any config props', () => {
      render(
        <GlobalProvider>
          <div>Content</div>
        </GlobalProvider>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should pass pageMessagesConfig to PageMessagesProvider', () => {
      const pageMessagesConfig = {
        maxMessages: 5,
      };

      render(
        <GlobalProvider pageMessagesConfig={pageMessagesConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should pass dialogConfig to DialogProvider', () => {
      const dialogConfig = {
        defaultSize: 'lg' as const,
      };

      render(
        <GlobalProvider dialogConfig={dialogConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should pass alertConfig to AlertProvider', () => {
      const alertConfig = {
        maxAlerts: 3,
      };

      render(
        <GlobalProvider alertConfig={alertConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should pass toastConfig to ToastProvider', () => {
      const toastConfig = {
        position: 'top-right' as const,
        duration: 5000,
      };

      render(
        <GlobalProvider toastConfig={toastConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should pass all configs together', () => {
      const themeConfig: ThemeConfig = { mode: 'dark' };
      const pageMessagesConfig = { maxMessages: 5 };
      const dialogConfig = { defaultSize: 'lg' as const };
      const alertConfig = { maxAlerts: 3 };
      const toastConfig = { position: 'top-right' as const, duration: 5000 };

      render(
        <GlobalProvider
          themeConfig={themeConfig}
          pageMessagesConfig={pageMessagesConfig}
          dialogConfig={dialogConfig}
          alertConfig={alertConfig}
          toastConfig={toastConfig}
        >
          <div>Content</div>
        </GlobalProvider>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('useEffect updates', () => {
    it('should update CSS variables when themeConfig changes', async () => {
      const initialConfig: ThemeConfig = {
        mode: 'light',
        theme: {
          colors: {
            primary: '#ff0000',
          },
        },
      };

      const { rerender } = render(
        <GlobalProvider themeConfig={initialConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--theme-primary')).toBe('#ff0000');

      const updatedConfig: ThemeConfig = {
        mode: 'light',
        theme: {
          colors: {
            primary: '#0000ff',
          },
        },
      };

      rerender(
        <GlobalProvider themeConfig={updatedConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      await waitFor(() => {
        expect(root.style.getPropertyValue('--theme-primary')).toBe('#0000ff');
      });
    });

    it('should handle addition of new color values', async () => {
      const initialConfig: ThemeConfig = {
        mode: 'light',
        theme: {
          colors: {
            primary: '#ff0000',
          },
        },
      };

      const { rerender } = render(
        <GlobalProvider themeConfig={initialConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--theme-primary')).toBe('#ff0000');

      const updatedConfig: ThemeConfig = {
        mode: 'light',
        theme: {
          colors: {
            primary: '#ff0000',
            secondary: '#00ff00',
          },
        },
      };

      rerender(
        <GlobalProvider themeConfig={updatedConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      await waitFor(() => {
        expect(root.style.getPropertyValue('--theme-secondary')).toBe('#00ff00');
      });
    });

    it('should not apply CSS variables when theme is undefined', () => {
      const themeConfig: ThemeConfig = {
        mode: 'light',
      };

      render(
        <GlobalProvider themeConfig={themeConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--theme-primary')).toBe('');
    });

    it('should not apply CSS variables when colors is undefined', () => {
      const themeConfig: ThemeConfig = {
        mode: 'light',
        theme: {},
      };

      render(
        <GlobalProvider themeConfig={themeConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--theme-primary')).toBe('');
    });
  });

  describe('edge cases', () => {
    it('should render with null children', () => {
      render(<GlobalProvider>{null}</GlobalProvider>);
      expect(document.body).toBeInTheDocument();
    });

    it('should render with undefined children', () => {
      render(<GlobalProvider>{undefined}</GlobalProvider>);
      expect(document.body).toBeInTheDocument();
    });

    it('should handle empty theme object', () => {
      const themeConfig: ThemeConfig = {
        mode: 'light',
        theme: {},
      };

      render(
        <GlobalProvider themeConfig={themeConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle theme with empty colors object', () => {
      const themeConfig: ThemeConfig = {
        mode: 'light',
        theme: {
          colors: {},
        },
      };

      render(
        <GlobalProvider themeConfig={themeConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should handle complex nested color names', () => {
      const themeConfig: ThemeConfig = {
        mode: 'light',
        theme: {
          colors: {
            backgroundPrimary: '#123456',
            backgroundSecondary: '#654321',
          },
        },
      };

      render(
        <GlobalProvider themeConfig={themeConfig}>
          <div>Content</div>
        </GlobalProvider>
      );

      const root = document.documentElement;
      expect(root.style.getPropertyValue('--theme-background-primary')).toBe('#123456');
      expect(root.style.getPropertyValue('--theme-background-secondary')).toBe('#654321');
    });
  });
});
