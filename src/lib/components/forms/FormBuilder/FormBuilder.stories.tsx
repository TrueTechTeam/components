import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { useState } from 'react';
import { FormBuilder } from './FormBuilder';
import { Input } from '../../inputs/Input';
import type { FormFieldConfig } from './types';

const meta: Meta<typeof FormBuilder> = {
  title: 'Forms/FormBuilder',
  component: FormBuilder,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'success', 'warning', 'danger'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of form components',
    },
    layout: {
      control: 'select',
      options: ['vertical', 'horizontal', 'grid'],
      description: 'Form layout',
    },
    validateOn: {
      control: 'select',
      options: ['change', 'blur', 'submit'],
      description: 'When to validate fields',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
    showSubmitButton: {
      control: 'boolean',
      description: 'Show submit button',
    },
    showResetButton: {
      control: 'boolean',
      description: 'Show reset button',
    },
    onSubmit: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onValidate: { table: { disable: true } },
    // Hide complex controls
    fields: { table: { disable: true } },
    children: { table: { disable: true } },
    defaultValues: { table: { disable: true } },
    className: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
    style: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof FormBuilder>;

/**
 * Default form builder with config mode
 */
export const Default: Story = {
  render: () => {
    const fields: FormFieldConfig[] = [
      {
        name: 'email',
        type: 'input',
        label: 'Email',
        validation: { required: true },
        props: { type: 'email', placeholder: 'Enter your email' },
      },
      {
        name: 'password',
        type: 'input',
        label: 'Password',
        validation: { required: true, minLength: 8 },
        props: { type: 'password', placeholder: 'Enter your password' },
      },
    ];

    return (
      <div style={{ maxWidth: '500px' }}>
        <FormBuilder fields={fields} onSubmit={action('form-submitted')} />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Form builder using children mode
 */
export const ChildrenMode: Story = {
  render: () => {
    return (
      <div style={{ maxWidth: '500px' }}>
        <FormBuilder onSubmit={action('form-submitted')}>
          <Input name="username" label="Username" placeholder="Enter username" required />
          <Input name="email" type="email" label="Email" placeholder="Enter email" required />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Enter password"
            required
          />
        </FormBuilder>
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Complete registration form with various field types
 */
export const RegistrationForm: Story = {
  render: () => {
    const fields: FormFieldConfig[] = [
      {
        name: 'firstName',
        type: 'input',
        label: 'First Name',
        validation: { required: true },
        props: { placeholder: 'Enter your first name' },
      },
      {
        name: 'lastName',
        type: 'input',
        label: 'Last Name',
        validation: { required: true },
        props: { placeholder: 'Enter your last name' },
      },
      {
        name: 'email',
        type: 'input',
        label: 'Email',
        validation: {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          messages: { pattern: 'Please enter a valid email' },
        },
        props: { type: 'email', placeholder: 'Enter your email' },
      },
      {
        name: 'phone',
        type: 'phone',
        label: 'Phone Number',
        helperText: 'US phone number format',
      },
      {
        name: 'password',
        type: 'input',
        label: 'Password',
        validation: {
          required: true,
          minLength: 8,
          messages: { minLength: 'Password must be at least 8 characters' },
        },
        props: { type: 'password', placeholder: 'Create a password' },
      },
      {
        name: 'bio',
        type: 'textarea',
        label: 'Bio',
        helperText: 'Tell us about yourself',
        props: { placeholder: 'Enter your bio', rows: 3 },
      },
      {
        name: 'newsletter',
        type: 'checkbox',
        label: 'Subscribe to newsletter',
      },
    ];

    return (
      <div style={{ maxWidth: '600px' }}>
        <h3>User Registration</h3>
        <FormBuilder
          fields={fields}
          showResetButton
          onSubmit={(values) => {
            action('form-submitted')(values);
            alert('Registration submitted! Check console.');
          }}
        />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Contact form example
 */
export const ContactForm: Story = {
  render: () => {
    const fields: FormFieldConfig[] = [
      {
        name: 'name',
        type: 'input',
        label: 'Name',
        validation: { required: true },
        props: { placeholder: 'Your name' },
      },
      {
        name: 'email',
        type: 'input',
        label: 'Email',
        validation: { required: true },
        props: { type: 'email', placeholder: 'your@email.com' },
      },
      {
        name: 'subject',
        type: 'select',
        label: 'Subject',
        validation: { required: true },
        props: {
          options: [
            { value: '', label: 'Select a subject' },
            { value: 'support', label: 'Support' },
            { value: 'sales', label: 'Sales' },
            { value: 'feedback', label: 'Feedback' },
            { value: 'other', label: 'Other' },
          ],
        },
      },
      {
        name: 'message',
        type: 'textarea',
        label: 'Message',
        validation: { required: true, minLength: 10 },
        props: { placeholder: 'Your message', rows: 5 },
      },
    ];

    return (
      <div style={{ maxWidth: '600px' }}>
        <h3>Contact Us</h3>
        <FormBuilder
          fields={fields}
          submitButtonText="Send Message"
          submitButtonVariant="success"
          onSubmit={(values) => {
            action('form-submitted')(values);
            alert('Message sent! Check console.');
          }}
        />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Form with all available field types
 */
export const AllFieldTypes: Story = {
  render: () => {
    const fields: FormFieldConfig[] = [
      {
        name: 'input',
        type: 'input',
        label: 'Text Input',
        props: { placeholder: 'Enter text' },
      },
      {
        name: 'textarea',
        type: 'textarea',
        label: 'Textarea',
        props: { placeholder: 'Enter long text', rows: 3 },
      },
      {
        name: 'toggle',
        type: 'toggle',
        label: 'Toggle',
      },
      {
        name: 'checkbox',
        type: 'checkbox',
        label: 'Checkbox',
      },
      {
        name: 'radio',
        type: 'radio',
        label: 'Radio Group',
        props: {
          options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' },
          ],
        },
      },
      {
        name: 'select',
        type: 'select',
        label: 'Select',
        props: {
          options: [
            { value: '', label: 'Select an option' },
            { value: 'opt1', label: 'Option 1' },
            { value: 'opt2', label: 'Option 2' },
            { value: 'opt3', label: 'Option 3' },
          ],
        },
      },
      {
        name: 'slider',
        type: 'slider',
        label: 'Slider',
        props: { min: 0, max: 100, defaultValue: 50 },
      },
      {
        name: 'rating',
        type: 'rating',
        label: 'Rating',
      },
      {
        name: 'number',
        type: 'number',
        label: 'Number Input',
        props: { min: 0, max: 100 },
      },
      {
        name: 'phone',
        type: 'phone',
        label: 'Phone Input',
      },
      {
        name: 'tags',
        type: 'tag',
        label: 'Tag Input',
      },
      {
        name: 'color',
        type: 'color',
        label: 'Color Picker',
      },
      {
        name: 'date',
        type: 'date',
        label: 'Date Picker',
      },
      {
        name: 'daterange',
        type: 'daterange',
        label: 'Date Range Picker',
      },
    ];

    return (
      <div style={{ maxWidth: '800px' }}>
        <h3>All Field Types</h3>
        <FormBuilder
          fields={fields}
          layout="grid"
          columns={2}
          showResetButton
          onSubmit={action('form-submitted')}
        />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Grid layout form
 */
export const GridLayout: Story = {
  render: () => {
    const fields: FormFieldConfig[] = [
      {
        name: 'firstName',
        type: 'input',
        label: 'First Name',
        validation: { required: true },
      },
      {
        name: 'lastName',
        type: 'input',
        label: 'Last Name',
        validation: { required: true },
      },
      {
        name: 'email',
        type: 'input',
        label: 'Email',
        validation: { required: true },
        props: { type: 'email' },
      },
      {
        name: 'phone',
        type: 'phone',
        label: 'Phone',
      },
      {
        name: 'city',
        type: 'input',
        label: 'City',
      },
      {
        name: 'state',
        type: 'select',
        label: 'State',
        props: {
          options: [
            { value: '', label: 'Select state' },
            { value: 'ca', label: 'California' },
            { value: 'ny', label: 'New York' },
            { value: 'tx', label: 'Texas' },
          ],
        },
      },
    ];

    return (
      <div style={{ maxWidth: '800px' }}>
        <h3>Grid Layout (2 columns)</h3>
        <FormBuilder
          fields={fields}
          layout="grid"
          columns={2}
          gap={4}
          showResetButton
          onSubmit={action('form-submitted')}
        />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Form with validation
 */
export const WithValidation: Story = {
  render: () => {
    const fields: FormFieldConfig[] = [
      {
        name: 'username',
        type: 'input',
        label: 'Username',
        validation: {
          required: true,
          minLength: 3,
          maxLength: 20,
          pattern: /^[a-zA-Z0-9_]+$/,
          messages: {
            required: 'Username is required',
            minLength: 'Username must be at least 3 characters',
            maxLength: 'Username must be at most 20 characters',
            pattern: 'Username can only contain letters, numbers, and underscores',
          },
        },
        props: { placeholder: 'Enter username' },
      },
      {
        name: 'email',
        type: 'input',
        label: 'Email',
        validation: {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          messages: {
            required: 'Email is required',
            pattern: 'Please enter a valid email address',
          },
        },
        props: { type: 'email', placeholder: 'your@email.com' },
      },
      {
        name: 'password',
        type: 'input',
        label: 'Password',
        validation: {
          required: true,
          minLength: 8,
          pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
          messages: {
            required: 'Password is required',
            minLength: 'Password must be at least 8 characters',
            pattern: 'Password must contain at least one letter and one number',
          },
        },
        props: { type: 'password', placeholder: 'Create password' },
        helperText: 'Minimum 8 characters, at least 1 letter and 1 number',
      },
      {
        name: 'age',
        type: 'number',
        label: 'Age',
        validation: {
          required: true,
          min: 18,
          max: 120,
          messages: {
            required: 'Age is required',
            min: 'You must be at least 18 years old',
            max: 'Please enter a valid age',
          },
        },
        props: { min: 18, max: 120 },
      },
      {
        name: 'terms',
        type: 'checkbox',
        label: 'I agree to the terms and conditions',
        validation: {
          required: true,
          messages: {
            required: 'You must agree to the terms',
          },
        },
      },
    ];

    return (
      <div style={{ maxWidth: '600px' }}>
        <h3>Form with Validation</h3>
        <FormBuilder
          fields={fields}
          validateOn="blur"
          showResetButton
          onSubmit={(values) => {
            action('form-submitted')(values);
            alert('Form is valid! Check console.');
          }}
          onValidate={action('validation-errors')}
        />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Form with default values
 */
export const WithDefaultValues: Story = {
  render: () => {
    const fields: FormFieldConfig[] = [
      {
        name: 'name',
        type: 'input',
        label: 'Name',
      },
      {
        name: 'email',
        type: 'input',
        label: 'Email',
        props: { type: 'email' },
      },
      {
        name: 'role',
        type: 'select',
        label: 'Role',
        props: {
          options: [
            { value: 'user', label: 'User' },
            { value: 'admin', label: 'Admin' },
            { value: 'moderator', label: 'Moderator' },
          ],
        },
      },
      {
        name: 'notifications',
        type: 'toggle',
        label: 'Enable notifications',
      },
      {
        name: 'rating',
        type: 'rating',
        label: 'Rating',
      },
    ];

    const defaultValues = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      notifications: true,
      rating: 4,
    };

    return (
      <div style={{ maxWidth: '500px' }}>
        <h3>Form with Default Values</h3>
        <FormBuilder
          fields={fields}
          defaultValues={defaultValues}
          showResetButton
          onSubmit={action('form-submitted')}
        />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Form with onChange handler
 */
const WithOnChangeForm = () => {
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  const fields: FormFieldConfig[] = [
    {
      name: 'firstName',
      type: 'input',
      label: 'First Name',
      props: { placeholder: 'Enter first name' },
    },
    {
      name: 'lastName',
      type: 'input',
      label: 'Last Name',
      props: { placeholder: 'Enter last name' },
    },
    {
      name: 'email',
      type: 'input',
      label: 'Email',
      props: { type: 'email', placeholder: 'Enter email' },
    },
  ];

  return (
    <div style={{ maxWidth: '600px' }}>
      <h3>Form with Real-time Values</h3>
      <FormBuilder
        fields={fields}
        onChange={(values) => {
          action('form-changed')(values);
          setFormValues(values);
        }}
        onSubmit={action('form-submitted')}
      />
      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          background: 'var(--theme-background-primary)',
          borderRadius: '8px',
        }}
      >
        <h4>Current Form Values:</h4>
        <pre>{JSON.stringify(formValues, null, 2)}</pre>
      </div>
    </div>
  );
};

export const WithOnChange: Story = {
  render: () => <WithOnChangeForm />,
  parameters: { controls: { disable: true } },
};

/**
 * Disabled form
 */
export const Disabled: Story = {
  render: () => {
    const fields: FormFieldConfig[] = [
      {
        name: 'name',
        type: 'input',
        label: 'Name',
        props: { placeholder: 'Enter name' },
      },
      {
        name: 'email',
        type: 'input',
        label: 'Email',
        props: { type: 'email', placeholder: 'Enter email' },
      },
      {
        name: 'agree',
        type: 'checkbox',
        label: 'I agree',
      },
    ];

    return (
      <div style={{ maxWidth: '500px' }}>
        <FormBuilder
          fields={fields}
          disabled
          defaultValues={{ name: 'John Doe', email: 'john@example.com' }}
          onSubmit={action('form-submitted')}
        />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Loading state
 */
export const Loading: Story = {
  render: () => {
    const fields: FormFieldConfig[] = [
      {
        name: 'name',
        type: 'input',
        label: 'Name',
      },
      {
        name: 'email',
        type: 'input',
        label: 'Email',
        props: { type: 'email' },
      },
    ];

    return (
      <div style={{ maxWidth: '500px' }}>
        <FormBuilder
          fields={fields}
          loading
          defaultValues={{ name: 'John Doe', email: 'john@example.com' }}
          onSubmit={action('form-submitted')}
        />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Custom submit button
 */
export const CustomSubmitButton: Story = {
  render: () => {
    const fields: FormFieldConfig[] = [
      {
        name: 'email',
        type: 'input',
        label: 'Email',
        validation: { required: true },
        props: { type: 'email', placeholder: 'Enter email' },
      },
      {
        name: 'message',
        type: 'textarea',
        label: 'Message',
        validation: { required: true },
        props: { placeholder: 'Enter message', rows: 4 },
      },
    ];

    return (
      <div style={{ maxWidth: '500px' }}>
        <FormBuilder
          fields={fields}
          submitButtonText="Send"
          submitButtonVariant="success"
          showResetButton
          resetButtonText="Clear"
          onSubmit={(values) => {
            action('form-submitted')(values);
            alert('Form submitted!');
          }}
        />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Without buttons (headless mode)
 */
export const WithoutButtons: Story = {
  render: () => {
    const fields: FormFieldConfig[] = [
      {
        name: 'search',
        type: 'input',
        label: 'Search',
        props: { placeholder: 'Search...' },
      },
      {
        name: 'category',
        type: 'select',
        label: 'Category',
        props: {
          options: [
            { value: '', label: 'All' },
            { value: 'tech', label: 'Technology' },
            { value: 'design', label: 'Design' },
            { value: 'business', label: 'Business' },
          ],
        },
      },
    ];

    return (
      <div style={{ maxWidth: '500px' }}>
        <FormBuilder fields={fields} showSubmitButton={false} onChange={action('form-changed')} />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Async form submission
 */
const AsyncSubmissionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fields: FormFieldConfig[] = [
    {
      name: 'email',
      type: 'input',
      label: 'Email',
      validation: { required: true },
      props: { type: 'email', placeholder: 'Enter email' },
    },
    {
      name: 'password',
      type: 'input',
      label: 'Password',
      validation: { required: true },
      props: { type: 'password', placeholder: 'Enter password' },
    },
  ];

  const handleSubmit = async (values: Record<string, unknown>) => {
    setIsSubmitting(true);
    action('form-submitted')(values);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    action('form-submitted')({ status: 'success', data: values });

    alert('Login successful!');
    setIsSubmitting(false);
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <h3>Login Form (Async)</h3>
      <FormBuilder
        fields={fields}
        onSubmit={handleSubmit}
        submitButtonText="Sign In"
        loading={isSubmitting}
      />
    </div>
  );
};

export const AsyncSubmission: Story = {
  render: () => <AsyncSubmissionForm />,
  parameters: { controls: { disable: true } },
};

/**
 * Survey form example
 */
export const SurveyForm: Story = {
  render: () => {
    const fields: FormFieldConfig[] = [
      {
        name: 'name',
        type: 'input',
        label: 'Your Name',
        validation: { required: true },
      },
      {
        name: 'satisfaction',
        type: 'rating',
        label: 'Overall Satisfaction',
        helperText: 'Rate your experience from 1 to 5 stars',
      },
      {
        name: 'recommend',
        type: 'slider',
        label: 'Likelihood to Recommend',
        helperText: 'On a scale of 0-10, how likely are you to recommend us?',
        props: { min: 0, max: 10, step: 1, defaultValue: 5 },
      },
      {
        name: 'features',
        type: 'radio',
        label: 'Most Important Feature',
        props: {
          options: [
            { value: 'performance', label: 'Performance' },
            { value: 'design', label: 'Design' },
            { value: 'ease', label: 'Ease of Use' },
            { value: 'support', label: 'Customer Support' },
          ],
        },
      },
      {
        name: 'feedback',
        type: 'textarea',
        label: 'Additional Feedback',
        props: { placeholder: 'Tell us more about your experience...', rows: 4 },
      },
      {
        name: 'followup',
        type: 'checkbox',
        label: 'I would like to be contacted for a follow-up',
      },
    ];

    return (
      <div style={{ maxWidth: '700px' }}>
        <h3>Customer Satisfaction Survey</h3>
        <FormBuilder
          fields={fields}
          layout="vertical"
          submitButtonText="Submit Survey"
          submitButtonVariant="success"
          onSubmit={(values) => {
            action('form-submitted')(values);
            alert('Thank you for your feedback!');
          }}
        />
      </div>
    );
  },
  parameters: { controls: { disable: true } },
};

/**
 * Interactive playground
 */
export const Playground: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    layout: 'vertical',
    showSubmitButton: true,
    showResetButton: false,
    submitButtonText: 'Submit',
    resetButtonText: 'Reset',
    validateOn: 'blur',
    disabled: false,
    loading: false,
    columns: 2,
    gap: 4,
  },
  render: (args) => {
    const fields: FormFieldConfig[] = [
      {
        name: 'firstName',
        type: 'input',
        label: 'First Name',
        validation: { required: true },
      },
      {
        name: 'lastName',
        type: 'input',
        label: 'Last Name',
        validation: { required: true },
      },
      {
        name: 'email',
        type: 'input',
        label: 'Email',
        validation: { required: true },
        props: { type: 'email' },
      },
    ];

    return (
      <div style={{ maxWidth: '600px' }}>
        <FormBuilder
          {...args}
          fields={fields}
          onSubmit={action('form-submitted')}
          onChange={action('form-changed')}
          onValidate={action('validation-errors')}
        />
      </div>
    );
  },
};
