import { renderHook, act } from '@testing-library/react';
import { useDialog } from './useDialog';
import { useDialogContextStrict } from '../../components/overlays/Dialog';

// Mock the useDialogContextStrict hook
jest.mock('../../components/overlays/Dialog', () => ({
  useDialogContextStrict: jest.fn(),
}));

const mockUseDialogContextStrict = useDialogContextStrict as jest.MockedFunction<
  typeof useDialogContextStrict
>;

describe('useDialog', () => {
  let mockContext: any;

  beforeEach(() => {
    // Create a fresh mock context before each test
    mockContext = {
      dialogs: [],
      openDialog: jest.fn().mockImplementation(() => Promise.resolve()),
      closeDialog: jest.fn(),
      closeTopDialog: jest.fn(),
      closeAllDialogs: jest.fn(),
      updateDialog: jest.fn(),
      isDialogOpen: jest.fn().mockReturnValue(false),
      dialogCount: 0,
    };

    mockUseDialogContextStrict.mockReturnValue(mockContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('returns all dialog methods', () => {
      const { result } = renderHook(() => useDialog());

      expect(result.current).toHaveProperty('open');
      expect(result.current).toHaveProperty('update');
      expect(result.current).toHaveProperty('closeDialog');
      expect(result.current).toHaveProperty('closeTopDialog');
      expect(result.current).toHaveProperty('closeAllDialogs');
      expect(result.current).toHaveProperty('isDialogOpen');
      expect(result.current).toHaveProperty('dialogCount');
      expect(typeof result.current.open).toBe('function');
      expect(typeof result.current.update).toBe('function');
      expect(typeof result.current.closeDialog).toBe('function');
      expect(typeof result.current.closeTopDialog).toBe('function');
      expect(typeof result.current.closeAllDialogs).toBe('function');
      expect(typeof result.current.isDialogOpen).toBe('function');
    });

    it('calls useDialogContextStrict on initialization', () => {
      renderHook(() => useDialog());

      expect(mockUseDialogContextStrict).toHaveBeenCalledTimes(1);
    });

    it('works without options', () => {
      const { result } = renderHook(() => useDialog());

      expect(result.current).toBeDefined();
      expect(typeof result.current.open).toBe('function');
    });

    it('works with empty options object', () => {
      const { result } = renderHook(() => useDialog({}));

      expect(result.current).toBeDefined();
      expect(typeof result.current.open).toBe('function');
    });
  });

  describe('open method', () => {
    it('opens a dialog with props', async () => {
      const { result } = renderHook(() => useDialog());

      const dialogProps = {
        title: 'Test Dialog',
        children: 'Test content',
      };

      await act(async () => {
        await result.current.open(dialogProps);
      });

      expect(mockContext.openDialog).toHaveBeenCalledTimes(1);
      expect(mockContext.openDialog).toHaveBeenCalledWith(dialogProps);
    });

    it('returns a promise', async () => {
      const { result } = renderHook(() => useDialog());

      const promise = result.current.open({ title: 'Test' });

      expect(promise).toBeInstanceOf(Promise);
      await act(async () => {
        await promise;
      });
    });

    it('resolves promise with value when dialog closes', async () => {
      mockContext.openDialog.mockResolvedValue('result-value');
      const { result } = renderHook(() => useDialog());

      let promiseResult: any;
      await act(async () => {
        promiseResult = await result.current.open({ title: 'Test' });
      });

      expect(promiseResult).toBe('result-value');
    });

    it('resolves promise with typed result', async () => {
      mockContext.openDialog.mockResolvedValue(true);
      const { result } = renderHook(() => useDialog());

      let promiseResult: boolean | undefined;
      await act(async () => {
        promiseResult = await result.current.open<boolean>({ title: 'Confirm' });
      });

      expect(promiseResult).toBe(true);
    });

    it('opens dialog with complex props', async () => {
      const { result } = renderHook(() => useDialog());

      const complexProps = {
        title: 'Complex Dialog',
        children: 'Complex content',
        actions: 'Action button',
        size: 'lg' as const,
        closeOnBackdropClick: false,
        closeOnEscape: true,
      };

      await act(async () => {
        await result.current.open(complexProps);
      });

      expect(mockContext.openDialog).toHaveBeenCalledWith(complexProps);
    });
  });

  describe('default props', () => {
    it('opens a dialog with default props merged', async () => {
      const defaultProps = {
        size: 'md' as const,
        closeOnBackdropClick: false,
      };

      const { result } = renderHook(() => useDialog({ defaultProps }));

      await act(async () => {
        await result.current.open({ title: 'Test Dialog' });
      });

      expect(mockContext.openDialog).toHaveBeenCalledWith({
        size: 'md',
        closeOnBackdropClick: false,
        title: 'Test Dialog',
      });
    });

    it('allows dialog props to override default props', async () => {
      const defaultProps = {
        size: 'md' as const,
        closeOnBackdropClick: false,
      };

      const { result } = renderHook(() => useDialog({ defaultProps }));

      await act(async () => {
        await result.current.open({
          title: 'Test Dialog',
          size: 'lg',
        });
      });

      expect(mockContext.openDialog).toHaveBeenCalledWith({
        closeOnBackdropClick: false,
        title: 'Test Dialog',
        size: 'lg',
      });
    });

    it('merges default props with dialog-specific props', async () => {
      const defaultProps = {
        size: 'md' as const,
        closeOnBackdropClick: false,
      };

      const { result } = renderHook(() => useDialog({ defaultProps }));

      await act(async () => {
        await result.current.open({
          title: 'Test Dialog',
          closeOnEscape: true,
        });
      });

      expect(mockContext.openDialog).toHaveBeenCalledWith({
        size: 'md',
        closeOnBackdropClick: false,
        title: 'Test Dialog',
        closeOnEscape: true,
      });
    });

    it('works without default props', async () => {
      const { result } = renderHook(() => useDialog());

      await act(async () => {
        await result.current.open({ title: 'Test' });
      });

      expect(mockContext.openDialog).toHaveBeenCalledWith({ title: 'Test' });
    });

    it('works with empty default props object', async () => {
      const { result } = renderHook(() => useDialog({ defaultProps: {} }));

      await act(async () => {
        await result.current.open({ title: 'Test' });
      });

      expect(mockContext.openDialog).toHaveBeenCalledWith({ title: 'Test' });
    });

    it('handles undefined default props', async () => {
      const { result } = renderHook(() => useDialog({ defaultProps: undefined }));

      await act(async () => {
        await result.current.open({ title: 'Test' });
      });

      expect(mockContext.openDialog).toHaveBeenCalledWith({ title: 'Test' });
    });
  });

  describe('update method', () => {
    it('updates an open dialog props', () => {
      const { result } = renderHook(() => useDialog());

      act(() => {
        result.current.update('dialog-123', { title: 'Updated Title' });
      });

      expect(mockContext.updateDialog).toHaveBeenCalledTimes(1);
      expect(mockContext.updateDialog).toHaveBeenCalledWith('dialog-123', {
        title: 'Updated Title',
      });
    });

    it('updates dialog with multiple props', () => {
      const { result } = renderHook(() => useDialog());

      const updateProps = {
        title: 'New Title',
        children: 'New content',
        size: 'lg' as const,
      };

      act(() => {
        result.current.update('dialog-123', updateProps);
      });

      expect(mockContext.updateDialog).toHaveBeenCalledWith('dialog-123', updateProps);
    });

    it('exposes updateDialog directly from context', () => {
      const { result } = renderHook(() => useDialog());

      expect(result.current.update).toBe(mockContext.updateDialog);
    });
  });

  describe('closeDialog method', () => {
    it('closes a specific dialog by ID', () => {
      const { result } = renderHook(() => useDialog());

      act(() => {
        result.current.closeDialog('dialog-123');
      });

      expect(mockContext.closeDialog).toHaveBeenCalledTimes(1);
      expect(mockContext.closeDialog).toHaveBeenCalledWith('dialog-123');
    });

    it('closes dialog with result value', () => {
      const { result } = renderHook(() => useDialog());

      act(() => {
        result.current.closeDialog('dialog-123', 'result-value');
      });

      expect(mockContext.closeDialog).toHaveBeenCalledWith('dialog-123', 'result-value');
    });

    it('closes dialog with boolean result', () => {
      const { result } = renderHook(() => useDialog());

      act(() => {
        result.current.closeDialog('dialog-123', true);
      });

      expect(mockContext.closeDialog).toHaveBeenCalledWith('dialog-123', true);
    });

    it('exposes closeDialog directly from context', () => {
      const { result } = renderHook(() => useDialog());

      expect(result.current.closeDialog).toBe(mockContext.closeDialog);
    });
  });

  describe('closeTopDialog method', () => {
    it('closes the top dialog', () => {
      const { result } = renderHook(() => useDialog());

      act(() => {
        result.current.closeTopDialog();
      });

      expect(mockContext.closeTopDialog).toHaveBeenCalledTimes(1);
    });

    it('closes top dialog with result value', () => {
      const { result } = renderHook(() => useDialog());

      act(() => {
        result.current.closeTopDialog('result-value');
      });

      expect(mockContext.closeTopDialog).toHaveBeenCalledWith('result-value');
    });

    it('closes top dialog with boolean result', () => {
      const { result } = renderHook(() => useDialog());

      act(() => {
        result.current.closeTopDialog(false);
      });

      expect(mockContext.closeTopDialog).toHaveBeenCalledWith(false);
    });

    it('exposes closeTopDialog directly from context', () => {
      const { result } = renderHook(() => useDialog());

      expect(result.current.closeTopDialog).toBe(mockContext.closeTopDialog);
    });
  });

  describe('closeAllDialogs method', () => {
    it('closes all dialogs', () => {
      const { result } = renderHook(() => useDialog());

      act(() => {
        result.current.closeAllDialogs();
      });

      expect(mockContext.closeAllDialogs).toHaveBeenCalledTimes(1);
    });

    it('closes all dialogs without arguments', () => {
      const { result } = renderHook(() => useDialog());

      act(() => {
        result.current.closeAllDialogs();
      });

      expect(mockContext.closeAllDialogs).toHaveBeenCalledWith();
    });

    it('exposes closeAllDialogs directly from context', () => {
      const { result } = renderHook(() => useDialog());

      expect(result.current.closeAllDialogs).toBe(mockContext.closeAllDialogs);
    });
  });

  describe('isDialogOpen method', () => {
    it('checks if a dialog is open', () => {
      mockContext.isDialogOpen.mockReturnValue(true);
      const { result } = renderHook(() => useDialog());

      const isOpen = result.current.isDialogOpen('dialog-123');

      expect(mockContext.isDialogOpen).toHaveBeenCalledWith('dialog-123');
      expect(isOpen).toBe(true);
    });

    it('returns false when dialog is not open', () => {
      mockContext.isDialogOpen.mockReturnValue(false);
      const { result } = renderHook(() => useDialog());

      const isOpen = result.current.isDialogOpen('dialog-123');

      expect(isOpen).toBe(false);
    });

    it('checks multiple dialog IDs', () => {
      mockContext.isDialogOpen
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true);

      const { result } = renderHook(() => useDialog());

      expect(result.current.isDialogOpen('dialog-1')).toBe(true);
      expect(result.current.isDialogOpen('dialog-2')).toBe(false);
      expect(result.current.isDialogOpen('dialog-3')).toBe(true);

      expect(mockContext.isDialogOpen).toHaveBeenCalledTimes(3);
    });

    it('exposes isDialogOpen directly from context', () => {
      const { result } = renderHook(() => useDialog());

      expect(result.current.isDialogOpen).toBe(mockContext.isDialogOpen);
    });
  });

  describe('dialogCount property', () => {
    it('returns the count of open dialogs', () => {
      mockContext.dialogCount = 2;
      const { result } = renderHook(() => useDialog());

      expect(result.current.dialogCount).toBe(2);
    });

    it('returns zero when no dialogs are open', () => {
      mockContext.dialogCount = 0;
      const { result } = renderHook(() => useDialog());

      expect(result.current.dialogCount).toBe(0);
    });

    it('updates when dialog count changes', () => {
      mockContext.dialogCount = 1;
      const { result, rerender } = renderHook(() => useDialog());

      expect(result.current.dialogCount).toBe(1);

      mockContext.dialogCount = 3;
      rerender();

      expect(result.current.dialogCount).toBe(3);
    });
  });

  describe('promise resolution', () => {
    it('resolves promise when dialog closes', async () => {
      const resolveValue = { confirmed: true };
      mockContext.openDialog.mockResolvedValue(resolveValue);

      const { result } = renderHook(() => useDialog());

      let promiseResult: any;
      await act(async () => {
        promiseResult = await result.current.open({ title: 'Confirm' });
      });

      expect(promiseResult).toEqual(resolveValue);
    });

    it('handles multiple sequential dialog promises', async () => {
      mockContext.openDialog
        .mockResolvedValueOnce('first')
        .mockResolvedValueOnce('second')
        .mockResolvedValueOnce('third');

      const { result } = renderHook(() => useDialog());

      let result1: any, result2: any, result3: any;

      await act(async () => {
        result1 = await result.current.open({ title: 'First' });
        result2 = await result.current.open({ title: 'Second' });
        result3 = await result.current.open({ title: 'Third' });
      });

      expect(result1).toBe('first');
      expect(result2).toBe('second');
      expect(result3).toBe('third');
    });

    it('handles rejected promises', async () => {
      const error = new Error('Dialog error');
      mockContext.openDialog.mockRejectedValue(error);

      const { result } = renderHook(() => useDialog());

      await expect(
        act(async () => {
          await result.current.open({ title: 'Error Dialog' });
        })
      ).rejects.toThrow('Dialog error');
    });

    it('resolves with undefined when no result provided', async () => {
      mockContext.openDialog.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDialog());

      let promiseResult: any;
      await act(async () => {
        promiseResult = await result.current.open({ title: 'Test' });
      });

      expect(promiseResult).toBeUndefined();
    });

    it('resolves with null when null result provided', async () => {
      mockContext.openDialog.mockResolvedValue(null);

      const { result } = renderHook(() => useDialog());

      let promiseResult: any;
      await act(async () => {
        promiseResult = await result.current.open({ title: 'Test' });
      });

      expect(promiseResult).toBeNull();
    });
  });

  describe('error handling', () => {
    it('throws error when used outside DialogProvider', () => {
      mockUseDialogContextStrict.mockImplementation(() => {
        throw new Error('useDialogContextStrict must be used within a DialogProvider');
      });

      expect(() => {
        renderHook(() => useDialog());
      }).toThrow('useDialogContextStrict must be used within a DialogProvider');
    });
  });

  describe('callback stability', () => {
    it('maintains stable open function reference when defaultProps do not change', () => {
      const defaultProps = { size: 'md' as const };
      const { result, rerender } = renderHook(() => useDialog({ defaultProps }));

      const firstOpen = result.current.open;

      rerender();

      expect(result.current.open).toBe(firstOpen);
    });

    it('updates open function reference when defaultProps change', () => {
      const { result, rerender } = renderHook(({ defaultProps }) => useDialog({ defaultProps }), {
        initialProps: { defaultProps: { size: 'md' as const } },
      });

      const firstOpen = result.current.open;

      rerender({ defaultProps: { size: 'lg' as const } });

      expect(result.current.open).not.toBe(firstOpen);
    });

    it('updates open function reference when context changes', () => {
      const { result, rerender } = renderHook(() => useDialog());

      const firstOpen = result.current.open;

      // Change the mock context
      const newMockContext = { ...mockContext };
      mockUseDialogContextStrict.mockReturnValue(newMockContext);

      rerender();

      expect(result.current.open).not.toBe(firstOpen);
    });

    it('maintains stable references for direct context methods', () => {
      const { result, rerender } = renderHook(() => useDialog());

      const firstUpdate = result.current.update;
      const firstCloseDialog = result.current.closeDialog;
      const firstCloseTopDialog = result.current.closeTopDialog;
      const firstCloseAllDialogs = result.current.closeAllDialogs;
      const firstIsDialogOpen = result.current.isDialogOpen;

      rerender();

      expect(result.current.update).toBe(firstUpdate);
      expect(result.current.closeDialog).toBe(firstCloseDialog);
      expect(result.current.closeTopDialog).toBe(firstCloseTopDialog);
      expect(result.current.closeAllDialogs).toBe(firstCloseAllDialogs);
      expect(result.current.isDialogOpen).toBe(firstIsDialogOpen);
    });
  });

  describe('complex scenarios', () => {
    it('handles opening, updating, and closing a dialog', async () => {
      mockContext.openDialog.mockImplementation(() => Promise.resolve('result'));

      const { result } = renderHook(() => useDialog());

      let promiseResult: any;
      await act(async () => {
        const promise = result.current.open({ title: 'Test Dialog' });
        result.current.update('dialog-123', { title: 'Updated Title' });
        result.current.closeDialog('dialog-123', 'result');
        promiseResult = await promise;
      });

      expect(mockContext.openDialog).toHaveBeenCalled();
      expect(mockContext.updateDialog).toHaveBeenCalled();
      expect(mockContext.closeDialog).toHaveBeenCalled();
      expect(promiseResult).toBe('result');
    });

    it('handles multiple concurrent dialogs', async () => {
      mockContext.dialogCount = 3;
      mockContext.isDialogOpen.mockImplementation((id: string) => {
        return ['dialog-1', 'dialog-2', 'dialog-3'].includes(id);
      });

      const { result } = renderHook(() => useDialog());

      expect(result.current.dialogCount).toBe(3);
      expect(result.current.isDialogOpen('dialog-1')).toBe(true);
      expect(result.current.isDialogOpen('dialog-2')).toBe(true);
      expect(result.current.isDialogOpen('dialog-3')).toBe(true);
      expect(result.current.isDialogOpen('dialog-4')).toBe(false);
    });

    it('handles closing all dialogs after opening multiple', async () => {
      mockContext.openDialog.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDialog());

      await act(async () => {
        await result.current.open({ title: 'Dialog 1' });
        await result.current.open({ title: 'Dialog 2' });
        await result.current.open({ title: 'Dialog 3' });
      });

      act(() => {
        result.current.closeAllDialogs();
      });

      expect(mockContext.openDialog).toHaveBeenCalledTimes(3);
      expect(mockContext.closeAllDialogs).toHaveBeenCalledTimes(1);
    });

    it('applies default props to all opened dialogs', async () => {
      const defaultProps = {
        size: 'lg' as const,
        closeOnBackdropClick: false,
        closeOnEscape: true,
      };

      const { result } = renderHook(() => useDialog({ defaultProps }));

      await act(async () => {
        await result.current.open({ title: 'Dialog 1' });
        await result.current.open({ title: 'Dialog 2', size: 'sm' });
        await result.current.open({ title: 'Dialog 3', closeOnEscape: false });
      });

      expect(mockContext.openDialog).toHaveBeenNthCalledWith(1, {
        ...defaultProps,
        title: 'Dialog 1',
      });
      expect(mockContext.openDialog).toHaveBeenNthCalledWith(2, {
        ...defaultProps,
        title: 'Dialog 2',
        size: 'sm',
      });
      expect(mockContext.openDialog).toHaveBeenNthCalledWith(3, {
        ...defaultProps,
        title: 'Dialog 3',
        closeOnEscape: false,
      });
    });
  });

  describe('edge cases', () => {
    it('handles empty title', async () => {
      const { result } = renderHook(() => useDialog());

      await act(async () => {
        await result.current.open({ title: '' });
      });

      expect(mockContext.openDialog).toHaveBeenCalledWith({ title: '' });
    });

    it('handles dialog with only children', async () => {
      const { result } = renderHook(() => useDialog());

      await act(async () => {
        await result.current.open({ children: 'Content only' });
      });

      expect(mockContext.openDialog).toHaveBeenCalledWith({ children: 'Content only' });
    });

    it('handles complex children', async () => {
      const { result } = renderHook(() => useDialog());

      const complexChildren = { type: 'div', content: 'Complex nested content' };

      await act(async () => {
        await result.current.open({ children: complexChildren });
      });

      expect(mockContext.openDialog).toHaveBeenCalledWith({ children: complexChildren });
    });

    it('handles update with empty props object', () => {
      const { result } = renderHook(() => useDialog());

      act(() => {
        result.current.update('dialog-123', {});
      });

      expect(mockContext.updateDialog).toHaveBeenCalledWith('dialog-123', {});
    });

    it('handles closeDialog with empty string ID', () => {
      const { result } = renderHook(() => useDialog());

      act(() => {
        result.current.closeDialog('');
      });

      expect(mockContext.closeDialog).toHaveBeenCalledWith('');
    });

    it('handles isDialogOpen with empty string ID', () => {
      const { result } = renderHook(() => useDialog());

      result.current.isDialogOpen('');

      expect(mockContext.isDialogOpen).toHaveBeenCalledWith('');
    });
  });
});
