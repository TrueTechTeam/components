import {
  findBestPosition,
  calculatePopoverPosition,
  type PositionOptions,
  type PopoverSize,
} from './positioning';
import type { ElementBounds, ViewportSize } from './dom';

describe('positioning utilities', () => {
  // Standard test fixtures
  const createTriggerBounds = (overrides?: Partial<ElementBounds>): ElementBounds => ({
    top: 100,
    left: 100,
    right: 200,
    bottom: 150,
    width: 100,
    height: 50,
    ...overrides,
  });

  const createPopoverSize = (overrides?: Partial<PopoverSize>): PopoverSize => ({
    width: 200,
    height: 100,
    ...overrides,
  });

  const createViewportSize = (overrides?: Partial<ViewportSize>): ViewportSize => ({
    width: 1024,
    height: 768,
    ...overrides,
  });

  describe('findBestPosition', () => {
    describe('when preferred position fits without overflow', () => {
      it('should return the preferred position', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();

        const result = findBestPosition(triggerBounds, popoverSize, viewportSize, 'bottom', 8);

        expect(result).toBe('bottom');
      });

      it('should return top position when it fits', () => {
        const triggerBounds = createTriggerBounds({ top: 200, bottom: 250 });
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();

        const result = findBestPosition(triggerBounds, popoverSize, viewportSize, 'top', 8);

        expect(result).toBe('top');
      });
    });

    describe('when preferred position overflows', () => {
      it('should flip to opposite position if it has less overflow', () => {
        const triggerBounds = createTriggerBounds({ top: 10, bottom: 60 });
        const popoverSize = createPopoverSize({ height: 100 });
        const viewportSize = createViewportSize();

        const result = findBestPosition(triggerBounds, popoverSize, viewportSize, 'top', 8);

        expect(result).toBe('bottom');
      });

      it('should flip from bottom to top when bottom overflows', () => {
        const triggerBounds = createTriggerBounds({ top: 700, bottom: 750 });
        const popoverSize = createPopoverSize({ height: 100 });
        const viewportSize = createViewportSize();

        const result = findBestPosition(triggerBounds, popoverSize, viewportSize, 'bottom', 8);

        expect(result).toBe('top');
      });

      it('should flip from left to right when left overflows', () => {
        const triggerBounds = createTriggerBounds({ left: 50, right: 150 });
        const popoverSize = createPopoverSize({ width: 100 });
        const viewportSize = createViewportSize();

        const result = findBestPosition(triggerBounds, popoverSize, viewportSize, 'left', 8);

        expect(result).toBe('right');
      });

      it('should flip from right to left when right overflows', () => {
        const triggerBounds = createTriggerBounds({ left: 900, right: 1000 });
        const popoverSize = createPopoverSize({ width: 100 });
        const viewportSize = createViewportSize();

        const result = findBestPosition(triggerBounds, popoverSize, viewportSize, 'right', 8);

        expect(result).toBe('left');
      });
    });

    describe('when both preferred and opposite positions overflow', () => {
      it('should try adjacent positions and return the one with least overflow', () => {
        const triggerBounds = createTriggerBounds({ top: 10, bottom: 60, left: 10, right: 110 });
        const popoverSize = createPopoverSize({ width: 300, height: 150 });
        const viewportSize = createViewportSize({ width: 400, height: 200 });

        const result = findBestPosition(triggerBounds, popoverSize, viewportSize, 'top', 8);

        // Should find an adjacent position with less overflow
        expect(result).toBeTruthy();
        expect([
          'top',
          'bottom',
          'left',
          'right',
          'top-left',
          'top-right',
          'bottom-left',
          'bottom-right',
        ]).toContain(result);
      });

      it('should return position with no overflow when found in adjacent positions', () => {
        const triggerBounds = createTriggerBounds({ top: 400, bottom: 450, left: 500, right: 600 });
        const popoverSize = createPopoverSize({ width: 150, height: 80 });
        const viewportSize = createViewportSize();

        const result = findBestPosition(triggerBounds, popoverSize, viewportSize, 'top', 8);

        // Should find a position that fits
        expect(result).toBeTruthy();
      });
    });

    describe('with aligned positions', () => {
      it('should handle top-left position correctly', () => {
        const triggerBounds = createTriggerBounds({ top: 200, bottom: 250 });
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();

        const result = findBestPosition(triggerBounds, popoverSize, viewportSize, 'top-left', 8);

        expect(result).toBe('top-left');
      });

      it('should flip top-right to bottom-right when needed', () => {
        const triggerBounds = createTriggerBounds({ top: 10, bottom: 60 });
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();

        const result = findBestPosition(triggerBounds, popoverSize, viewportSize, 'top-right', 8);

        expect(result).toBe('bottom-right');
      });

      it('should flip bottom-left to top-left when needed', () => {
        const triggerBounds = createTriggerBounds({ top: 700, bottom: 750 });
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();

        const result = findBestPosition(triggerBounds, popoverSize, viewportSize, 'bottom-left', 8);

        expect(result).toBe('top-left');
      });

      it('should flip bottom-right to top-right when needed', () => {
        const triggerBounds = createTriggerBounds({ top: 700, bottom: 750 });
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();

        const result = findBestPosition(
          triggerBounds,
          popoverSize,
          viewportSize,
          'bottom-right',
          8
        );

        expect(result).toBe('top-right');
      });
    });

    describe('edge cases', () => {
      it('should handle very small viewport', () => {
        const triggerBounds = createTriggerBounds({ top: 50, bottom: 100 });
        const popoverSize = createPopoverSize({ width: 100, height: 50 });
        const viewportSize = createViewportSize({ width: 200, height: 200 });

        const result = findBestPosition(triggerBounds, popoverSize, viewportSize, 'bottom', 8);

        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
      });

      it('should handle popover larger than viewport', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize({ width: 2000, height: 1000 });
        const viewportSize = createViewportSize();

        const result = findBestPosition(triggerBounds, popoverSize, viewportSize, 'bottom', 8);

        // Should still return a valid position even if it overflows
        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
      });

      it('should handle zero offset', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();

        const result = findBestPosition(triggerBounds, popoverSize, viewportSize, 'bottom', 0);

        expect(result).toBe('bottom');
      });

      it('should handle large offset', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();

        const result = findBestPosition(triggerBounds, popoverSize, viewportSize, 'bottom', 50);

        expect(result).toBeTruthy();
      });
    });
  });

  describe('calculatePopoverPosition', () => {
    const createOptions = (overrides?: Partial<PositionOptions>): PositionOptions => ({
      preferredPosition: 'bottom',
      offset: 8,
      allowFlip: true,
      ...overrides,
    });

    describe('basic position calculation', () => {
      it('should calculate position for bottom placement', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'bottom' });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBe(triggerBounds.bottom + options.offset);
        expect(result.left).toBe(
          triggerBounds.left + triggerBounds.width / 2 - popoverSize.width / 2
        );
        expect(result.actualPosition).toBe('bottom');
      });

      it('should calculate position for top placement', () => {
        const triggerBounds = createTriggerBounds({ top: 200, bottom: 250 });
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'top' });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBe(triggerBounds.top - popoverSize.height - options.offset);
        expect(result.left).toBe(
          triggerBounds.left + triggerBounds.width / 2 - popoverSize.width / 2
        );
        expect(result.actualPosition).toBe('top');
      });

      it('should calculate position for left placement', () => {
        const triggerBounds = createTriggerBounds({ left: 300, right: 400 });
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'left' });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBe(triggerBounds.top);
        expect(result.left).toBe(triggerBounds.left - popoverSize.width - options.offset);
        expect(result.actualPosition).toBe('left');
      });

      it('should calculate position for right placement', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'right' });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBe(triggerBounds.top);
        expect(result.left).toBe(triggerBounds.right + options.offset);
        expect(result.actualPosition).toBe('right');
      });

      it('should calculate position for top-left placement', () => {
        const triggerBounds = createTriggerBounds({ top: 200, bottom: 250 });
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'top-left' });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBe(triggerBounds.top - popoverSize.height - options.offset);
        expect(result.left).toBe(triggerBounds.left);
        expect(result.actualPosition).toBe('top-left');
      });

      it('should calculate position for top-right placement', () => {
        const triggerBounds = createTriggerBounds({ top: 200, bottom: 250 });
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'top-right' });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBe(triggerBounds.top - popoverSize.height - options.offset);
        expect(result.left).toBe(triggerBounds.right - popoverSize.width);
        expect(result.actualPosition).toBe('top-right');
      });

      it('should calculate position for bottom-left placement', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'bottom-left' });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBe(triggerBounds.bottom + options.offset);
        expect(result.left).toBe(triggerBounds.left);
        expect(result.actualPosition).toBe('bottom-left');
      });

      it('should calculate position for bottom-right placement', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'bottom-right' });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBe(triggerBounds.bottom + options.offset);
        expect(result.left).toBe(triggerBounds.right - popoverSize.width);
        expect(result.actualPosition).toBe('bottom-right');
      });
    });

    describe('position flipping', () => {
      it('should flip position when allowFlip is true and preferred position overflows', () => {
        const triggerBounds = createTriggerBounds({ top: 10, bottom: 60 });
        const popoverSize = createPopoverSize({ height: 100 });
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'top', allowFlip: true });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.actualPosition).toBe('bottom');
        expect(result.actualPosition).not.toBe(options.preferredPosition);
      });

      it('should not flip position when allowFlip is false', () => {
        const triggerBounds = createTriggerBounds({ top: 10, bottom: 60 });
        const popoverSize = createPopoverSize({ height: 100 });
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'top', allowFlip: false });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.actualPosition).toBe('top');
        expect(result.actualPosition).toBe(options.preferredPosition);
      });
    });

    describe('width configuration', () => {
      it('should not set width when width option is undefined', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ width: undefined });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.width).toBeUndefined();
        expect(result.widthValue).toBeUndefined();
      });

      it('should not set width when width option is "auto"', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ width: 'auto' });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.width).toBeUndefined();
        expect(result.widthValue).toBeUndefined();
      });

      it('should match trigger width when width option is "trigger"', () => {
        const triggerBounds = createTriggerBounds({ width: 150 });
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ width: 'trigger' });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.width).toBe(150);
        expect(result.widthValue).toBe(150);
      });

      it('should set fit-content when width option is "content"', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ width: 'content' });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.width).toBeUndefined();
        expect(result.widthValue).toBe('fit-content');
      });

      it('should set max-content when width option is "max-content"', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ width: 'max-content' });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.width).toBeUndefined();
        expect(result.widthValue).toBe('max-content');
      });

      it('should use numeric width when width option is a number', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ width: 300 });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.width).toBe(300);
        expect(result.widthValue).toBe(300);
      });
    });

    describe('offset handling', () => {
      it('should apply offset to bottom position', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'bottom', offset: 16 });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBe(triggerBounds.bottom + 16);
      });

      it('should apply offset to top position', () => {
        const triggerBounds = createTriggerBounds({ top: 200, bottom: 250 });
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'top', offset: 16 });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBe(triggerBounds.top - popoverSize.height - 16);
      });

      it('should apply offset to left position', () => {
        const triggerBounds = createTriggerBounds({ left: 300, right: 400 });
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'left', offset: 16 });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.left).toBe(triggerBounds.left - popoverSize.width - 16);
      });

      it('should apply offset to right position', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'right', offset: 16 });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.left).toBe(triggerBounds.right + 16);
      });
    });

    describe('viewport boundary adjustments for left/right positions', () => {
      it('should adjust top position when right-positioned popover extends beyond bottom viewport', () => {
        const triggerBounds = createTriggerBounds({ top: 700, bottom: 750 });
        const popoverSize = createPopoverSize({ height: 150 });
        const viewportSize = createViewportSize({ height: 800 });
        const options = createOptions({ preferredPosition: 'right', allowFlip: false });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        // Top should be adjusted to fit within viewport
        expect(result.top).toBeLessThanOrEqual(viewportSize.height - popoverSize.height);
        expect(result.top).toBeGreaterThanOrEqual(0);
      });

      it('should adjust top position when left-positioned popover extends beyond bottom viewport', () => {
        const triggerBounds = createTriggerBounds({ top: 700, bottom: 750, left: 300, right: 400 });
        const popoverSize = createPopoverSize({ height: 150 });
        const viewportSize = createViewportSize({ height: 800 });
        const options = createOptions({ preferredPosition: 'left', allowFlip: false });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        // Top should be adjusted to fit within viewport
        expect(result.top).toBeLessThanOrEqual(viewportSize.height - popoverSize.height);
        expect(result.top).toBeGreaterThanOrEqual(0);
      });

      it('should keep top position when right-positioned popover fits in viewport', () => {
        const triggerBounds = createTriggerBounds({ top: 100, bottom: 150 });
        const popoverSize = createPopoverSize({ height: 100 });
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'right', allowFlip: false });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBe(triggerBounds.top);
      });

      it('should not push top above viewport when adjusting for bottom overflow', () => {
        const triggerBounds = createTriggerBounds({ top: 50, bottom: 100 });
        const popoverSize = createPopoverSize({ height: 300 });
        const viewportSize = createViewportSize({ height: 200 });
        const options = createOptions({ preferredPosition: 'right', allowFlip: false });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBeGreaterThanOrEqual(0);
      });
    });

    describe('edge cases', () => {
      it('should handle trigger at viewport top-left corner', () => {
        const triggerBounds = createTriggerBounds({ top: 0, left: 0, bottom: 50, right: 100 });
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'bottom' });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBeGreaterThanOrEqual(0);
        expect(result.actualPosition).toBeTruthy();
      });

      it('should handle trigger at viewport bottom-right corner', () => {
        const triggerBounds = createTriggerBounds({
          top: 700,
          left: 900,
          bottom: 750,
          right: 1000,
        });
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ preferredPosition: 'bottom', allowFlip: true });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.actualPosition).toBeTruthy();
      });

      it('should handle very small popover', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize({ width: 10, height: 10 });
        const viewportSize = createViewportSize();
        const options = createOptions();

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBeDefined();
        expect(result.left).toBeDefined();
        expect(result.actualPosition).toBe('bottom');
      });

      it('should handle very large popover', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize({ width: 2000, height: 1000 });
        const viewportSize = createViewportSize();
        const options = createOptions();

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBeDefined();
        expect(result.left).toBeDefined();
        expect(result.actualPosition).toBeTruthy();
      });

      it('should handle zero offset', () => {
        const triggerBounds = createTriggerBounds();
        const popoverSize = createPopoverSize();
        const viewportSize = createViewportSize();
        const options = createOptions({ offset: 0 });

        const result = calculatePopoverPosition(triggerBounds, popoverSize, viewportSize, options);

        expect(result.top).toBe(triggerBounds.bottom);
      });
    });
  });
});
