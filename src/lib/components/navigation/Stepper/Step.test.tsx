import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Stepper, Step } from './index';

describe('Stepper and Step', () => {
  it('renders steps and handles clicks when allowed', () => {
    const onStepChange = jest.fn();

    render(
      <Stepper currentStep={1} onStepChange={onStepChange} allowStepClick>
        <Step title="First">First</Step>
        <Step title="Second">Second</Step>
        <Step title="Third">Third</Step>
      </Stepper>
    );

    // be flexible with text matching in case of nested markup/casing
    const first = screen.getByText(/First/i);
    // clicking previous step (index 0) is allowed
    fireEvent.click(first);
    expect(onStepChange).toHaveBeenCalledWith(0);

    const third = screen.getByText(/Third/i);
    // default onlyPreviousClickable: clicking forward step does not call change
    fireEvent.click(third);
    expect(onStepChange).toHaveBeenCalledTimes(1);
  });

  it('responds to keyboard Enter to activate step', () => {
    const onStepChange = jest.fn();
    render(
      <Stepper currentStep={1} onStepChange={onStepChange} allowStepClick>
        <Step title="First">First</Step>
        <Step title="Second">Second</Step>
      </Stepper>
    );

    const first = screen.getByText(/First/i);
    fireEvent.keyDown(first, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(onStepChange).toHaveBeenCalledWith(0);
  });
});
