import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useFormState } from './useFormState';

function Harness({ options = {} as any }: { options?: any }) {
  const form = useFormState(options);

  return (
    <div>
      <div data-testid="values">{JSON.stringify(form.values)}</div>
      <div data-testid="errors">{JSON.stringify(form.errors)}</div>
      <div data-testid="touched">{JSON.stringify(form.touched)}</div>
      <div data-testid="isSubmitting">{String(form.isSubmitting)}</div>
      <div data-testid="isDirty">{String(form.isDirty)}</div>

      <button onClick={() => form.setFieldValue('name', 'Alice')}>setName</button>
      <button onClick={() => form.setFieldValue('age', 30)}>setAge</button>
      <button onClick={() => form.setFieldTouched('name', true)}>touchName</button>
      <button onClick={() => form.setFieldError('name', 'Err')}>setErr</button>
      <button onClick={() => form.validateField('name')}>validateName</button>
      <button onClick={() => form.validateForm()}>validateForm</button>
      <button onClick={() => form.resetForm()}>reset</button>

      {/* helpers for foo field change testing */}
      <button onClick={() => form.setFieldValue('foo', 'a')}>setFooA</button>
      <button onClick={() => form.setFieldValue('foo', '')}>setFooEmpty</button>

      <button
        onClick={() =>
          form.registerField('registered', { name: 'registered', type: 'input', defaultValue: 'd' })
        }
      >
        register
      </button>
      <button
        onClick={() => {
          // submit form (async)
          form.submitForm();
        }}
      >
        submit
      </button>
    </div>
  );
}

describe('useFormState', () => {
  it('initializes with default values and updates values', () => {
    render(<Harness options={{ initialValues: { name: 'Bob' } }} />);

    expect(screen.getByTestId('values').textContent).toContain('Bob');

    fireEvent.click(screen.getByText('setName'));
    expect(screen.getByTestId('values').textContent).toContain('Alice');

    fireEvent.click(screen.getByText('setAge'));
    expect(screen.getByTestId('values').textContent).toContain('30');
  });

  it('sets touched and errors and can reset', async () => {
    render(
      <Harness
        options={{
          initialValues: { name: '' },
          fields: [{ name: 'name', validation: { required: true } }],
        }}
      />
    );

    // touch should set touched state
    fireEvent.click(screen.getByText('touchName'));
    expect(screen.getByTestId('touched').textContent).toContain('true');

    // validate field (required) should set error
    fireEvent.click(screen.getByText('validateName'));
    await waitFor(() =>
      expect(screen.getByTestId('errors').textContent).toContain('This field is required')
    );

    // set error manually
    fireEvent.click(screen.getByText('setErr'));
    expect(screen.getByTestId('errors').textContent).toContain('Err');

    // reset should clear values, errors and touched
    fireEvent.click(screen.getByText('reset'));
    expect(screen.getByTestId('values').textContent).toContain('"name":""');
    expect(screen.getByTestId('errors').textContent).toBe('{}');
    expect(screen.getByTestId('touched').textContent).toBe('{}');
  });

  it('registerField sets default value', () => {
    render(<Harness />);

    fireEvent.click(screen.getByText('register'));

    expect(screen.getByTestId('values').textContent).toContain('"registered":"d"');
  });

  it('submits form and calls onSubmit when valid', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(
      <Harness
        options={{
          initialValues: { name: '' },
          onSubmit,
          fields: [{ name: 'name', validation: { required: false } }],
        }}
      />
    );

    fireEvent.click(screen.getByText('submit'));

    await waitFor(() => expect(screen.getByTestId('isSubmitting').textContent).toBe('false'));

    expect(onSubmit).toHaveBeenCalled();
  });

  it('validateOn change triggers validation', async () => {
    render(
      <Harness
        options={{
          initialValues: { foo: '' },
          validateOn: 'change',
          fields: [{ name: 'foo', validation: { required: true } }],
        }}
      />
    );

    // set foo to non-empty then back to empty
    fireEvent.click(screen.getByText('setFooA'));
    fireEvent.click(screen.getByText('setFooEmpty'));

    // Because validation is scheduled on change (setTimeout), call validateForm to ensure validation ran
    fireEvent.click(screen.getByText('validateForm'));

    await waitFor(() =>
      expect(screen.getByTestId('errors').textContent).toContain('This field is required')
    );
  });
});
