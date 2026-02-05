import { renderHook, act } from '@testing-library/react';
import { useResizeObserver } from './useResizeObserver';

describe('useResizeObserver', () => {
  let mockResizeObserver: jest.Mock;
  let observeCallback: ((entries: ResizeObserverEntry[]) => void) | null = null;
  let observerInstance: {
    observe: jest.Mock;
    unobserve: jest.Mock;
    disconnect: jest.Mock;
  };

  beforeEach(() => {
    observerInstance = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };

    mockResizeObserver = jest.fn((callback) => {
      observeCallback = callback;
      return observerInstance;
    });

    global.ResizeObserver = mockResizeObserver as unknown as typeof ResizeObserver;
  });

  afterEach(() => {
    observeCallback = null;
  });

  const createMockEntry = (width: number, height: number): ResizeObserverEntry => ({
    target: document.createElement('div'),
    contentRect: {
      width,
      height,
      x: 0,
      y: 0,
      top: 0,
      right: width,
      bottom: height,
      left: 0,
      toJSON: () => ({}),
    },
    borderBoxSize: [{ inlineSize: width, blockSize: height }],
    contentBoxSize: [{ inlineSize: width - 20, blockSize: height - 20 }],
    devicePixelContentBoxSize: [{ inlineSize: width, blockSize: height }],
  });

  it('returns initial state with zero dimensions', () => {
    const { result } = renderHook(() => useResizeObserver());

    expect(result.current.width).toBe(0);
    expect(result.current.height).toBe(0);
    expect(result.current.element).toBe(null);
    expect(typeof result.current.ref).toBe('function');
  });

  it('tracks width and height changes', () => {
    const { result } = renderHook(() => useResizeObserver());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(result.current.element).toBe(element);

    act(() => {
      observeCallback?.([createMockEntry(200, 100)]);
    });

    expect(result.current.width).toBe(200);
    expect(result.current.height).toBe(100);
  });

  it('calls onResize callback when size changes', () => {
    const onResize = jest.fn();
    const { result } = renderHook(() => useResizeObserver({ onResize }));
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    const entry = createMockEntry(150, 75);

    act(() => {
      observeCallback?.([entry]);
    });

    expect(onResize).toHaveBeenCalledTimes(1);
    expect(onResize).toHaveBeenCalledWith(entry);
  });

  it('does not create observer when disabled', () => {
    const { result } = renderHook(() => useResizeObserver({ disabled: true }));
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    expect(mockResizeObserver).not.toHaveBeenCalled();
    expect(result.current.width).toBe(0);
    expect(result.current.height).toBe(0);
  });

  it('disconnects observer on unmount', () => {
    const { result, unmount } = renderHook(() => useResizeObserver());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    unmount();

    expect(observerInstance.disconnect).toHaveBeenCalled();
  });

  it('disconnects observer when element ref changes to null', () => {
    const { result } = renderHook(() => useResizeObserver());
    const element = document.createElement('div');

    act(() => {
      result.current.ref(element);
    });

    act(() => {
      result.current.ref(null);
    });

    expect(observerInstance.disconnect).toHaveBeenCalled();
    expect(result.current.element).toBe(null);
  });
});
