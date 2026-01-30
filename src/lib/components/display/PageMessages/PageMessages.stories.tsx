import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PageMessages } from './PageMessages';
import { PageMessagesProvider } from '../../../contexts/PageMessagesContext';
import { GlobalProvider } from '../../../providers/GlobalProvider';
import { Button } from '../../buttons/Button';
import { Checkbox } from '../../inputs/Checkbox';
import { Card } from '../Card';
import { Icon } from '../Icon';

const meta: Meta<typeof PageMessages> = {
  title: 'Display/PageMessages',
  component: PageMessages,
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Show loading state (Priority: 1)',
    },
    error: {
      control: 'boolean',
      description: 'Show error state (Priority: 2)',
    },
    forbidden: {
      control: 'boolean',
      description: 'Show forbidden state (Priority: 3)',
    },
    notFound: {
      control: 'boolean',
      description: 'Show not found state (Priority: 4)',
    },
    unauthorized: {
      control: 'boolean',
      description: 'Show unauthorized state (Priority: 5)',
    },
    maintenance: {
      control: 'boolean',
      description: 'Show maintenance state (Priority: 6)',
    },
    offline: {
      control: 'boolean',
      description: 'Show offline state (Priority: 7)',
    },
    timeout: {
      control: 'boolean',
      description: 'Show timeout state (Priority: 8)',
    },
    empty: {
      control: 'boolean',
      description: 'Show empty state (Priority: 9)',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Size variant for icons and text',
    },
    fullScreen: {
      control: 'boolean',
      description: 'Display in fullscreen mode',
    },
    centerVertically: {
      control: 'boolean',
      description: 'Center content vertically',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof PageMessages>;

// Sample children content using Card component
const SampleContent = () => (
  <Card variant="outlined" padding="lg">
    <h2 style={{ margin: '0 0 8px 0' }}>Page Content</h2>
    <p style={{ margin: 0, color: 'var(--theme-text-secondary)' }}>
      This is the actual page content that renders when no state is active.
    </p>
  </Card>
);

// Helper component for ErrorWithRetry story
function ErrorWithRetryDemo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(true);

  const handleRetry = () => {
    setError(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setError(true);
    }, 2000);
  };

  return (
    <PageMessages
      loading={loading}
      error={error}
      onRetry={handleRetry}
      style={{ minWidth: '400px' }}
    >
      <SampleContent />
    </PageMessages>
  );
}

// Helper component for PriorityDemo story
function PriorityDemoContent() {
  const [states, setStates] = useState({
    loading: true,
    error: true,
    forbidden: true,
  });

  return (
    <div style={{ maxWidth: '500px' }}>
      <Card variant="elevated" padding="md" style={{ marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 12px 0' }}>Toggle states to see priority:</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {(Object.keys(states) as Array<keyof typeof states>).map((key) => (
            <Checkbox
              key={key}
              label={key}
              checked={states[key]}
              onChange={(checked) => setStates((prev) => ({ ...prev, [key]: checked }))}
            />
          ))}
        </div>
        <p style={{ marginTop: '12px', color: 'var(--theme-text-secondary)', fontSize: '14px' }}>
          Priority: Loading (1) &gt; Error (2) &gt; Forbidden (3)
        </p>
      </Card>
      <Card variant="outlined" padding="none" style={{ minHeight: '300px', overflow: 'hidden' }}>
        <PageMessages {...states}>
          <SampleContent />
        </PageMessages>
      </Card>
    </div>
  );
}

export const Default: Story = {
  args: {
    children: <SampleContent />,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: <SampleContent />,
  },
};

export const LoadingCustom: Story = {
  args: {
    loading: true,
    loadingConfig: {
      title: 'Fetching your data...',
      description: 'Please wait while we load your content.',
      spinnerProps: {
        spinnerStyle: 'dots',
        variant: 'primary',
      },
    },
    children: <SampleContent />,
  },
};

export const Error: Story = {
  args: {
    error: true,
    children: <SampleContent />,
  },
};

export const ErrorWithMessage: Story = {
  args: {
    error: 'Failed to fetch user data. The server returned a 500 error.',
    children: <SampleContent />,
  },
};

export const ErrorWithRetry: Story = {
  render: () => <ErrorWithRetryDemo />,
};

export const Forbidden: Story = {
  args: {
    forbidden: true,
    children: <SampleContent />,
  },
};

export const NotFound: Story = {
  args: {
    notFound: true,
    children: <SampleContent />,
  },
};

export const Unauthorized: Story = {
  args: {
    unauthorized: true,
    children: <SampleContent />,
  },
};

export const Maintenance: Story = {
  args: {
    maintenance: true,
    children: <SampleContent />,
  },
};

export const Offline: Story = {
  args: {
    offline: true,
    children: <SampleContent />,
  },
};

