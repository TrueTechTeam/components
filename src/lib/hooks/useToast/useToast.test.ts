import { renderHook } from '@testing-library/react';
import { useToast } from './useToast';
import { useToastContextStrict } from '../../components/overlays/Toast';

jest.mock('../../components/overlays/Toast', () => ({
  useToastContextStrict: jest.fn(),
}));

const mockUseToastContextStrict = useToastContextStrict as jest.MockedFunction<
  typeof useToastContextStrict
>;

describe('useToast', () => {
  let mockContext: ReturnType<typeof useToastContextStrict>;

  beforeEach(() => {
    mockContext = {
      toasts: [],
      addToast: jest.fn().mockReturnValue('toast-id'),
      removeToast: jest.fn(),
      updateToast: jest.fn(),
      removeAllToasts: jest.fn(),
      pauseToast: jest.fn(),
      resumeToast: jest.fn(),
      success: jest.fn().mockReturnValue('toast-id'),
      error: jest.fn().mockReturnValue('toast-id'),
      warning: jest.fn().mockReturnValue('toast-id'),
      info: jest.fn().mockReturnValue('toast-id'),
      loading: jest.fn().mockReturnValue('toast-id'),
      promise: jest.fn(),
      position: 'top-right',
      maxVisible: 5,
    };
    mockUseToastContextStrict.mockReturnValue(mockContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns all toast methods', () => {
    const { result } = renderHook(() => useToast());
    expect(typeof result.current.success).toBe('function');
    expect(typeof result.current.error).toBe('function');
    expect(typeof result.current.warning).toBe('function');
    expect(typeof result.current.info).toBe('function');
    expect(typeof result.current.dismiss).toBe('function');
  });

  it('calls context methods when toast methods are called', () => {
    const { result } = renderHook(() => useToast());
    result.current.success({ message: 'Success!' });
    expect(mockContext.success).toHaveBeenCalled();
  });

  it('calls dismiss when dismiss is called', () => {
    const { result } = renderHook(() => useToast());
    result.current.dismiss('toast-id');
    expect(mockContext.removeToast).toHaveBeenCalledWith('toast-id');
  });
});
