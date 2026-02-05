import '@testing-library/jest-dom';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Provide a minimal ResizeObserver implementation for tests
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-ignore - assign to global for test env
global.ResizeObserver = global.ResizeObserver || MockResizeObserver;

// Provide a minimal canvas getContext implementation to avoid jsdom errors
if (!HTMLCanvasElement.prototype.getContext) {
  HTMLCanvasElement.prototype.getContext = jest.fn().mockImplementation(() => ({
    fillRect: jest.fn(),
    getImageData: jest.fn().mockReturnValue({ data: [] }),
    putImageData: jest.fn(),
    createLinearGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
    fill: jest.fn(),
    stroke: jest.fn(),
    clearRect: jest.fn(),
  }));
}

// Mock scrollIntoView for MenuItem component
Element.prototype.scrollIntoView = jest.fn();

// Provide a minimal IntersectionObserver implementation for tests
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

// @ts-ignore - assign to global for test env
global.IntersectionObserver = global.IntersectionObserver || (MockIntersectionObserver as any);
