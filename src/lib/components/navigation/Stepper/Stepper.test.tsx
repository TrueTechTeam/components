import { render, screen, fireEvent } from '@testing-library/react';
import { Stepper } from './Stepper';
import { Step } from './Step';

describe('Stepper', () => {
  describe('rendering', () => {
    it('should render with steps', () => {
      render(
        <Stepper currentStep={0} data-testid="stepper">
          <Step title="Step 1" />
          <Step title="Step 2" />
          <Step title="Step 3" />
        </Stepper>
      );

      expect(screen.getByTestId('stepper')).toBeInTheDocument();
      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByText('Step 3')).toBeInTheDocument();
    });

    it('should render with descriptions', () => {
      render(
        <Stepper currentStep={0}>
          <Step title="Step 1" description="Description 1" />
          <Step title="Step 2" description="Description 2" />
        </Stepper>
      );

      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    });

    it('should apply orientation data attribute', () => {
      render(
        <Stepper currentStep={0} orientation="vertical" data-testid="stepper">
          <Step title="Step 1" />
        </Stepper>
      );

      expect(screen.getByTestId('stepper')).toHaveAttribute('data-orientation', 'vertical');
    });

    it('should apply variant data attribute', () => {
      render(
        <Stepper currentStep={0} variant="dot" data-testid="stepper">
          <Step title="Step 1" />
        </Stepper>
      );

      expect(screen.getByTestId('stepper')).toHaveAttribute('data-variant', 'dot');
    });
  });

  describe('step states', () => {
    it('should mark current step as active', () => {
      render(
        <Stepper currentStep={1}>
          <Step title="Step 1" data-testid="step-0" />
          <Step title="Step 2" data-testid="step-1" />
          <Step title="Step 3" data-testid="step-2" />
        </Stepper>
      );

      expect(screen.getByTestId('step-1')).toHaveAttribute('data-active', 'true');
    });

    it('should mark previous steps as completed', () => {
      render(
        <Stepper currentStep={2}>
          <Step title="Step 1" data-testid="step-0" />
          <Step title="Step 2" data-testid="step-1" />
          <Step title="Step 3" data-testid="step-2" />
        </Stepper>
      );

      expect(screen.getByTestId('step-0')).toHaveAttribute('data-completed', 'true');
      expect(screen.getByTestId('step-1')).toHaveAttribute('data-completed', 'true');
      expect(screen.getByTestId('step-2')).toHaveAttribute('data-active', 'true');
    });

    it('should mark explicitly completed steps', () => {
      render(
        <Stepper currentStep={0} completedSteps={[1, 2]}>
          <Step title="Step 1" data-testid="step-0" />
          <Step title="Step 2" data-testid="step-1" />
          <Step title="Step 3" data-testid="step-2" />
        </Stepper>
      );

      expect(screen.getByTestId('step-1')).toHaveAttribute('data-completed', 'true');
      expect(screen.getByTestId('step-2')).toHaveAttribute('data-completed', 'true');
    });
  });

  describe('clickable steps', () => {
    it('should call onStepChange when clicking previous steps', () => {
      const handleChange = jest.fn();
      render(
        <Stepper currentStep={2} onStepChange={handleChange} allowStepClick onlyPreviousClickable>
          <Step title="Step 1" data-testid="step-0" />
          <Step title="Step 2" data-testid="step-1" />
          <Step title="Step 3" data-testid="step-2" />
        </Stepper>
      );

      fireEvent.click(screen.getByTestId('step-0').querySelector('[role="button"]')!);
      expect(handleChange).toHaveBeenCalledWith(0);
    });

    it('should not call onStepChange for future steps when onlyPreviousClickable', () => {
      const handleChange = jest.fn();
      render(
        <Stepper currentStep={0} onStepChange={handleChange} allowStepClick onlyPreviousClickable>
          <Step title="Step 1" data-testid="step-0" />
          <Step title="Step 2" data-testid="step-1" />
          <Step title="Step 3" data-testid="step-2" />
        </Stepper>
      );

      const step1 = screen.getByTestId('step-1');
      const clickable = step1.querySelector('[role="button"]');
      // Step should not be clickable
      expect(clickable).toBeNull();
    });

    it('should allow clicking any step when onlyPreviousClickable is false', () => {
      const handleChange = jest.fn();
      render(
        <Stepper
          currentStep={0}
          onStepChange={handleChange}
          allowStepClick
          onlyPreviousClickable={false}
        >
          <Step title="Step 1" data-testid="step-0" />
          <Step title="Step 2" data-testid="step-1" />
        </Stepper>
      );

      fireEvent.click(screen.getByTestId('step-1').querySelector('[role="button"]')!);
      expect(handleChange).toHaveBeenCalledWith(1);
    });
  });

  describe('step features', () => {
    it('should render optional label', () => {
      render(
        <Stepper currentStep={0}>
          <Step title="Optional Step" optional />
        </Stepper>
      );

      expect(screen.getByText('(Optional)')).toBeInTheDocument();
    });

    it('should render error state', () => {
      render(
        <Stepper currentStep={0}>
          <Step title="Error Step" error errorMessage="Something went wrong" data-testid="step" />
        </Stepper>
      );

      expect(screen.getByTestId('step')).toHaveAttribute('data-error', 'true');
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have group role with aria-label', () => {
      render(
        <Stepper currentStep={0} data-testid="stepper">
          <Step title="Step 1" />
        </Stepper>
      );

      expect(screen.getByTestId('stepper')).toHaveAttribute('role', 'group');
      expect(screen.getByTestId('stepper')).toHaveAttribute('aria-label', 'Progress steps');
    });

    it('should mark current step with aria-current', () => {
      render(
        <Stepper currentStep={1}>
          <Step title="Step 1" data-testid="step-0" />
          <Step title="Step 2" data-testid="step-1" />
        </Stepper>
      );

      expect(screen.getByTestId('step-1')).toHaveAttribute('aria-current', 'step');
    });

    it('should support keyboard navigation for clickable steps', () => {
      const handleChange = jest.fn();
      render(
        <Stepper currentStep={2} onStepChange={handleChange} allowStepClick>
          <Step title="Step 1" data-testid="step-0" />
          <Step title="Step 2" data-testid="step-1" />
        </Stepper>
      );

      const button = screen.getByTestId('step-0').querySelector('[role="button"]')!;
      fireEvent.keyDown(button, { key: 'Enter' });
      expect(handleChange).toHaveBeenCalledWith(0);
    });
  });
});
