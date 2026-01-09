import {
  validators,
  combineValidators,
  validate,
  validateForm,
  isFormValid,
  getErrorMessages,
} from './validation';

describe('validators', () => {
  describe('required', () => {
    it('should return error for null, undefined, and empty string', () => {
      const validator = validators.required();
      expect(validator(null)).toBe('This field is required');
      expect(validator(undefined)).toBe('This field is required');
      expect(validator('')).toBe('This field is required');
      expect(validator('   ')).toBe('This field is required');
    });

    it('should return null for valid values', () => {
      const validator = validators.required();
      expect(validator('test')).toBeNull();
      expect(validator(0)).toBeNull();
      expect(validator(false)).toBeNull();
    });

    it('should use custom error message', () => {
      const validator = validators.required('Custom message');
      expect(validator('')).toBe('Custom message');
    });

    it('should validate arrays', () => {
      const validator = validators.required();
      expect(validator([])).toBe('This field is required');
      expect(validator(['item'])).toBeNull();
    });
  });

  describe('email', () => {
    it('should validate email format', () => {
      const validator = validators.email();
      expect(validator('test@example.com')).toBeNull();
      expect(validator('user.name@example.co.uk')).toBeNull();
      expect(validator('invalid')).toBe('Please enter a valid email address');
      expect(validator('invalid@')).toBe('Please enter a valid email address');
      expect(validator('@example.com')).toBe(
        'Please enter a valid email address'
      );
    });

    it('should return null for empty value', () => {
      const validator = validators.email();
      expect(validator('')).toBeNull();
    });
  });

  describe('minLength', () => {
    it('should validate minimum length', () => {
      const validator = validators.minLength(5);
      expect(validator('test')).toBe('Minimum 5 characters required');
      expect(validator('testing')).toBeNull();
    });

    it('should use custom error message', () => {
      const validator = validators.minLength(5, 'Too short');
      expect(validator('test')).toBe('Too short');
    });
  });

  describe('maxLength', () => {
    it('should validate maximum length', () => {
      const validator = validators.maxLength(5);
      expect(validator('testing')).toBe('Maximum 5 characters allowed');
      expect(validator('test')).toBeNull();
    });
  });

  describe('pattern', () => {
    it('should validate against regex pattern', () => {
      const validator = validators.pattern(/^\d+$/, 'Only numbers allowed');
      expect(validator('123')).toBeNull();
      expect(validator('abc')).toBe('Only numbers allowed');
    });
  });

  describe('min', () => {
    it('should validate minimum numeric value', () => {
      const validator = validators.min(10);
      expect(validator(5)).toBe('Value must be at least 10');
      expect(validator(10)).toBeNull();
      expect(validator(15)).toBeNull();
    });
  });

  describe('max', () => {
    it('should validate maximum numeric value', () => {
      const validator = validators.max(10);
      expect(validator(15)).toBe('Value must be at most 10');
      expect(validator(10)).toBeNull();
      expect(validator(5)).toBeNull();
    });
  });

  describe('range', () => {
    it('should validate numeric range', () => {
      const validator = validators.range(10, 20);
      expect(validator(5)).toBe('Value must be between 10 and 20');
      expect(validator(25)).toBe('Value must be between 10 and 20');
      expect(validator(15)).toBeNull();
    });
  });

  describe('url', () => {
    it('should validate URL format', () => {
      const validator = validators.url();
      expect(validator('https://example.com')).toBeNull();
      expect(validator('http://localhost:3000')).toBeNull();
      expect(validator('invalid')).toBe('Please enter a valid URL');
    });
  });

  describe('phone', () => {
    it('should validate phone number format', () => {
      const validator = validators.phone();
      expect(validator('123-456-7890')).toBeNull();
      expect(validator('(123) 456-7890')).toBeNull();
      expect(validator('+1 123 456 7890')).toBeNull();
      expect(validator('123')).toBe('Please enter a valid phone number');
    });
  });

  describe('matches', () => {
    it('should validate matching values', () => {
      const validator = validators.matches('password123');
      expect(validator('password123')).toBeNull();
      expect(validator('different')).toBe('Values do not match');
    });
  });

  describe('fileSize', () => {
    it('should validate file size', () => {
      const validator = validators.fileSize(1024 * 1024); // 1MB
      const smallFile = new File(['content'], 'test.txt', {
        type: 'text/plain',
      });
      const largeFile = new File([new ArrayBuffer(2 * 1024 * 1024)], 'large.txt', {
        type: 'text/plain',
      });

      expect(validator(smallFile)).toBeNull();
      expect(validator(largeFile)).toContain('File size must be less than');
    });
  });

  describe('fileType', () => {
    it('should validate file type by MIME type', () => {
      const validator = validators.fileType(['image/jpeg', 'image/png']);
      const jpegFile = new File(['content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      const pdfFile = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      });

      expect(validator(jpegFile)).toBeNull();
      expect(validator(pdfFile)).toContain('File type must be one of');
    });

    it('should validate file type by extension', () => {
      const validator = validators.fileType(['.jpg', '.png']);
      const jpegFile = new File(['content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      const pdfFile = new File(['content'], 'test.pdf', {
        type: 'application/pdf',
      });

      expect(validator(jpegFile)).toBeNull();
      expect(validator(pdfFile)).toContain('File type must be one of');
    });
  });
});

describe('combineValidators', () => {
  it('should combine multiple validators', () => {
    const validator = combineValidators(
      validators.required(),
      validators.minLength(5),
      validators.email()
    );

    expect(validator('')).toBe('This field is required');
    expect(validator('test')).toBe('Minimum 5 characters required');
    expect(validator('testing')).toBe('Please enter a valid email address');
    expect(validator('test@example.com')).toBeNull();
  });

  it('should return first error encountered', () => {
    const validator = combineValidators(
      validators.required(),
      validators.minLength(20) // This would also fail, but we never get here
    );

    expect(validator('')).toBe('This field is required');
  });
});

describe('validate', () => {
  it('should validate with single validator', () => {
    const result = validate('test@example.com', validators.email());
    expect(result).toEqual({ isValid: true, errorMessage: null });
  });

  it('should validate with array of validators', () => {
    const result = validate('test', [
      validators.required(),
      validators.minLength(5),
    ]);
    expect(result).toEqual({
      isValid: false,
      errorMessage: 'Minimum 5 characters required',
    });
  });
});

describe('validateForm', () => {
  it('should validate multiple fields', () => {
    const values = {
      email: 'test@example.com',
      password: '123',
      confirmPassword: '123',
    };

    const validatorConfig = {
      email: validators.email(),
      password: validators.minLength(8),
      confirmPassword: validators.matches('123'),
    };

    const results = validateForm(values, validatorConfig);

    expect(results.email.isValid).toBe(true);
    expect(results.password.isValid).toBe(false);
    expect(results.confirmPassword.isValid).toBe(true);
  });

  it('should handle array of validators per field', () => {
    const values = {
      username: '',
    };

    const validatorConfig = {
      username: [validators.required(), validators.minLength(3)],
    };

    const results = validateForm(values, validatorConfig);
    expect(results.username.isValid).toBe(false);
    expect(results.username.errorMessage).toBe('This field is required');
  });
});

describe('isFormValid', () => {
  it('should return true if all fields are valid', () => {
    const results = {
      field1: { isValid: true, errorMessage: null },
      field2: { isValid: true, errorMessage: null },
    };
    expect(isFormValid(results)).toBe(true);
  });

  it('should return false if any field is invalid', () => {
    const results = {
      field1: { isValid: true, errorMessage: null },
      field2: { isValid: false, errorMessage: 'Error' },
    };
    expect(isFormValid(results)).toBe(false);
  });
});

describe('getErrorMessages', () => {
  it('should extract error messages from results', () => {
    const results = {
      field1: { isValid: true, errorMessage: null },
      field2: { isValid: false, errorMessage: 'Error 1' },
      field3: { isValid: false, errorMessage: 'Error 2' },
    };

    const errors = getErrorMessages(results);
    expect(errors).toEqual({
      field2: 'Error 1',
      field3: 'Error 2',
    });
  });

  it('should return empty object if no errors', () => {
    const results = {
      field1: { isValid: true, errorMessage: null },
      field2: { isValid: true, errorMessage: null },
    };

    const errors = getErrorMessages(results);
    expect(errors).toEqual({});
  });
});
