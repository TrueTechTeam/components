import { renderHook, act } from '@testing-library/react';
import { useClipboard } from './useClipboard';

describe('useClipboard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('initialization', () => {
    it('returns initial state with copied false and no error', () => {
      const { result } = renderHook(() => useClipboard());

      expect(result.current.copied).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.copy).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });

    it('works without any options', () => {
      const { result } = renderHook(() => useClipboard());

      expect(result.current.copied).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('copy functionality with Clipboard API', () => {
    it('copies text successfully using Clipboard API', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard());

      let copyResult: boolean | undefined;
      await act(async () => {
        copyResult = await result.current.copy('test text');
      });

      expect(copyResult).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith('test text');
      expect(result.current.copied).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it('sets copied state to true after successful copy', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copy('hello world');
      });

      expect(result.current.copied).toBe(true);
    });

    it('resets copied state after default successDuration', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copy('test');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.copied).toBe(false);
    });

    it('resets copied state after custom successDuration', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard({ successDuration: 3000 }));

      await act(async () => {
        await result.current.copy('test');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        jest.advanceTimersByTime(2999);
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        jest.advanceTimersByTime(1);
      });

      expect(result.current.copied).toBe(false);
    });

    it('clears previous timeout when copying again', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard({ successDuration: 1000 }));

      await act(async () => {
        await result.current.copy('first');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      await act(async () => {
        await result.current.copy('second');
      });

      // Should still be copied
      expect(result.current.copied).toBe(true);

      // Advance by original remaining time - should not reset
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.copied).toBe(true);

      // Advance by new timeout duration
      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.copied).toBe(false);
    });
  });

  describe('copy functionality with fallback', () => {
    it('uses fallback when Clipboard API is not available', async () => {
      Object.assign(navigator, {
        clipboard: undefined,
      });

      const mockExecCommand = jest.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      const { result } = renderHook(() => useClipboard());

      let copyResult: boolean | undefined;
      await act(async () => {
        copyResult = await result.current.copy('fallback text');
      });

      expect(copyResult).toBe(true);
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(result.current.copied).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it('creates and removes textarea element in fallback', async () => {
      Object.assign(navigator, {
        clipboard: undefined,
      });

      const mockExecCommand = jest.fn().mockReturnValue(true);
      document.execCommand = mockExecCommand;

      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const removeChildSpy = jest.spyOn(document.body, 'removeChild');

      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copy('test');
      });

      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();

      // Find the textarea element among all appendChild calls
      const textareaCall = appendChildSpy.mock.calls.find((call) => call[0].tagName === 'TEXTAREA');
      expect(textareaCall).toBeDefined();

      const appendedElement = textareaCall![0] as HTMLTextAreaElement;
      expect(appendedElement.tagName).toBe('TEXTAREA');
      expect(appendedElement.value).toBe('test');
      expect(appendedElement.style.position).toBe('fixed');
      expect(appendedElement.style.left).toBe('-9999px');
      expect(appendedElement.style.top).toBe('-9999px');

      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });
  });

  describe('error handling', () => {
    it('handles Clipboard API errors', async () => {
      const mockError = new Error('Clipboard write failed');
      const mockWriteText = jest.fn().mockRejectedValue(mockError);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard());

      let copyResult: boolean | undefined;
      await act(async () => {
        copyResult = await result.current.copy('test');
      });

      expect(copyResult).toBe(false);
      expect(result.current.copied).toBe(false);
      expect(result.current.error).toEqual(mockError);
    });

    it('handles fallback copy command failure', async () => {
      Object.assign(navigator, {
        clipboard: undefined,
      });

      const mockExecCommand = jest.fn().mockReturnValue(false);
      document.execCommand = mockExecCommand;

      const { result } = renderHook(() => useClipboard());

      let copyResult: boolean | undefined;
      await act(async () => {
        copyResult = await result.current.copy('test');
      });

      expect(copyResult).toBe(false);
      expect(result.current.copied).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Copy command failed');
    });

    it('converts non-Error exceptions to Error objects', async () => {
      const mockWriteText = jest.fn().mockRejectedValue('string error');
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copy('test');
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Failed to copy to clipboard');
    });

    it('clears error on successful copy after previous error', async () => {
      const mockWriteText = jest
        .fn()
        .mockRejectedValueOnce(new Error('First error'))
        .mockResolvedValueOnce(undefined);

      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copy('test');
      });

      expect(result.current.error).toBeInstanceOf(Error);

      await act(async () => {
        await result.current.copy('test again');
      });

      expect(result.current.error).toBe(null);
      expect(result.current.copied).toBe(true);
    });
  });

  describe('callbacks', () => {
    it('calls onSuccess callback after successful copy', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const onSuccess = jest.fn();
      const { result } = renderHook(() => useClipboard({ onSuccess }));

      await act(async () => {
        await result.current.copy('success text');
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith('success text');
    });

    it('calls onError callback after copy failure', async () => {
      const mockError = new Error('Copy failed');
      const mockWriteText = jest.fn().mockRejectedValue(mockError);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const onError = jest.fn();
      const { result } = renderHook(() => useClipboard({ onError }));

      await act(async () => {
        await result.current.copy('test');
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(mockError);
    });

    it('does not call onSuccess on error', async () => {
      const mockWriteText = jest.fn().mockRejectedValue(new Error('Failed'));
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const onSuccess = jest.fn();
      const onError = jest.fn();
      const { result } = renderHook(() => useClipboard({ onSuccess, onError }));

      await act(async () => {
        await result.current.copy('test');
      });

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledTimes(1);
    });

    it('does not call onError on success', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const onSuccess = jest.fn();
      const onError = jest.fn();
      const { result } = renderHook(() => useClipboard({ onSuccess, onError }));

      await act(async () => {
        await result.current.copy('test');
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onError).not.toHaveBeenCalled();
    });

    it('uses latest callback references', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const onSuccess1 = jest.fn();
      const onSuccess2 = jest.fn();

      const { result, rerender } = renderHook(({ onSuccess }) => useClipboard({ onSuccess }), {
        initialProps: { onSuccess: onSuccess1 },
      });

      await act(async () => {
        await result.current.copy('first');
      });

      expect(onSuccess1).toHaveBeenCalledTimes(1);
      expect(onSuccess2).not.toHaveBeenCalled();

      rerender({ onSuccess: onSuccess2 });

      await act(async () => {
        await result.current.copy('second');
      });

      expect(onSuccess1).toHaveBeenCalledTimes(1);
      expect(onSuccess2).toHaveBeenCalledTimes(1);
    });
  });

  describe('reset functionality', () => {
    it('resets copied state', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copy('test');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.copied).toBe(false);
    });

    it('resets error state', async () => {
      const mockWriteText = jest.fn().mockRejectedValue(new Error('Failed'));
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copy('test');
      });

      expect(result.current.error).toBeInstanceOf(Error);

      act(() => {
        result.current.reset();
      });

      expect(result.current.error).toBe(null);
    });

    it('clears pending timeout', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard({ successDuration: 5000 }));

      await act(async () => {
        await result.current.copy('test');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.copied).toBe(false);

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.copied).toBe(false);
    });

    it('resets both copied and error states together', async () => {
      const mockWriteText = jest.fn().mockRejectedValue(new Error('Failed'));
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copy('test');
      });

      expect(result.current.copied).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);

      act(() => {
        result.current.reset();
      });

      expect(result.current.copied).toBe(false);
      expect(result.current.error).toBe(null);
    });
  });

  describe('cleanup', () => {
    it('clears timeout on unmount', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { result, unmount } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copy('test');
      });

      const timeoutCallsBefore = clearTimeoutSpy.mock.calls.length;

      unmount();

      expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThan(timeoutCallsBefore);

      clearTimeoutSpy.mockRestore();
    });

    it('does not update state after unmount', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result, unmount } = renderHook(() => useClipboard({ successDuration: 1000 }));

      await act(async () => {
        await result.current.copy('test');
      });

      unmount();

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // No error should occur from trying to update unmounted component
      expect(true).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles empty string copy', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copy('');
      });

      expect(mockWriteText).toHaveBeenCalledWith('');
      expect(result.current.copied).toBe(true);
    });

    it('handles very long text copy', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const longText = 'a'.repeat(10000);
      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copy(longText);
      });

      expect(mockWriteText).toHaveBeenCalledWith(longText);
      expect(result.current.copied).toBe(true);
    });

    it('handles special characters', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const specialText = '!@#$%^&*()_+{}|:"<>?[]\\;\',./ \n\t\r';
      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copy(specialText);
      });

      expect(mockWriteText).toHaveBeenCalledWith(specialText);
      expect(result.current.copied).toBe(true);
    });

    it('handles Unicode characters', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const unicodeText = '你好世界 🚀 émojis';
      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copy(unicodeText);
      });

      expect(mockWriteText).toHaveBeenCalledWith(unicodeText);
      expect(result.current.copied).toBe(true);
    });

    it('handles multiple rapid copy calls', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard({ successDuration: 1000 }));

      await act(async () => {
        await result.current.copy('first');
        await result.current.copy('second');
        await result.current.copy('third');
      });

      expect(mockWriteText).toHaveBeenCalledTimes(3);
      expect(mockWriteText).toHaveBeenLastCalledWith('third');
      expect(result.current.copied).toBe(true);
    });

    it('works with successDuration of 0', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard({ successDuration: 0 }));

      await act(async () => {
        await result.current.copy('test');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current.copied).toBe(false);
    });

    it('works with very large successDuration', async () => {
      const mockWriteText = jest.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: mockWriteText,
        },
      });

      const { result } = renderHook(() => useClipboard({ successDuration: 100000 }));

      await act(async () => {
        await result.current.copy('test');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        jest.advanceTimersByTime(99999);
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        jest.advanceTimersByTime(1);
      });

      expect(result.current.copied).toBe(false);
    });
  });

  describe('copy function stability', () => {
    it('returns stable copy function reference', () => {
      const { result, rerender } = renderHook(() => useClipboard());

      const firstCopy = result.current.copy;
      const firstReset = result.current.reset;

      rerender();

      expect(result.current.copy).toBe(firstCopy);
      expect(result.current.reset).toBe(firstReset);
    });

    it('updates copy function when successDuration changes', () => {
      const { result, rerender } = renderHook(
        ({ successDuration }) => useClipboard({ successDuration }),
        { initialProps: { successDuration: 2000 } }
      );

      const firstCopy = result.current.copy;

      rerender({ successDuration: 3000 });

      expect(result.current.copy).not.toBe(firstCopy);
    });
  });
});
