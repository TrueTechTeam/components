import React, { forwardRef } from 'react';
import type { BaseComponentProps } from '../../../types';
import { Icon, type IconName } from '../../display/Icon';
import { useStepperContextStrict } from './StepperContext';
import styles from './Stepper.module.scss';

export interface StepProps extends BaseComponentProps {
  /**
   * Step title
   */
  title: string;

  /**
   * Step description
   */
  description?: string;

  /**
   * Custom icon (for 'icon' variant)
   */
  icon?: React.ReactNode | IconName;

  /**
   * Whether step is optional
   */
  optional?: boolean;

  /**
   * Whether step has error
   */
  error?: boolean;

  /**
   * Error message
   */
  errorMessage?: string;

  /**
   * Step content (for vertical orientation)
   */
  children?: React.ReactNode;

  /**
   * Step index (injected by Stepper parent)
   * @internal
   */
  _stepIndex?: number;
}

/**
 * Step - Individual step in a Stepper
 *
 * @example
 * ```tsx
 * <Step title="Account" description="Create your account" />
 *
 * // With custom icon
 * <Step title="Shipping" icon="Truck" />
 *
 * // Optional step
 * <Step title="Extras" optional />
 *
 * // With error
 * <Step title="Payment" error errorMessage="Please fix payment details" />
 * ```
 */
export const Step = forwardRef<HTMLDivElement, StepProps>(
  (
    {
      title,
      description,
      icon,
      optional = false,
      error = false,
      errorMessage,
      children,
      className,
      'data-testid': testId,
      style,
      _stepIndex = 0,
      ...restProps
    },
    ref
  ) => {
    const {
      currentStep,
      variant,
      size,
      orientation,
      completedSteps,
      onStepClick,
      allowStepClick,
      onlyPreviousClickable,
    } = useStepperContextStrict();

    // Use injected step index from parent
    const stepIndex = _stepIndex;

    const isActive = stepIndex === currentStep;
    const isCompleted = completedSteps.has(stepIndex) || stepIndex < currentStep;
    const isClickable =
      allowStepClick && (!onlyPreviousClickable || stepIndex <= currentStep || isCompleted);

    const handleClick = () => {
      if (isClickable) {
        onStepClick?.(stepIndex);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
        e.preventDefault();
        onStepClick?.(stepIndex);
      }
    };

    const renderIndicator = () => {
      // Show error icon if error
      if (error) {
        return <Icon name="error" />;
      }

      // Show checkmark if completed
      if (isCompleted && !isActive) {
        return <Icon name="check" />;
      }

      // Variant-specific rendering
      switch (variant) {
        case 'dot':
          return <span className={styles.dot} />;

        case 'icon':
          if (icon) {
            if (typeof icon === 'string') {
              return <Icon name={icon as IconName} />;
            }
            return icon;
          }
          return <span className={styles.number}>{stepIndex + 1}</span>;

        case 'numbered':
        default:
          return <span className={styles.number}>{stepIndex + 1}</span>;
      }
    };

    const componentClasses = [styles.step, className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={componentClasses}
        data-component="step"
        data-index={stepIndex}
        data-active={isActive || undefined}
        data-completed={isCompleted || undefined}
        data-error={error || undefined}
        data-clickable={isClickable || undefined}
        data-testid={testId}
        aria-current={isActive ? 'step' : undefined}
        style={style}
        {...restProps}
      >
        <div
          className={styles.stepHeader}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role={isClickable ? 'button' : undefined}
          tabIndex={isClickable ? 0 : undefined}
        >
          <div className={styles.indicator} data-size={size}>
            {renderIndicator()}
          </div>

          <div className={styles.labelContainer}>
            <div className={styles.title}>
              {title}
              {optional && <span className={styles.optional}>(Optional)</span>}
            </div>
            {description && <div className={styles.description}>{description}</div>}
            {error && errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
          </div>
        </div>

        {/* Content for vertical orientation */}
        {orientation === 'vertical' && children && (
          <div className={styles.content} data-active={isActive || undefined}>
            {children}
          </div>
        )}
      </div>
    );
  }
);

Step.displayName = 'Step';

export default Step;
