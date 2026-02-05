import { renderHook, act } from '@testing-library/react';
import { useAlert } from './useAlert';
import { useAlertContextStrict } from '../../components/overlays/Alert';

jest.mock('../../components/overlays/Alert', () => ({
  useAlertContextStrict: jest.fn(),
}));

const mockUseAlertContextStrict = useAlertContextStrict as jest.MockedFunction<
  typeof useAlertContextStrict
>;

describe('useAlert', () => {
  let mockContext: ReturnType<typeof useAlertContextStrict>;

  beforeEach(() => {
    mockContext = {
      alert: jest.fn().mockResolvedValue(true),
      confirm: jest.fn().mockResolvedValue(true),
      error: jest.fn().mockResolvedValue(true),
      success: jest.fn().mockResolvedValue(true),
      warning: jest.fn().mockResolvedValue(true),
      info: jest.fn().mockResolvedValue(true),
      dismiss: jest.fn(),
      dismissAll: jest.fn(),
      alerts: [],
    };
    mockUseAlertContextStrict.mockReturnValue(mockContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns all alert methods', () => {
    const { result } = renderHook(() => useAlert());
    expect(typeof result.current.alert).toBe('function');
    expect(typeof result.current.confirm).toBe('function');
    expect(typeof result.current.error).toBe('function');
    expect(typeof result.current.success).toBe('function');
    expect(typeof result.current.dismiss).toBe('function');
  });

  it('calls context.alert when alert is called', async () => {
    const { result } = renderHook(() => useAlert());
    await act(async () => {
      await result.current.alert({ title: 'Test' });
    });
    expect(mockContext.alert).toHaveBeenCalledWith({ title: 'Test' });
  });

  it('calls context.confirm when confirm is called', async () => {
    const { result } = renderHook(() => useAlert());
    await act(async () => {
      await result.current.confirm({ title: 'Confirm?' });
    });
    expect(mockContext.confirm).toHaveBeenCalled();
    expect((mockContext.confirm as jest.Mock).mock.calls[0][0]).toEqual({ title: 'Confirm?' });
  });
});