export const Timeout: Story = {
  args: {
    timeout: true,
    children: <SampleContent />,
  },
};

export const Empty: Story = {
  args: {
    empty: true,
    children: <SampleContent />,
  },
};

export const EmptyWithActions: Story = {
  args: {
    empty: true,
    emptyConfig: {
      title: 'No projects yet',
      description: 'Create your first project to get started with your work.',
      icon: 'folder-plus',
      primaryAction: {
        label: 'Create Project',
        onClick: () => {
          // Action handler
        },
        icon: 'plus',
      },
      secondaryAction: {
        label: 'Learn More',
        onClick: () => {
          // Action handler
        },
        variant: 'outline',
      },
    },
    children: <SampleContent />,
  },
};

export const CustomRenderer: Story = {
  args: {
    error: true,
    errorConfig: {
      render: () => (
        <Card variant="elevated" padding="lg" style={{ textAlign: 'center', maxWidth: '400px' }}>
          <Icon
            name="settings"
            size={64}
            style={{ color: 'var(--theme-warning)', marginBottom: '16px' }}
          />
          <h2 style={{ margin: '0 0 8px 0' }}>Custom Error Display</h2>
          <p style={{ color: 'var(--theme-text-secondary)', marginBottom: '16px' }}>
            This is a completely custom renderer using the Card and Icon components.
          </p>
          <Button
            variant="primary"
            startIcon="refresh"
            onClick={() => {
              // Action handler
            }}
          >
            Retry Request
          </Button>
        </Card>
      ),
    },
    children: <SampleContent />,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Card key={size} variant="outlined" padding="sm" style={{ width: '200px' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Size: {size}</p>
          <PageMessages error size={size} centerVertically={false}>
            <SampleContent />
          </PageMessages>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    controls: { disable: true },
    layout: 'padded',
  },
};

export const AllStates: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '24px',
        maxWidth: '1200px',
      }}
    >
      {[
        { name: 'Loading', props: { loading: true } },
        { name: 'Error', props: { error: true } },
        { name: 'Forbidden', props: { forbidden: true } },
        { name: 'Not Found', props: { notFound: true } },
        { name: 'Unauthorized', props: { unauthorized: true } },
        { name: 'Maintenance', props: { maintenance: true } },
        { name: 'Offline', props: { offline: true } },
        { name: 'Timeout', props: { timeout: true } },
        { name: 'Empty', props: { empty: true } },
      ].map(({ name, props }) => (
        <Card key={name} variant="outlined" padding="none" style={{ overflow: 'hidden' }}>
          <div
            style={{
              padding: '8px 16px',
              background: 'var(--theme-background-secondary)',
              borderBottom: '1px solid var(--theme-border)',
              fontWeight: 600,
            }}
          >
            {name}
          </div>
          <div style={{ minHeight: '250px' }}>
            <PageMessages {...props} size="sm">
              <SampleContent />
            </PageMessages>
          </div>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    controls: { disable: true },
    layout: 'padded',
  },
};

export const PriorityDemo: Story = {
  render: () => <PriorityDemoContent />,
  parameters: {
    controls: { disable: true },
  },
};

export const WithContextDefaults: Story = {
  render: () => (
    <PageMessagesProvider
      defaults={{
        error: {
          title: 'Oops! Something broke',
          description: 'Our team has been notified and is working on a fix.',
          icon: 'error',
        },
        empty: {
          title: 'Nothing to see here',
          description: 'Add some items to get started.',
          icon: 'inbox',
        },
      }}
      actions={{
        onRetry: () => {
          // Retry action
        },
        onGoHome: () => {
          // Go home action
        },
      }}
    >
      <div style={{ display: 'flex', gap: '24px' }}>
        <Card variant="outlined" padding="none" style={{ width: '300px', overflow: 'hidden' }}>
          <PageMessages error>
            <SampleContent />
          </PageMessages>
        </Card>
        <Card variant="outlined" padding="none" style={{ width: '300px', overflow: 'hidden' }}>
          <PageMessages empty>
            <SampleContent />
          </PageMessages>
        </Card>
      </div>
    </PageMessagesProvider>
  ),
  parameters: {
    controls: { disable: true },
  },
};

/**
 * This story demonstrates how to configure PageMessages defaults at the application level
 * using the GlobalProvider. This is the recommended approach for setting consistent
 * error messages, actions, and styling across your entire application.
 */
export const GlobalProviderConfiguration: Story = {
  render: () => (
    <GlobalProvider
      themeConfig={{ mode: 'light' }}
      pageMessagesConfig={{
        defaults: {
          loading: {
            title: 'Loading your content...',
            description: 'This may take a moment.',
            spinnerProps: {
              spinnerStyle: 'dots',
              variant: 'primary',
            },
          },
          error: {
            title: 'Something went wrong',
            description: 'We encountered an unexpected error. Please try again.',
            icon: 'error',
          },
          notFound: {
            title: '404 - Page Not Found',
            description: 'The page you are looking for does not exist.',
            icon: 'search',
          },
          unauthorized: {
            title: 'Please Sign In',
            description: 'You need to be logged in to view this content.',
            icon: 'lock',
          },
          empty: {
            title: 'No Results',
            description: 'Try adjusting your filters or search criteria.',
            icon: 'inbox',
          },
        },
        actions: {
          onRetry: () => {
            // Global retry handler - could refresh data or reload page
          },
          onGoHome: () => {
            // Global home navigation - would use router.push('/')
          },
          onGoBack: () => {
            // Global back navigation - would use router.back()
          },
          onLogin: () => {
            // Global login redirect - would use router.push('/login')
          },
        },
        defaultProps: {
          size: 'md',
          centerVertically: true,
        },
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
        <Card variant="elevated" padding="lg">
          <h3 style={{ margin: '0 0 12px 0' }}>GlobalProvider Configuration</h3>
          <p style={{ margin: '0 0 16px 0', color: 'var(--theme-text-secondary)' }}>
            Configure PageMessages defaults at the app level using the GlobalProvider&apos;s
            <code
              style={{
                background: 'var(--theme-background-secondary)',
                padding: '2px 6px',
                borderRadius: '4px',
                margin: '0 4px',
              }}
            >
              pageMessagesConfig
            </code>
            prop. All PageMessages components within this provider will inherit these defaults.
          </p>
          <pre
            style={{
              background: 'var(--theme-background-secondary)',
              padding: '16px',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '12px',
              margin: 0,
            }}
          >
            {`<GlobalProvider
  pageMessagesConfig={{
    defaults: {
      error: {
        title: 'Something went wrong',
        description: 'Please try again.',
        icon: 'error',
      },
      // ... other state defaults
    },
    actions: {
      onRetry: () => refetch(),
      onGoHome: () => router.push('/'),
      onLogin: () => router.push('/login'),
    },
  }}
>
  <App />
</GlobalProvider>`}
          </pre>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <Card variant="outlined" padding="none" style={{ overflow: 'hidden' }}>
            <div
              style={{
                padding: '8px 16px',
                background: 'var(--theme-background-secondary)',
                fontWeight: 600,
              }}
            >
              Error State
            </div>
            <div style={{ minHeight: '200px' }}>
              <PageMessages error>
                <SampleContent />
              </PageMessages>
            </div>
          </Card>

          <Card variant="outlined" padding="none" style={{ overflow: 'hidden' }}>
            <div
              style={{
                padding: '8px 16px',
                background: 'var(--theme-background-secondary)',
                fontWeight: 600,
              }}
            >
              Loading State
            </div>
            <div style={{ minHeight: '200px' }}>
              <PageMessages loading>
                <SampleContent />
              </PageMessages>
            </div>
          </Card>

          <Card variant="outlined" padding="none" style={{ overflow: 'hidden' }}>
            <div
              style={{
                padding: '8px 16px',
                background: 'var(--theme-background-secondary)',
                fontWeight: 600,
              }}
            >
              Unauthorized State
            </div>
            <div style={{ minHeight: '200px' }}>
              <PageMessages unauthorized>
                <SampleContent />
              </PageMessages>
            </div>
          </Card>

          <Card variant="outlined" padding="none" style={{ overflow: 'hidden' }}>
            <div
              style={{
                padding: '8px 16px',
                background: 'var(--theme-background-secondary)',
                fontWeight: 600,
              }}
            >
              Empty State
            </div>
            <div style={{ minHeight: '200px' }}>
              <PageMessages empty>
                <SampleContent />
              </PageMessages>
            </div>
          </Card>
        </div>
      </div>
    </GlobalProvider>
  ),
  parameters: {
    controls: { disable: true },
    layout: 'padded',
  },
};

export const NoStateShowsChildren: Story = {
  render: () => (
    <Card variant="outlined" padding="lg" style={{ maxWidth: '500px' }}>
      <p style={{ margin: '0 0 16px 0', color: 'var(--theme-text-secondary)' }}>
        When no state is active, children are rendered directly without any wrapper:
      </p>
      <PageMessages>
        <SampleContent />
      </PageMessages>
    </Card>
  ),
  parameters: {
    controls: { disable: true },
  },
};

export const Playground: Story = {
  args: {
    loading: false,
    error: false,
    forbidden: false,
    notFound: false,
    unauthorized: false,
    maintenance: false,
    offline: false,
    timeout: false,
    empty: false,
    size: 'md',
    fullScreen: false,
    centerVertically: true,
    children: <SampleContent />,
  },
};
