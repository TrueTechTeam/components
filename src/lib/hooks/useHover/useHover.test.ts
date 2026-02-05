import { renderHook, act } from '@testing-library/react';
import { useHover } from './useHover';

describe('useHover', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('returns initial state with isHovered false', () => {
    const { result } = renderHook(() => useHover());

    expect(result.current.isHovered).toBe(false);
    expect(result.current.hoverProps).toBeDefined();
    expect(typeof result.current.hoverProps.onMouseEnter).toBe('function');
    expect(typeof result.current.hoverProps.onMouseLeave).toBe('function');
    expect(typeof result.current.hoverProps.onFocus).toBe('function');
    expect(typeof result.current.hoverProps.onBlur).toBe('function');
  });

  it('sets isHovered to true on mouse enter', () => {
    const { result } = renderHook(() => useHover());

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    expect(result.current.isHovered).toBe(true);
  });

  it('sets isHovered to false on mouse leave', () => {
    const { result } = renderHook(() => useHover());

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.hoverProps.onMouseLeave();
    });

    expect(result.current.isHovered).toBe(false);
  });

  it('sets isHovered to true on focus', () => {
    const { result } = renderHook(() => useHover());

    act(() => {
      result.current.hoverProps.onFocus();
    });

    expect(result.current.isHovered).toBe(true);
  });

  it('sets isHovered to false on blur', () => {
    const { result } = renderHook(() => useHover());

    act(() => {
      result.current.hoverProps.onFocus();
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.hoverProps.onBlur();
    });

    expect(result.current.isHovered).toBe(false);
  });

  it('calls onHoverStart callback when entering', () => {
    const onHoverStart = jest.fn();
    const { result } = renderHook(() => useHover({ onHoverStart }));

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    expect(onHoverStart).toHaveBeenCalledTimes(1);
    expect(result.current.isHovered).toBe(true);
  });

  it('calls onHoverEnd callback when leaving', () => {
    const onHoverEnd = jest.fn();
    const { result } = renderHook(() => useHover({ onHoverEnd }));

    act(() => {
      result.current.hoverProps.onMouseEnter();
      result.current.hoverProps.onMouseLeave();
    });

    expect(onHoverEnd).toHaveBeenCalledTimes(1);
    expect(result.current.isHovered).toBe(false);
  });

  it('delays hover start when delayEnter is set', () => {
    const onHoverStart = jest.fn();
    const { result } = renderHook(() => useHover({ delayEnter: 200, onHoverStart }));

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    expect(result.current.isHovered).toBe(false);
    expect(onHoverStart).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current.isHovered).toBe(true);
    expect(onHoverStart).toHaveBeenCalledTimes(1);
  });

  it('delays hover end when delayLeave is set', () => {
    const onHoverEnd = jest.fn();
    const { result } = renderHook(() => useHover({ delayLeave: 150, onHoverEnd }));

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.hoverProps.onMouseLeave();
    });

    expect(result.current.isHovered).toBe(true);
    expect(onHoverEnd).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(result.current.isHovered).toBe(false);
    expect(onHoverEnd).toHaveBeenCalledTimes(1);
  });

  it('cancels pending enter timeout when leaving before delay completes', () => {
    const onHoverStart = jest.fn();
    const { result } = renderHook(() => useHover({ delayEnter: 200, onHoverStart }));

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.isHovered).toBe(false);

    act(() => {
      result.current.hoverProps.onMouseLeave();
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current.isHovered).toBe(false);
    expect(onHoverStart).not.toHaveBeenCalled();
  });

  it('cancels pending leave timeout when entering again before delay completes', () => {
    const onHoverEnd = jest.fn();
    const { result } = renderHook(() => useHover({ delayLeave: 200, onHoverEnd }));

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.hoverProps.onMouseLeave();
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(result.current.isHovered).toBe(true);
    expect(onHoverEnd).not.toHaveBeenCalled();
  });

  it('does not trigger hover when disabled', () => {
    const onHoverStart = jest.fn();
    const onHoverEnd = jest.fn();
    const { result } = renderHook(() => useHover({ disabled: true, onHoverStart, onHoverEnd }));

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    expect(result.current.isHovered).toBe(false);
    expect(onHoverStart).not.toHaveBeenCalled();

    act(() => {
      result.current.hoverProps.onMouseLeave();
    });

    expect(result.current.isHovered).toBe(false);
    expect(onHoverEnd).not.toHaveBeenCalled();
  });

  it('does not trigger hover on focus when disabled', () => {
    const onHoverStart = jest.fn();
    const { result } = renderHook(() => useHover({ disabled: true, onHoverStart }));

    act(() => {
      result.current.hoverProps.onFocus();
    });

    expect(result.current.isHovered).toBe(false);
    expect(onHoverStart).not.toHaveBeenCalled();
  });

  it('does not trigger hover on blur when disabled', () => {
    const onHoverEnd = jest.fn();
    const { result } = renderHook(() => useHover({ disabled: true, onHoverEnd }));

    act(() => {
      result.current.hoverProps.onBlur();
    });

    expect(result.current.isHovered).toBe(false);
    expect(onHoverEnd).not.toHaveBeenCalled();
  });

  it('handles rapid enter/leave with delays correctly', () => {
    const onHoverStart = jest.fn();
    const onHoverEnd = jest.fn();
    const { result } = renderHook(() =>
      useHover({ delayEnter: 100, delayLeave: 100, onHoverStart, onHoverEnd })
    );

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    act(() => {
      jest.advanceTimersByTime(50);
    });

    act(() => {
      result.current.hoverProps.onMouseLeave();
    });

    act(() => {
      jest.advanceTimersByTime(50);
    });

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    expect(onHoverStart).not.toHaveBeenCalled();
    expect(onHoverEnd).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.isHovered).toBe(true);
    expect(onHoverStart).toHaveBeenCalledTimes(1);
    expect(onHoverEnd).not.toHaveBeenCalled();
  });

  it('works without any options', () => {
    const { result } = renderHook(() => useHover());

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.hoverProps.onMouseLeave();
    });

    expect(result.current.isHovered).toBe(false);
  });

  it('works with only delayEnter option', () => {
    const { result } = renderHook(() => useHover({ delayEnter: 100 }));

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    expect(result.current.isHovered).toBe(false);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.hoverProps.onMouseLeave();
    });

    expect(result.current.isHovered).toBe(false);
  });

  it('works with only delayLeave option', () => {
    const { result } = renderHook(() => useHover({ delayLeave: 100 }));

    act(() => {
      result.current.hoverProps.onMouseEnter();
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.hoverProps.onMouseLeave();
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.isHovered).toBe(false);
  });

  it('handles focus and blur with delays', () => {
    const { result } = renderHook(() => useHover({ delayEnter: 100, delayLeave: 100 }));

    act(() => {
      result.current.hoverProps.onFocus();
    });

    expect(result.current.isHovered).toBe(false);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.hoverProps.onBlur();
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.isHovered).toBe(false);
  });

  it('clears all timeouts when entering interrupts leaving', () => {
    const { result } = renderHook(() => useHover({ delayEnter: 50, delayLeave: 100 }));

    act(() => {
      result.current.hoverProps.onMouseEnter();
      jest.advanceTimersByTime(50);
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.hoverProps.onMouseLeave();
      jest.advanceTimersByTime(50);
    });

    expect(result.current.isHovered).toBe(true);

    act(() => {
      result.current.hoverProps.onMouseEnter();
      jest.advanceTimersByTime(150);
    });

    expect(result.current.isHovered).toBe(true);
  });

  it('provides new hoverProps object on each render with consistent handlers', () => {
    const { result, rerender } = renderHook(() => useHover());

    const firstPropsRef = result.current.hoverProps;
    const firstOnMouseEnter = result.current.hoverProps.onMouseEnter;
    const firstOnMouseLeave = result.current.hoverProps.onMouseLeave;

    rerender();

    const secondPropsRef = result.current.hoverProps;
    const secondOnMouseEnter = result.current.hoverProps.onMouseEnter;
    const secondOnMouseLeave = result.current.hoverProps.onMouseLeave;

    // Props object is new
    expect(firstPropsRef).not.toBe(secondPropsRef);

    // But handlers are stable due to useCallback
    expect(firstOnMouseEnter).toBe(secondOnMouseEnter);
    expect(firstOnMouseLeave).toBe(secondOnMouseLeave);
  });
});
