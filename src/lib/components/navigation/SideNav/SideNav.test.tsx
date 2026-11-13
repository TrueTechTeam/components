import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SideNav } from './SideNav';
import { SideNavItem } from './SideNavItem';
import { SideNavGroup } from './SideNavGroup';
import { SideNavDivider } from './SideNavDivider';
import type { SideNavLinkProps } from './SideNavContext';
import { LabelsProvider } from '../../../contexts/LabelsContext';

describe('SideNav', () => {
  describe('rendering', () => {
    it('should render with items', () => {
      render(
        <SideNav data-testid="sidenav">
          <SideNavItem value="home" icon="home" label="Home" />
          <SideNavItem value="settings" icon="settings" label="Settings" />
        </SideNav>
      );

      expect(screen.getByTestId('sidenav')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should render header and footer', () => {
      render(
        <SideNav
          header={<div data-testid="header">Header</div>}
          footer={<div data-testid="footer">Footer</div>}
        >
          <SideNavItem value="home" icon="home" label="Home" />
        </SideNav>
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('should apply position data attribute', () => {
      render(
        <SideNav position="right" data-testid="sidenav">
          <SideNavItem value="home" icon="home" label="Home" />
        </SideNav>
      );

      expect(screen.getByTestId('sidenav')).toHaveAttribute('data-position', 'right');
    });

    it('should apply collapsed data attribute', () => {
      render(
        <SideNav collapsed data-testid="sidenav">
          <SideNavItem value="home" icon="home" label="Home" />
        </SideNav>
      );

      expect(screen.getByTestId('sidenav')).toHaveAttribute('data-collapsed', 'true');
    });
  });

  describe('selection', () => {
    it('should select item on click', () => {
      const handleSelect = jest.fn();
      render(
        <SideNav onSelect={handleSelect}>
          <SideNavItem value="home" icon="home" label="Home" data-testid="home" />
          <SideNavItem value="settings" icon="settings" label="Settings" data-testid="settings" />
        </SideNav>
      );

      fireEvent.click(screen.getByTestId('home'));
      expect(handleSelect).toHaveBeenCalledWith('home');
    });

    it('should mark selected item', () => {
      render(
        <SideNav selectedValue="home">
          <SideNavItem value="home" icon="home" label="Home" data-testid="home" />
          <SideNavItem value="settings" icon="settings" label="Settings" data-testid="settings" />
        </SideNav>
      );

      expect(screen.getByTestId('home')).toHaveAttribute('data-selected', 'true');
      expect(screen.getByTestId('settings')).not.toHaveAttribute('data-selected');
    });

    it('should use defaultSelectedValue', () => {
      render(
        <SideNav defaultSelectedValue="settings">
          <SideNavItem value="home" icon="home" label="Home" data-testid="home" />
          <SideNavItem value="settings" icon="settings" label="Settings" data-testid="settings" />
        </SideNav>
      );

      expect(screen.getByTestId('settings')).toHaveAttribute('data-selected', 'true');
    });
  });

  describe('SideNavItem', () => {
    it('should not select when disabled', () => {
      const handleSelect = jest.fn();
      render(
        <SideNav onSelect={handleSelect}>
          <SideNavItem value="home" icon="home" label="Home" disabled data-testid="home" />
        </SideNav>
      );

      fireEvent.click(screen.getByTestId('home'));
      expect(handleSelect).not.toHaveBeenCalled();
    });

    it('should render as link when href is provided', () => {
      render(
        <SideNav>
          <SideNavItem value="home" icon="home" label="Home" href="/home" />
        </SideNav>
      );

      const item = screen.getByText('Home').closest('a');
      expect(item).toHaveAttribute('href', '/home');
    });

    it('should have correct accessibility attributes', () => {
      render(
        <SideNav selectedValue="home">
          <SideNavItem value="home" icon="home" label="Home" data-testid="home" />
        </SideNav>
      );

      const item = screen.getByTestId('home');
      expect(item).toHaveAttribute('role', 'menuitem');
      expect(item).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('SideNavGroup', () => {
    it('should toggle group expansion', () => {
      render(
        <SideNav>
          <SideNavGroup groupId="settings" label="Settings" icon="settings">
            <SideNavItem value="profile" label="Profile" data-testid="profile" />
          </SideNavGroup>
        </SideNav>
      );

      const groupHeader = screen.getByText('Settings').closest('[role="button"]');
      expect(groupHeader).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(groupHeader!);
      expect(groupHeader).toHaveAttribute('aria-expanded', 'true');
    });

    it('should respect defaultExpanded', () => {
      render(
        <SideNav>
          <SideNavGroup groupId="settings" label="Settings" icon="settings" defaultExpanded>
            <SideNavItem value="profile" label="Profile" />
          </SideNavGroup>
        </SideNav>
      );

      const groupHeader = screen.getByText('Settings').closest('[role="button"]');
      expect(groupHeader).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('SideNavDivider', () => {
    it('should render without label', () => {
      render(
        <SideNav>
          <SideNavItem value="home" icon="home" label="Home" />
          <SideNavDivider data-testid="divider" />
          <SideNavItem value="settings" icon="settings" label="Settings" />
        </SideNav>
      );

      expect(screen.getByTestId('divider')).toHaveAttribute('role', 'separator');
    });

    it('should render with label', () => {
      render(
        <SideNav>
          <SideNavDivider label="Settings" />
        </SideNav>
      );

      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have navigation role', () => {
      render(
        <SideNav data-testid="sidenav">
          <SideNavItem value="home" icon="home" label="Home" />
        </SideNav>
      );

      expect(screen.getByTestId('sidenav')).toHaveAttribute('aria-label', 'Side navigation');
    });

    it('should support keyboard navigation', () => {
      const handleSelect = jest.fn();
      render(
        <SideNav onSelect={handleSelect}>
          <SideNavItem value="home" icon="home" label="Home" data-testid="home" />
        </SideNav>
      );

      const item = screen.getByTestId('home');
      fireEvent.keyDown(item, { key: 'Enter' });
      expect(handleSelect).toHaveBeenCalledWith('home');

      handleSelect.mockClear();
      fireEvent.keyDown(item, { key: ' ' });
      expect(handleSelect).toHaveBeenCalledWith('home');
    });
  });
});

describe('SideNav translated labels', () => {
  it('translates the default navigation label', () => {
    render(
      <LabelsProvider labels={{ 'sideNav.label': 'Navigation laterale' }}>
        <SideNav>
          <SideNavItem value="home" icon="home" label="Home" />
        </SideNav>
      </LabelsProvider>
    );
    expect(screen.getByLabelText('Navigation laterale')).toBeInTheDocument();
  });
});

describe('SideNav linkComponent', () => {
  it('renders item links with the custom component', () => {
    const Custom = ({ children, ...props }: SideNavLinkProps) => (
      <a {...props} data-custom="yes">
        {children}
      </a>
    );
    render(
      <SideNav linkComponent={Custom} selectedValue="home">
        <SideNavItem value="home" label="Home" href="/home" />
        <SideNavItem value="none" label="No link" />
      </SideNav>
    );
    const link = screen.getByRole('menuitem', { name: 'Home' });
    expect(link).toHaveAttribute('data-custom', 'yes');
    expect(link).toHaveAttribute('href', '/home');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('No link').closest('[data-custom]')).toBeNull();
  });

  it('renders a disabled link as a plain anchor without href', () => {
    const Custom = ({ children, ...props }: SideNavLinkProps) => (
      <a {...props} data-custom="yes">
        {children}
      </a>
    );
    render(
      <SideNav linkComponent={Custom}>
        <SideNavItem value="home" label="Home" href="/home" disabled />
      </SideNav>
    );
    const link = screen.getByRole('menuitem', { name: 'Home' });
    expect(link.tagName).toBe('A');
    expect(link).not.toHaveAttribute('href');
    expect(link).not.toHaveAttribute('data-custom');
    expect(link).toHaveAttribute('aria-disabled', 'true');
  });

  it('keeps the plain anchor output by default', () => {
    render(
      <SideNav>
        <SideNavItem value="home" label="Home" href="/home" />
      </SideNav>
    );
    const link = screen.getByRole('menuitem', { name: 'Home' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/home');
  });

  it('activates a link with Enter (not prevented) but still handles Enter on non-links', async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();
    const onLinkClick = jest.fn((e: React.MouseEvent) => e.preventDefault());
    render(
      <SideNav onSelect={onSelect}>
        <SideNavItem value="home" label="Home" href="/home" onClick={onLinkClick} />
        <SideNavItem value="act" label="Action" data-testid="act" />
      </SideNav>
    );
    screen.getByRole('menuitem', { name: 'Home' }).focus();
    await user.keyboard('{Enter}');
    expect(onLinkClick).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('home');

    onSelect.mockClear();
    screen.getByTestId('act').focus();
    await user.keyboard('{Enter}');
    expect(onSelect).toHaveBeenCalledWith('act');
  });
});
