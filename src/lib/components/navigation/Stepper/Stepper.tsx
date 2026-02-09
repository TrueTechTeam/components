import React, { useMemo, useId, useCallback } from 'react';
import type { BaseComponentProps, ComponentSize } from '../../../types';
import {
  StepperContext,
  type StepperContextValue,
  type StepperVariant,
  type StepperOrientation,
} from './StepperContext';
import styles from './Stepper.module.scss';

export interface StepperProps extends BaseComponentProps {
  /**
   * Current active step (0-indexed)
   */
  currentStep: number;

  /**
   * Callback when step is clicked
   */
  onStepChange?: (step: number) => void;

  /**
   * Orientation
   * @default 'horizontal'
   */
  orientation?: StepperOrientation;

  /**
   * Visual variant
   * @default 'numbered'
   */
  variant?: StepperVariant;

  /**
   * Size
   * @default 'md'
   */
  size?: ComponentSize;

  /**
   * Allow clicking on steps to navigate
   * @default false
   */
  allowStepClick?: boolean;

  /**
   * Only allow clicking previous steps
   * @default true
   */
  onlyPreviousClickable?: boolean;

  /**
   * Completed steps (for non-linear steppers)
   */
  completedSteps?: number[];

  /**
   * Step components
   */
  children: React.ReactNode;
}

/**
 * Stepper - Wizard-style step navigation
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Stepper currentStep={currentStep} onStepChange={setCurrentStep}>
 *   <Step title="Account" description="Create your account" />
 *   <Step title="Profile" description="Set up your profile" />
 *   <Step title="Review" description="Review and confirm" />
 * </Stepper>
 *
 * // With clickable steps
 * <Stepper
 *   currentStep={currentStep}
 *   onStepChange={setCurrentStep}
 *   allowStepClick
 *   onlyPreviousClickable
 * >
 *   <Step title="Step 1" />
 *   <Step title="Step 2" />
 *   <Step title="Step 3" />
 * </Stepper>
 *
 * // Vertical orientation
 * <Stepper currentStep={currentStep} orientation="vertical">
 *   <Step title="Step 1">Step 1 content</Step>
 *   <Step title="Step 2">Step 2 content</Step>
 *   <Step title="Step 3">Step 3 content</Step>
 * </Stepper>
 * ```
 */
export const Stepper = ({
  ref,
  currentStep,
  onStepChange,
  orientation = 'horizontal',
  variant = 'numbered',
  size = 'md',
  allowStepClick = false,
  onlyPreviousClickable = true,
  completedSteps = [],
  children,
  className,
  'data-testid': testId,
  'aria-label': ariaLabel,
  style,
  ...restProps
}: StepperProps & {
  ref?: React.Ref<HTMLDivElement>;
}) => {
  const stepperId = useId();

  // Provide a no-op registerStep for backwards compatibility
  // Step index is now injected directly via _stepIndex prop
  const registerStep = useCallback(() => 0, []);

  // Count total steps
  const totalSteps = React.Children.count(children);

  const handleStepClick = useCallback(
    (step: number) => {
      if (!allowStepClick) {
        return;
      }
      if (onlyPreviousClickable && step > currentStep) {
        return;
      }
      onStepChange?.(step);
    },
    [allowStepClick, onlyPreviousClickable, currentStep, onStepChange]
  );

  const completedStepsSet = useMemo(() => new Set(completedSteps), [completedSteps]);

  const contextValue: StepperContextValue = useMemo(
    () => ({
      stepperId,
      currentStep,
      totalSteps,
      orientation,
      variant,
      size,
      completedSteps: completedStepsSet,
      onStepClick: handleStepClick,
      allowStepClick,
      onlyPreviousClickable,
      registerStep,
    }),
    [
      stepperId,
      currentStep,
      totalSteps,
      orientation,
      variant,
      size,
      completedStepsSet,
      handleStepClick,
      allowStepClick,
      onlyPreviousClickable,
      registerStep,
    ]
  );

  const componentClasses = [styles.stepper, className].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={componentClasses}
      data-component="stepper"
      data-orientation={orientation}
      data-variant={variant}
      data-size={size}
      data-testid={testId}
      aria-label={ariaLabel || 'Progress steps'}
      role="group"
      style={style}
      {...restProps}
    >
      <StepperContext.Provider value={contextValue}>
        {React.Children.map(children, (child, index) => (
          <>
            {React.isValidElement(child)
              ? React.cloneElement(child as React.ReactElement<{ _stepIndex?: number }>, {
                  _stepIndex: index,
                })
              : child}
            {index < totalSteps - 1 && <div className={styles.connector} data-step={index} />}
          </>
        ))}
      </StepperContext.Provider>
    </div>
  );
};

export default Stepper;
