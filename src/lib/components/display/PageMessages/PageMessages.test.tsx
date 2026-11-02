import React from 'react';
import { render, screen } from '@testing-library/react';
import { PageMessages } from './PageMessages';
import { LabelsProvider } from '../../../contexts/LabelsContext';
import { PageMessagesProvider } from '../../../contexts/PageMessagesContext';

describe('PageMessages', () => {
  describe('rendering', () => {
    it('renders children when no state is active', () => {
      render(<PageMessages>Test Content</PageMessages>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('renders loading state', () => {
      render(<PageMessages loading>Content</PageMessages>);
      const element = screen.getByTestId('page-messages');
      expect(element).toHaveAttribute('data-state', 'loading');
    });

    it('renders error state', () => {
      render(<PageMessages error>Content</PageMessages>);
      const element = screen.getByTestId('page-messages');
      expect(element).toHaveAttribute('data-state', 'error');
    });

    it('renders empty state', () => {
      render(<PageMessages empty>Content</PageMessages>);
      const element = screen.getByTestId('page-messages');
      expect(element).toHaveAttribute('data-state', 'empty');
    });
  });

  describe('loading state', () => {
    it('renders loading spinner', () => {
      render(<PageMessages loading>Content</PageMessages>);
      expect(screen.getByTestId('page-messages-spinner')).toBeInTheDocument();
    });

    it('renders custom loading title', () => {
      render(
        <PageMessages loading loadingConfig={{ title: 'Please wait...' }}>
          Content
        </PageMessages>
      );
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('renders error title', () => {
      render(
        <PageMessages error errorConfig={{ title: 'Something went wrong' }}>
          Content
        </PageMessages>
      );
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('renders empty message', () => {
      render(
        <PageMessages empty emptyConfig={{ title: 'No data' }}>
          Content
        </PageMessages>
      );
      expect(screen.getByText('No data')).toBeInTheDocument();
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <PageMessages ref={ref} loading>
          Content
        </PageMessages>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe('PageMessages translated labels', () => {
  it('translates the default title and description', () => {
    render(
      <LabelsProvider
        labels={{
          'pageMessages.error.title': 'Oups',
          'pageMessages.error.description': 'Erreur inattendue',
        }}
      >
        <PageMessages error>content</PageMessages>
      </LabelsProvider>
    );
    expect(screen.getByText('Oups')).toBeInTheDocument();
    expect(screen.getByText('Erreur inattendue')).toBeInTheDocument();
  });
});

describe('PageMessages action labels', () => {
  it('translates the default retry action', () => {
    render(
      <LabelsProvider labels={{ 'pageMessages.tryAgain': 'Reessayer' }}>
        <PageMessagesProvider actions={{ onRetry: () => {} }}>
          <PageMessages error>content</PageMessages>
        </PageMessagesProvider>
      </LabelsProvider>
    );
    expect(screen.getByRole('button', { name: 'Reessayer' })).toBeInTheDocument();
  });
});
