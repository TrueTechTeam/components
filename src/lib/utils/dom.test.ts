import { getElementBounds, getViewportSize, getScrollPosition, isElementInViewport } from './dom';

describe('getElementBounds', () => {
  it('should return bounds for an element', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    // Mock getBoundingClientRect
    const mockRect = {
      top: 10,
      left: 20,
      right: 120,
      bottom: 80,
      width: 100,
      height: 70,
      x: 20,
      y: 10,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    const bounds = getElementBounds(element);

    expect(bounds).toEqual({
      top: 10,
      left: 20,
      right: 120,
      bottom: 80,
      width: 100,
      height: 70,
    });

    document.body.removeChild(element);
  });

  it('should return zero bounds for element with no dimensions', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const mockRect = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    const bounds = getElementBounds(element);

    expect(bounds).toEqual({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
    });

    document.body.removeChild(element);
  });

  it('should return negative bounds for element above viewport', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const mockRect = {
      top: -50,
      left: 10,
      right: 110,
      bottom: 50,
      width: 100,
      height: 100,
      x: 10,
      y: -50,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    const bounds = getElementBounds(element);

    expect(bounds.top).toBe(-50);
    expect(bounds.bottom).toBe(50);

    document.body.removeChild(element);
  });
});

describe('getViewportSize', () => {
  it('should return current viewport dimensions', () => {
    // Mock window.innerWidth and window.innerHeight
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const size = getViewportSize();

    expect(size).toEqual({
      width: 1024,
      height: 768,
    });
  });

  it('should return updated viewport dimensions after resize', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1080,
    });

    const size = getViewportSize();

    expect(size).toEqual({
      width: 1920,
      height: 1080,
    });
  });

  it('should handle mobile viewport dimensions', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    });

    const size = getViewportSize();

    expect(size).toEqual({
      width: 375,
      height: 667,
    });
  });
});

describe('getScrollPosition', () => {
  it('should return scroll position using pageXOffset and pageYOffset', () => {
    Object.defineProperty(window, 'pageXOffset', {
      writable: true,
      configurable: true,
      value: 100,
    });
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 200,
    });

    const position = getScrollPosition();

    expect(position).toEqual({
      x: 100,
      y: 200,
    });
  });

  it('should fallback to documentElement scrollLeft and scrollTop', () => {
    Object.defineProperty(window, 'pageXOffset', {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(document.documentElement, 'scrollLeft', {
      writable: true,
      configurable: true,
      value: 50,
    });
    Object.defineProperty(document.documentElement, 'scrollTop', {
      writable: true,
      configurable: true,
      value: 150,
    });

    const position = getScrollPosition();

    expect(position.x).toBe(50);
    expect(position.y).toBe(150);
  });

  it('should return zero when page is not scrolled', () => {
    Object.defineProperty(window, 'pageXOffset', {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(document.documentElement, 'scrollLeft', {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(document.documentElement, 'scrollTop', {
      writable: true,
      configurable: true,
      value: 0,
    });

    const position = getScrollPosition();

    expect(position).toEqual({
      x: 0,
      y: 0,
    });
  });
});

describe('isElementInViewport', () => {
  beforeEach(() => {
    // Reset viewport dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  it('should return true for element fully in viewport', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const mockRect = {
      top: 100,
      left: 100,
      right: 200,
      bottom: 200,
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    expect(isElementInViewport(element)).toBe(true);

    document.body.removeChild(element);
  });

  it('should return true for element partially in viewport (top edge visible)', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const mockRect = {
      top: -50,
      left: 100,
      right: 200,
      bottom: 50,
      width: 100,
      height: 100,
      x: 100,
      y: -50,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    expect(isElementInViewport(element)).toBe(true);

    document.body.removeChild(element);
  });

  it('should return true for element partially in viewport (bottom edge visible)', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const mockRect = {
      top: 700,
      left: 100,
      right: 200,
      bottom: 800,
      width: 100,
      height: 100,
      x: 100,
      y: 700,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    expect(isElementInViewport(element)).toBe(true);

    document.body.removeChild(element);
  });

  it('should return true for element partially in viewport (left edge visible)', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const mockRect = {
      top: 100,
      left: -50,
      right: 50,
      bottom: 200,
      width: 100,
      height: 100,
      x: -50,
      y: 100,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    expect(isElementInViewport(element)).toBe(true);

    document.body.removeChild(element);
  });

  it('should return true for element partially in viewport (right edge visible)', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const mockRect = {
      top: 100,
      left: 1000,
      right: 1100,
      bottom: 200,
      width: 100,
      height: 100,
      x: 1000,
      y: 100,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    expect(isElementInViewport(element)).toBe(true);

    document.body.removeChild(element);
  });

  it('should return false for element completely above viewport', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const mockRect = {
      top: -200,
      left: 100,
      right: 200,
      bottom: -100,
      width: 100,
      height: 100,
      x: 100,
      y: -200,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    expect(isElementInViewport(element)).toBe(false);

    document.body.removeChild(element);
  });

  it('should return false for element completely below viewport', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const mockRect = {
      top: 900,
      left: 100,
      right: 200,
      bottom: 1000,
      width: 100,
      height: 100,
      x: 100,
      y: 900,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    expect(isElementInViewport(element)).toBe(false);

    document.body.removeChild(element);
  });

  it('should return false for element completely to the left of viewport', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const mockRect = {
      top: 100,
      left: -200,
      right: -100,
      bottom: 200,
      width: 100,
      height: 100,
      x: -200,
      y: 100,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    expect(isElementInViewport(element)).toBe(false);

    document.body.removeChild(element);
  });

  it('should return false for element completely to the right of viewport', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const mockRect = {
      top: 100,
      left: 1100,
      right: 1200,
      bottom: 200,
      width: 100,
      height: 100,
      x: 1100,
      y: 100,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    expect(isElementInViewport(element)).toBe(false);

    document.body.removeChild(element);
  });

  it('should handle element at exact viewport boundaries (top-left corner)', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const mockRect = {
      top: 0,
      left: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    expect(isElementInViewport(element)).toBe(true);

    document.body.removeChild(element);
  });

  it('should handle element at exact viewport boundaries (bottom-right corner)', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const mockRect = {
      top: 668,
      left: 924,
      right: 1024,
      bottom: 768,
      width: 100,
      height: 100,
      x: 924,
      y: 668,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    expect(isElementInViewport(element)).toBe(true);

    document.body.removeChild(element);
  });

  it('should return false for zero-dimension element outside viewport', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const mockRect = {
      top: 1000,
      left: 1000,
      right: 1000,
      bottom: 1000,
      width: 0,
      height: 0,
      x: 1000,
      y: 1000,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    expect(isElementInViewport(element)).toBe(false);

    document.body.removeChild(element);
  });

  it('should work correctly with different viewport sizes', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    });

    const element = document.createElement('div');
    document.body.appendChild(element);

    const mockRect = {
      top: 100,
      left: 100,
      right: 200,
      bottom: 200,
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      toJSON: jest.fn(),
    };
    jest.spyOn(element, 'getBoundingClientRect').mockReturnValue(mockRect);

    expect(isElementInViewport(element)).toBe(true);

    document.body.removeChild(element);
  });
});
