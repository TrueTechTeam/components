import { renderHook, act } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

describe('useIntersectionObserver', () => {
  let mockIntersectionObserver: jest.Mock;
  let mockObserve: jest.Mock;
  let mockUnobserve: jest.Mock;
  let mockDisconnect: jest.Mock;
  let intersectionCallback: IntersectionObserverCallback;

  beforeEach(() => {
    mockObserve = jest.fn();
    mockUnobserve = jest.fn();
    mockDisconnect = jest.fn();

    mockIntersectionObserver = jest.fn((callback) => {
      intersectionCallback = callback;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      };
    });

    global.IntersectionObserver = mockIntersectionObserver as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns initial state with isIntersecting false', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBe(null);
    expect(result.current.element).toBe(null);
    expect(typeof result.current.ref).toBe('function');
  });

  it('returns initial state with custom initialIsIntersecting', () => {
    const { result } = renderHook(() => useIntersectionObserver({ initialIsIntersecting: true }));

    expect(result.current.isIntersecting).toBe(true);
    expect(result.current.entry).toBe(null);
    expect(result.current.element).toBe(null);
  });

  it('does not create observer when element is not set', () => {
    renderHook(() => useIntersectionObserver());

    expect(mockIntersectionObserver).not.toHaveBeenCalled();
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('creates observer and observes element when ref is set', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);
    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    });
    expect(mockObserve).toHaveBeenCalledWith(element);
    expect(result.current.element).toBe(element);
  });

  it('updates isIntersecting when element intersects', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    const mockEntry = {
      isIntersecting: true,
      target: element,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRatio: 1,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    } as IntersectionObserverEntry;

    act(() => {
      intersectionCallback([mockEntry], mockIntersectionObserver as any);
    });

    expect(result.current.isIntersecting).toBe(true);
    expect(result.current.entry).toBe(mockEntry);
  });

  it('updates isIntersecting to false when element stops intersecting', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    const intersectingEntry = {
      isIntersecting: true,
      target: element,
    } as IntersectionObserverEntry;

    act(() => {
      intersectionCallback([intersectingEntry], mockIntersectionObserver as any);
    });

    expect(result.current.isIntersecting).toBe(true);

    const notIntersectingEntry = {
      isIntersecting: false,
      target: element,
    } as IntersectionObserverEntry;

    act(() => {
      intersectionCallback([notIntersectingEntry], mockIntersectionObserver as any);
    });

    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBe(notIntersectingEntry);
  });

  it('calls onChange callback when intersection changes', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useIntersectionObserver({ onChange }));

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    const mockEntry = {
      isIntersecting: true,
      target: element,
    } as IntersectionObserverEntry;

    act(() => {
      intersectionCallback([mockEntry], mockIntersectionObserver as any);
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(mockEntry);
  });

  it('updates onChange callback reference without recreating observer', () => {
    const onChange1 = jest.fn();
    const onChange2 = jest.fn();
    const { result, rerender } = renderHook(
      ({ onChange }) => useIntersectionObserver({ onChange }),
      { initialProps: { onChange: onChange1 } }
    );

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    const mockEntry = {
      isIntersecting: true,
      target: element,
    } as IntersectionObserverEntry;

    act(() => {
      intersectionCallback([mockEntry], mockIntersectionObserver as any);
    });

    expect(onChange1).toHaveBeenCalledTimes(1);
    expect(onChange2).not.toHaveBeenCalled();

    rerender({ onChange: onChange2 });

    act(() => {
      intersectionCallback([mockEntry], mockIntersectionObserver as any);
    });

    expect(onChange1).toHaveBeenCalledTimes(1);
    expect(onChange2).toHaveBeenCalledTimes(1);
  });

  it('disconnects observer on unmount', () => {
    const { result, unmount } = renderHook(() => useIntersectionObserver());

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockDisconnect).not.toHaveBeenCalled();

    unmount();

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('disconnects and recreates observer when element changes', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    const element1 = document.createElement('div');

    act(() => {
      result.current.ref(element1);
    });

    expect(mockObserve).toHaveBeenCalledWith(element1);
    expect(mockDisconnect).not.toHaveBeenCalled();

    const element2 = document.createElement('div');

    act(() => {
      result.current.ref(element2);
    });

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
    expect(mockObserve).toHaveBeenCalledWith(element2);
  });

  it('passes custom root option to IntersectionObserver', () => {
    const root = document.createElement('div');
    const { result } = renderHook(() => useIntersectionObserver({ root }));

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      root,
      rootMargin: '0px',
      threshold: 0,
    });
  });

  it('passes custom rootMargin option to IntersectionObserver', () => {
    const { result } = renderHook(() => useIntersectionObserver({ rootMargin: '100px 50px' }));

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      root: null,
      rootMargin: '100px 50px',
      threshold: 0,
    });
  });

  it('passes custom threshold as number to IntersectionObserver', () => {
    const { result } = renderHook(() => useIntersectionObserver({ threshold: 0.5 }));

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    });
  });

  it('passes custom threshold as array to IntersectionObserver', () => {
    const thresholds = [0, 0.25, 0.5, 0.75, 1];
    const { result } = renderHook(() => useIntersectionObserver({ threshold: thresholds }));

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      root: null,
      rootMargin: '0px',
      threshold: thresholds,
    });
  });

  it('disconnects after first intersection when triggerOnce is true', () => {
    const { result } = renderHook(() => useIntersectionObserver({ triggerOnce: true }));

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    const mockEntry = {
      isIntersecting: true,
      target: element,
    } as IntersectionObserverEntry;

    act(() => {
      intersectionCallback([mockEntry], mockIntersectionObserver as any);
    });

    expect(result.current.isIntersecting).toBe(true);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('does not disconnect when triggerOnce is true but element is not intersecting', () => {
    const { result } = renderHook(() => useIntersectionObserver({ triggerOnce: true }));

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    const mockEntry = {
      isIntersecting: false,
      target: element,
    } as IntersectionObserverEntry;

    act(() => {
      intersectionCallback([mockEntry], mockIntersectionObserver as any);
    });

    expect(result.current.isIntersecting).toBe(false);
    expect(mockDisconnect).not.toHaveBeenCalled();
  });

  it('does not recreate observer after triggerOnce fires', () => {
    const { result, rerender } = renderHook(() => useIntersectionObserver({ triggerOnce: true }));

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    const mockEntry = {
      isIntersecting: true,
      target: element,
    } as IntersectionObserverEntry;

    act(() => {
      intersectionCallback([mockEntry], mockIntersectionObserver as any);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);

    rerender();

    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);
  });

  it('does not create observer when disabled is true', () => {
    const { result } = renderHook(() => useIntersectionObserver({ disabled: true }));

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockIntersectionObserver).not.toHaveBeenCalled();
    expect(mockObserve).not.toHaveBeenCalled();
  });

  it('creates observer when disabled changes from true to false', () => {
    const { result, rerender } = renderHook(
      ({ disabled }) => useIntersectionObserver({ disabled }),
      { initialProps: { disabled: true } }
    );

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockIntersectionObserver).not.toHaveBeenCalled();

    rerender({ disabled: false });

    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);
    expect(mockObserve).toHaveBeenCalledWith(element);
  });

  it('disconnects observer when disabled changes from false to true', () => {
    const { result, rerender } = renderHook(
      ({ disabled }) => useIntersectionObserver({ disabled }),
      { initialProps: { disabled: false } }
    );

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);
    expect(mockDisconnect).not.toHaveBeenCalled();

    rerender({ disabled: true });

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('recreates observer when root changes', () => {
    const root1 = document.createElement('div');
    const root2 = document.createElement('div');

    const { result, rerender } = renderHook(({ root }) => useIntersectionObserver({ root }), {
      initialProps: { root: root1 },
    });

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);
    expect(mockIntersectionObserver).toHaveBeenLastCalledWith(expect.any(Function), {
      root: root1,
      rootMargin: '0px',
      threshold: 0,
    });

    rerender({ root: root2 });

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(2);
    expect(mockIntersectionObserver).toHaveBeenLastCalledWith(expect.any(Function), {
      root: root2,
      rootMargin: '0px',
      threshold: 0,
    });
  });

  it('recreates observer when rootMargin changes', () => {
    const { result, rerender } = renderHook(
      ({ rootMargin }) => useIntersectionObserver({ rootMargin }),
      { initialProps: { rootMargin: '0px' } }
    );

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);

    rerender({ rootMargin: '100px' });

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(2);
    expect(mockIntersectionObserver).toHaveBeenLastCalledWith(expect.any(Function), {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });
  });

  it('recreates observer when threshold changes', () => {
    const { result, rerender } = renderHook(
      ({ threshold }) => useIntersectionObserver({ threshold }),
      { initialProps: { threshold: 0 } }
    );

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);

    rerender({ threshold: 0.5 });

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(2);
    expect(mockIntersectionObserver).toHaveBeenLastCalledWith(expect.any(Function), {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    });
  });

  it('recreates observer when threshold changes from number to array', () => {
    const { result, rerender } = renderHook(
      ({ threshold }) => useIntersectionObserver({ threshold }),
      { initialProps: { threshold: 0.5 as number | number[] } }
    );

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);

    const newThresholds = [0, 0.5, 1];
    rerender({ threshold: newThresholds });

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(2);
    expect(mockIntersectionObserver).toHaveBeenLastCalledWith(expect.any(Function), {
      root: null,
      rootMargin: '0px',
      threshold: newThresholds,
    });
  });

  it('recreates observer when triggerOnce changes', () => {
    const { result, rerender } = renderHook(
      ({ triggerOnce }) => useIntersectionObserver({ triggerOnce }),
      { initialProps: { triggerOnce: false } }
    );

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledTimes(1);

    rerender({ triggerOnce: true });

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
    expect(mockIntersectionObserver).toHaveBeenCalledTimes(2);
  });

  it('handles multiple intersection entries correctly', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    const entry1 = {
      isIntersecting: true,
      target: element,
      intersectionRatio: 0.5,
    } as IntersectionObserverEntry;

    const entry2 = {
      isIntersecting: false,
      target: element,
      intersectionRatio: 0,
    } as IntersectionObserverEntry;

    act(() => {
      intersectionCallback([entry1, entry2], mockIntersectionObserver as any);
    });

    expect(result.current.isIntersecting).toBe(true);
    expect(result.current.entry).toBe(entry1);
  });

  it('ignores empty entries array', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() => useIntersectionObserver({ onChange }));

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    act(() => {
      intersectionCallback([], mockIntersectionObserver as any);
    });

    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBe(null);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('handles null element ref gracefully', () => {
    const { result } = renderHook(() => useIntersectionObserver());

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockObserve).toHaveBeenCalledWith(element);

    act(() => {
      result.current.ref(null);
    });

    expect(result.current.element).toBe(null);
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('does not throw when IntersectionObserver is not available', () => {
    const originalIntersectionObserver = global.IntersectionObserver;
    // @ts-ignore - intentionally removing for test
    delete global.IntersectionObserver;

    const { result } = renderHook(() => useIntersectionObserver());

    const element = document.createElement('div');

    expect(() => {
      act(() => {
        result.current.ref(element);
      });
    }).not.toThrow();

    expect(result.current.isIntersecting).toBe(false);
    expect(result.current.entry).toBe(null);

    global.IntersectionObserver = originalIntersectionObserver;
  });

  it('tracks intersectionRatio from entry', () => {
    const { result } = renderHook(() => useIntersectionObserver({ threshold: [0, 0.5, 1] }));

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    const mockEntry = {
      isIntersecting: true,
      target: element,
      intersectionRatio: 0.75,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    } as IntersectionObserverEntry;

    act(() => {
      intersectionCallback([mockEntry], mockIntersectionObserver as any);
    });

    expect(result.current.entry?.intersectionRatio).toBe(0.75);
  });

  it('works with multiple threshold triggers', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useIntersectionObserver({ threshold: [0, 0.25, 0.5, 0.75, 1], onChange })
    );

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    const ratios = [0, 0.25, 0.5, 0.75, 1];

    ratios.forEach((ratio) => {
      const mockEntry = {
        isIntersecting: ratio > 0,
        target: element,
        intersectionRatio: ratio,
      } as IntersectionObserverEntry;

      act(() => {
        intersectionCallback([mockEntry], mockIntersectionObserver as any);
      });

      expect(result.current.entry?.intersectionRatio).toBe(ratio);
      expect(onChange).toHaveBeenCalledWith(mockEntry);
    });

    expect(onChange).toHaveBeenCalledTimes(ratios.length);
  });

  it('provides stable ref callback', () => {
    const { result, rerender } = renderHook(() => useIntersectionObserver());

    const firstRef = result.current.ref;

    rerender();

    const secondRef = result.current.ref;

    expect(firstRef).toBe(secondRef);
  });

  it('combines triggerOnce with custom threshold', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useIntersectionObserver({ triggerOnce: true, threshold: 0.5, onChange })
    );

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    });

    const mockEntry = {
      isIntersecting: true,
      target: element,
      intersectionRatio: 0.6,
    } as IntersectionObserverEntry;

    act(() => {
      intersectionCallback([mockEntry], mockIntersectionObserver as any);
    });

    expect(result.current.isIntersecting).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('combines triggerOnce with rootMargin', () => {
    const { result } = renderHook(() =>
      useIntersectionObserver({ triggerOnce: true, rootMargin: '100px' })
    );

    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(expect.any(Function), {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });

    const mockEntry = {
      isIntersecting: true,
      target: element,
    } as IntersectionObserverEntry;

    act(() => {
      intersectionCallback([mockEntry], mockIntersectionObserver as any);
    });

    expect(result.current.isIntersecting).toBe(true);
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
