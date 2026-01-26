import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from './Tabs';
import { TabList } from './TabList';
import { Tab } from './Tab';
import { TabPanel } from './TabPanel';

const TestTabs = ({
  defaultValue = 'tab1',
  ...props
}: Partial<React.ComponentProps<typeof Tabs>>) => (
  <Tabs defaultValue={defaultValue} {...props}>
    <TabList>
      <Tab value="tab1">Tab 1</Tab>
      <Tab value="tab2">Tab 2</Tab>
      <Tab value="tab3">Tab 3</Tab>
    </TabList>
    <TabPanel value="tab1">Content 1</TabPanel>
    <TabPanel value="tab2">Content 2</TabPanel>
    <TabPanel value="tab3">Content 3</TabPanel>
  </Tabs>
);

describe('Tabs', () => {
  describe('rendering', () => {
    it('should render tabs and panels', () => {
      render(<TestTabs />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getAllByRole('tab')).toHaveLength(3);
      expect(screen.getAllByRole('tabpanel')).toHaveLength(1); // Only active panel visible
    });

    it('should render with defaultValue selected', () => {
      render(<TestTabs defaultValue="tab2" />);
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Content 2')).toBeVisible();
    });
  });

  describe('selection', () => {
    it('should change tab on click', () => {
      render(<TestTabs />);

      expect(screen.getByText('Content 1')).toBeVisible();

      fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByText('Content 2')).toBeVisible();
    });

    it('should call onChange with new value', () => {
      const handleChange = jest.fn();
      render(<TestTabs onChange={handleChange} />);

      fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(handleChange).toHaveBeenCalledWith('tab2');
    });
  });

  describe('controlled mode', () => {
    it('should use value prop when provided', () => {
      render(
        <Tabs value="tab2">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
          </TabList>
          <TabPanel value="tab1">Content 1</TabPanel>
          <TabPanel value="tab2">Content 2</TabPanel>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
    });

    it('should reflect value prop changes', () => {
      const { rerender } = render(
        <Tabs value="tab1">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
          </TabList>
          <TabPanel value="tab1">Content 1</TabPanel>
          <TabPanel value="tab2">Content 2</TabPanel>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'true');

      rerender(
        <Tabs value="tab2">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2">Tab 2</Tab>
          </TabList>
          <TabPanel value="tab1">Content 1</TabPanel>
          <TabPanel value="tab2">Content 2</TabPanel>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('keyboard navigation', () => {
    it('should navigate with arrow keys', () => {
      render(<TestTabs />);

      const tabList = screen.getByRole('tablist');
      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });

      // Focus first tab
      tab1.focus();
      expect(document.activeElement).toBe(tab1);

      // Navigate right
      fireEvent.keyDown(tabList, { key: 'ArrowRight' });
      expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab 2' }));

      // Navigate right again
      fireEvent.keyDown(tabList, { key: 'ArrowRight' });
      expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab 3' }));

      // Navigate right wraps to first
      fireEvent.keyDown(tabList, { key: 'ArrowRight' });
      expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab 1' }));
    });

    it('should navigate to first/last with Home/End', () => {
      render(<TestTabs />);

      const tabList = screen.getByRole('tablist');
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

      // Focus middle tab
      tab2.focus();

      // Navigate to last
      fireEvent.keyDown(tabList, { key: 'End' });
      expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab 3' }));

      // Navigate to first
      fireEvent.keyDown(tabList, { key: 'Home' });
      expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab 1' }));
    });
  });

  describe('disabled state', () => {
    it('should disable all tabs when tabs is disabled', () => {
      render(<TestTabs disabled />);

      screen.getAllByRole('tab').forEach((tab) => {
        expect(tab).toBeDisabled();
      });
    });

    it('should disable individual tabs', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabList>
            <Tab value="tab1">Tab 1</Tab>
            <Tab value="tab2" disabled>
              Tab 2
            </Tab>
            <Tab value="tab3">Tab 3</Tab>
          </TabList>
          <TabPanel value="tab1">Content 1</TabPanel>
          <TabPanel value="tab2">Content 2</TabPanel>
          <TabPanel value="tab3">Content 3</TabPanel>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Tab 1' })).not.toBeDisabled();
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeDisabled();
      expect(screen.getByRole('tab', { name: 'Tab 3' })).not.toBeDisabled();
    });

    it('should not call onChange when disabled tab is clicked', () => {
      const handleChange = jest.fn();
      render(<TestTabs disabled onChange={handleChange} />);

      fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('data attributes', () => {
    it('should set data-orientation', () => {
      render(<TestTabs orientation="vertical" />);
      expect(screen.getByTestId('tabs')).toHaveAttribute('data-orientation', 'vertical');
    });

    it('should set data-variant', () => {
      render(<TestTabs variant="enclosed" />);
      expect(screen.getByTestId('tabs')).toHaveAttribute('data-variant', 'enclosed');
    });

    it('should set data-size', () => {
      render(<TestTabs size="lg" />);
      expect(screen.getByTestId('tabs')).toHaveAttribute('data-size', 'lg');
    });

    it('should set data-selected on active tab', () => {
      render(<TestTabs defaultValue="tab1" />);
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('data-selected', 'true');
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes on tablist', () => {
      render(<TestTabs orientation="horizontal" />);
      expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('should have proper ARIA attributes on tabs', () => {
      render(<TestTabs defaultValue="tab1" />);

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab1).toHaveAttribute('aria-selected', 'true');
      expect(tab1).toHaveAttribute('tabindex', '0');

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      expect(tab2).toHaveAttribute('aria-selected', 'false');
      expect(tab2).toHaveAttribute('tabindex', '-1');
    });

    it('should link tabs and panels with ARIA', () => {
      render(<TestTabs defaultValue="tab1" />);

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const panel = screen.getByRole('tabpanel');

      // Tab should have aria-controls pointing to panel
      const panelId = panel.getAttribute('id');
      expect(tab1).toHaveAttribute('aria-controls', panelId);

      // Panel should have aria-labelledby pointing to tab
      const tabId = tab1.getAttribute('id');
      expect(panel).toHaveAttribute('aria-labelledby', tabId);
    });
  });

  describe('lazy mounting', () => {
    it('should not render inactive panels when lazyMount is true', () => {
      render(<TestTabs lazyMount />);

      // Only active panel content should be in the document
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Content 3')).not.toBeInTheDocument();
    });

    it('should render panel when it becomes active with lazyMount', () => {
      render(<TestTabs lazyMount />);

      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });
});

describe('Tab', () => {
  it('should throw error when used outside Tabs', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<Tab value="test">Test</Tab>);
    }).toThrow('Tab components must be used within Tabs');

    consoleSpy.mockRestore();
  });
});

describe('TabPanel', () => {
  it('should throw error when used outside Tabs', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TabPanel value="test">Test</TabPanel>);
    }).toThrow('Tab components must be used within Tabs');

    consoleSpy.mockRestore();
  });
});
