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

describe('PageMessages action props', () => {
  it('uses onRetry for the retry action without forwarding it to the DOM', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const onRetry = jest.fn();
    render(<PageMessages error onRetry={onRetry} onGoBack={jest.fn()} />);
    screen.getByRole('button', { name: 'Try Again' }).click();
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe('PageMessages headingLevel', () => {
  it('renders the title as an h2 by default', () => {
    render(<PageMessages error />);
    expect(
      screen.getByRole('heading', { level: 2, name: 'Something went wrong' })
    ).toBeInTheDocument();
  });

  it('renders the title at the given heading level', () => {
    render(<PageMessages empty headingLevel={4} />);
    expect(screen.getByRole('heading', { level: 4, name: 'No Data' })).toBeInTheDocument();
  });
});
