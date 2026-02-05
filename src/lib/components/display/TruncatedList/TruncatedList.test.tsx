import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TruncatedList } from './TruncatedList';

describe('TruncatedList', () => {
  describe('rendering', () => {
    it('renders items', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      render(<TruncatedList items={items} renderItem={(item) => <span>{item}</span>} />);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <TruncatedList
          items={['Item 1']}
          renderItem={(item) => <span>{item}</span>}
          className="custom-class"
          data-testid="list"
        />
      );
      expect(screen.getByTestId('list')).toHaveClass('custom-class');
    });
  });

  describe('truncation', () => {
    it('shows all items when count is less than maxVisible', () => {
      const items = ['Item 1', 'Item 2'];
      render(
        <TruncatedList items={items} maxVisible={3} renderItem={(item) => <span>{item}</span>} />
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.queryByText(/more/)).not.toBeInTheDocument();
    });

    it('truncates items when count exceeds maxVisible', () => {
      const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
      render(
        <TruncatedList items={items} maxVisible={3} renderItem={(item) => <span>{item}</span>} />
      );
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.getByText('Item 3')).toBeInTheDocument();
      expect(screen.queryByText('Item 4')).not.toBeInTheDocument();
      expect(screen.queryByText('Item 5')).not.toBeInTheDocument();
    });

    it('shows more indicator when items are truncated', () => {
      const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
      render(
        <TruncatedList items={items} maxVisible={2} renderItem={(item) => <span>{item}</span>} />
      );
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });

    it('renders custom more indicator', () => {
      const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
      render(
        <TruncatedList
          items={items}
          maxVisible={2}
          renderItem={(item) => <span>{item}</span>}
          renderMore={(count) => <button>Show {count} more</button>}
        />
      );
      expect(screen.getByText('Show 2 more')).toBeInTheDocument();
    });
  });

  describe('onMoreClick', () => {
    it('calls onMoreClick when more indicator is clicked', () => {
      const onMoreClick = jest.fn();
      const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
      render(
        <TruncatedList
          items={items}
          maxVisible={2}
          renderItem={(item) => <span>{item}</span>}
          onMoreClick={onMoreClick}
        />
      );

      fireEvent.click(screen.getByText('+2 more'));
      expect(onMoreClick).toHaveBeenCalledWith(['Item 3', 'Item 4']);
    });
  });

  describe('direction', () => {
    it('uses horizontal direction by default', () => {
      const { container } = render(
        <TruncatedList items={['Item 1']} renderItem={(item) => <span>{item}</span>} />
      );
      const element = container.querySelector('[data-component="truncated-list"]');
      expect(element).toHaveAttribute('data-direction', 'horizontal');
    });

    it('renders with vertical direction', () => {
      const { container } = render(
        <TruncatedList
          items={['Item 1']}
          direction="vertical"
          renderItem={(item) => <span>{item}</span>}
        />
      );
      const element = container.querySelector('[data-component="truncated-list"]');
      expect(element).toHaveAttribute('data-direction', 'vertical');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <TruncatedList ref={ref} items={['Item 1']} renderItem={(item) => <span>{item}</span>} />
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('edge cases', () => {
    it('renders with empty items array', () => {
      render(
        <TruncatedList items={[]} renderItem={(item) => <span>{item}</span>} data-testid="list" />
      );
      expect(screen.getByTestId('list')).toBeInTheDocument();
    });

    it('renders with single item', () => {
      render(<TruncatedList items={['Only Item']} renderItem={(item) => <span>{item}</span>} />);
      expect(screen.getByText('Only Item')).toBeInTheDocument();
      expect(screen.queryByText(/more/)).not.toBeInTheDocument();
    });
  });
});
