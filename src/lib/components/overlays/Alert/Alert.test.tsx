import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Alert } from './Alert';
import { Icon } from '../../display/Icon';
import type { AlertVariant } from './AlertPresets';

const variants: AlertVariant[] = ['info', 'success', 'warning', 'error', 'confirm'];

describe('Alert', () => {
  it('should render with title and description', () => {
    render(<Alert isOpen title="Test Title" description="Test Description" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render with children', () => {
    render(<Alert isOpen>Child content</Alert>);
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it.each(variants)('should render %s variant', (variant) => {
    render(<Alert isOpen variant={variant} title="Variant" />);
    expect(screen.getByTestId('alert')).toHaveAttribute('data-variant', variant);
  });

  it('should render with custom icon', () => {
    render(<Alert isOpen icon={<Icon name="check" />} title="Icon" />);
    expect(screen.getByTestId('alert')).toBeInTheDocument();
  });

  it('should hide icon when hideIcon is true', () => {
    render(<Alert isOpen hideIcon title="No Icon" />);
    expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument();
  });

  it('should render confirm and cancel buttons', () => {
    render(
      <Alert isOpen variant="confirm" title="Confirm" onConfirm={jest.fn()} onCancel={jest.fn()} />
    );
    expect(screen.getByTestId('alert-confirm-button')).toBeInTheDocument();
    expect(screen.getByTestId('alert-cancel-button')).toBeInTheDocument();
  });

  it('should call onConfirm and onClose when confirm is clicked', async () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();
    render(
      <Alert isOpen variant="confirm" title="Confirm" onConfirm={onConfirm} onClose={onClose} />
    );
    fireEvent.click(screen.getByTestId('alert-confirm-button'));
    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('should call onCancel and onClose when cancel is clicked', () => {
    const onCancel = jest.fn();
    const onClose = jest.fn();
    render(<Alert isOpen variant="confirm" title="Cancel" onCancel={onCancel} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('alert-cancel-button'));
    expect(onCancel).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('should disable confirm button when confirmDisabled is true', () => {
    render(<Alert isOpen title="Disabled" confirmDisabled />);
    expect(screen.getByTestId('alert-confirm-button')).toBeDisabled();
  });

  it('should render extraActions', () => {
    render(<Alert isOpen title="Extra" extraActions={<button>Extra Action</button>} />);
    expect(screen.getByText('Extra Action')).toBeInTheDocument();
  });

  it('should have correct aria role', () => {
    render(<Alert isOpen title="Aria" />);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('should use custom data-testid', () => {
    render(<Alert isOpen title="TestId" data-testid="custom-alert" />);
    expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
  });
});
