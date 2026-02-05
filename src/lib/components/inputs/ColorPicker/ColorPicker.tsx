import React, { forwardRef, useState, useCallback, useRef, useEffect, useId, useMemo } from 'react';
import type { BaseComponentProps } from '../../../types/component.types';
import { Button } from '../../buttons/Button';
import { Input } from '../Input';
import { Slider } from '../Slider';
import {
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hslToHex,
  parseColorToRgb,
  type RGB,
  type HSL,
} from '../../../utils/colorUtils';
import { Popover } from '../../overlays/Popover';
import styles from './ColorPicker.module.scss';

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export interface ColorPickerProps extends Omit<BaseComponentProps, 'children'> {
  /**
   * Controlled color value (hex format)
   */
  value?: string;

  /**
   * Default color value (hex format)
   */
  defaultValue?: string;

  /**
   * Callback when color changes
   */
  onChange?: (color: string) => void;

  /**
   * Callback when input loses focus
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;

  /**
   * Color format for display and output
   */
  format?: ColorFormat;

  /**
   * Show alpha channel slider
   */
  showAlpha?: boolean;

  /**
   * Show preset color palette
   */
  showPresets?: boolean;

  /**
   * Preset colors (hex format)
   */
  presetColors?: string[];

  /**
   * Show color input field
   */
  showInput?: boolean;

  /**
   * Show color swatch preview
   */
  showSwatch?: boolean;

  /**
   * Input label text
   */
  label?: string;

  /**
   * Helper text displayed below the input
   */
  helperText?: string;

  /**
   * Error message (shows when error is true)
   */
  errorMessage?: string;

  /**
   * Whether the input is in an error state
   */
  error?: boolean;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Whether the input is disabled
   */
  disabled?: boolean;
}

const DEFAULT_PRESETS = [
  '#FF0000',
  '#FF7F00',
  '#FFFF00',
  '#00FF00',
  '#0000FF',
  '#4B0082',
  '#9400D3',
  '#FFFFFF',
  '#CCCCCC',
  '#999999',
  '#666666',
  '#333333',
  '#000000',
];

/**
 * Parse a color string to RGB and HSL values with alpha
 */
const parseColor = (colorValue: string): { rgb: RGB; hsl: HSL; alpha: number } => {
  let alpha = 1;

  // Extract alpha from rgba/hsla/hex8
  const rgbaMatch = colorValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch && rgbaMatch[4]) {
    alpha = parseFloat(rgbaMatch[4]);
  }

  const hslaMatch = colorValue.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/);
  if (hslaMatch && hslaMatch[4]) {
    alpha = parseFloat(hslaMatch[4]);
  }

  // Extract alpha from 8-character hex (#RRGGBBAA)
  if (colorValue.startsWith('#') && colorValue.length === 9) {
    const alphaHex = colorValue.substring(7, 9);
    alpha = parseInt(alphaHex, 16) / 255;
  }

  const rgb = parseColorToRgb(colorValue) || { r: 255, g: 87, b: 51 };
  const hsl = rgbToHsl(rgb);
  return { rgb, hsl, alpha };
};

/**
 * ColorPicker component with HSL/RGB sliders and color canvas
 *
 * @example
 * ```tsx
 * <ColorPicker
 *   label="Choose Color"
 *   defaultValue="#FF5733"
 *   onChange={(color) => console.log(color)}
 * />
 * ```
 */
export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
  (
    {
      value: controlledValue,
      defaultValue = '#FF5733',
      onChange,
      onBlur,
      format = 'hex',
      showAlpha = false,
      showPresets = true,
      presetColors = DEFAULT_PRESETS,
      showInput = true,
      showSwatch = true,
      label,
      helperText,
      errorMessage,
      error = false,
      required = false,
      disabled = false,
      className,
      'data-testid': dataTestId,
      'aria-label': ariaLabel,
      style,
      ...rest
    },
    ref
  ) => {
    const id = useId();

    // Format color based on format prop
    const formatColor = useCallback(
      (rgb: RGB, hsl: HSL, alpha: number, targetFormat: ColorFormat): string => {
        if (showAlpha && alpha < 1) {
          switch (targetFormat) {
            case 'rgb':
              return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.toFixed(2)})`;
            case 'hsl':
              return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha.toFixed(2)})`;
            case 'hex':
            default: {
              // Convert alpha to hex (00-FF)
              const alphaHex = Math.round(alpha * 255)
                .toString(16)
                .padStart(2, '0')
                .toUpperCase();
              return `${rgbToHex(rgb)}${alphaHex}`;
            }
          }
        } else {
          switch (targetFormat) {
            case 'rgb':
              return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            case 'hsl':
              return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
            case 'hex':
            default:
              return rgbToHex(rgb);
          }
        }
      },
      [showAlpha]
    );

    const initialColor = parseColor(controlledValue || defaultValue);
    const initialFormattedValue = formatColor(
      initialColor.rgb,
      initialColor.hsl,
      initialColor.alpha,
      format
    );

    // State
    const [internalColor, setInternalColor] = useState(initialColor);
    const [inputValue, setInputValue] = useState(initialFormattedValue);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDraggingCanvas = useRef(false);

    // Get current color
    const currentColor = controlledValue ? parseColor(controlledValue) : internalColor;

    // Update input value when controlled value or format changes
    // Using useMemo to derive the formatted value and only update state when it changes
    const formattedControlledValue = useMemo(() => {
      if (controlledValue) {
        const color = parseColor(controlledValue);
        return formatColor(color.rgb, color.hsl, color.alpha, format);
      }
      return null;
    }, [controlledValue, format, formatColor]);

    useEffect(() => {
      if (formattedControlledValue !== null && inputValue !== formattedControlledValue) {
        // Use setTimeout to avoid synchronous setState in effect
        const timeoutId = setTimeout(() => {
          setInputValue(formattedControlledValue);
        }, 0);
        return () => clearTimeout(timeoutId);
      }
    }, [formattedControlledValue, inputValue]);

    // Update canvas when hue changes
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      const width = canvas.width;
      const height = canvas.height;

      // Create saturation gradient (left to right: white to pure hue)
      const satGradient = ctx.createLinearGradient(0, 0, width, 0);
      const hueColor = hslToRgb({ h: currentColor.hsl.h, s: 100, l: 50 });
      satGradient.addColorStop(0, 'white');
      satGradient.addColorStop(1, `rgb(${hueColor.r}, ${hueColor.g}, ${hueColor.b})`);

      ctx.fillStyle = satGradient;
      ctx.fillRect(0, 0, width, height);

      // Create lightness gradient (top to bottom: transparent to black)
      const lightGradient = ctx.createLinearGradient(0, 0, 0, height);
      lightGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      lightGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

      ctx.fillStyle = lightGradient;
      ctx.fillRect(0, 0, width, height);
    }, [currentColor.hsl.h, isPopoverOpen]);

    // Update color helper function
    const updateColor = useCallback(
      (hex: string, alpha?: number, preserveHsl?: HSL) => {
        const newColor = parseColor(hex);

        // Update alpha if provided
        if (alpha !== undefined) {
          newColor.alpha = alpha;
        }

        // Preserve HSL values when they would otherwise be lost
        if (preserveHsl) {
          const convertedHsl = rgbToHsl(newColor.rgb);

          // Preserve hue if saturation or lightness makes it meaningless
          if (convertedHsl.s === 0 || convertedHsl.l === 0 || convertedHsl.l === 100) {
            newColor.hsl.h = preserveHsl.h;
          }

          // Preserve saturation if lightness makes it meaningless
          if (convertedHsl.l === 0 || convertedHsl.l === 100) {
            newColor.hsl.s = preserveHsl.s;
          }
        }

        if (controlledValue === undefined) {
          setInternalColor(newColor);
        }

        const formattedValue = formatColor(newColor.rgb, newColor.hsl, newColor.alpha, format);
        setInputValue(formattedValue);
        onChange?.(formattedValue);
      },
      [controlledValue, onChange, format, formatColor]
    );

    // Handle canvas interaction
    const handleCanvasInteraction = useCallback(
      (clientX: number, clientY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) {
          return;
        }

        const rect = canvas.getBoundingClientRect();
        const rawX = clientX - rect.left;
        const rawY = clientY - rect.top;

        // Only clamp values that are actually out of bounds
        // This preserves the x position when dragging vertically outside the canvas
        // and preserves the y position when dragging horizontally outside the canvas
        const x = rawX < 0 ? 0 : rawX > rect.width ? rect.width : rawX;
        const y = rawY < 0 ? 0 : rawY > rect.height ? rect.height : rawY;

        const s = Math.round((x / rect.width) * 100);
        const l = Math.round(100 - (y / rect.height) * 100);

        const newHsl = { h: currentColor.hsl.h, s, l };
        const newRgb = hslToRgb(newHsl);
        const newHex = rgbToHex(newRgb);

        updateColor(newHex, currentColor.alpha, newHsl);
      },
      [currentColor.hsl.h, currentColor.alpha, updateColor]
    );

    // Canvas mouse handlers
    const handleCanvasMouseDown = useCallback(
      (e: React.MouseEvent) => {
        isDraggingCanvas.current = true;
        handleCanvasInteraction(e.clientX, e.clientY);
      },
      [handleCanvasInteraction]
    );

    const handleCanvasMouseMove = useCallback(
      (e: MouseEvent) => {
        if (isDraggingCanvas.current) {
          handleCanvasInteraction(e.clientX, e.clientY);
        }
      },
      [handleCanvasInteraction]
    );

    const handleCanvasMouseUp = useCallback(() => {
      isDraggingCanvas.current = false;
    }, []);

    // Attach global mouse listeners for dragging
    useEffect(() => {
      document.addEventListener('mousemove', handleCanvasMouseMove);
      document.addEventListener('mouseup', handleCanvasMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleCanvasMouseMove);
        document.removeEventListener('mouseup', handleCanvasMouseUp);
      };
    }, [handleCanvasMouseMove, handleCanvasMouseUp]);

    // Handle slider changes
    const handleHueChange = useCallback(
      (value: number | number[]) => {
        const h = typeof value === 'number' ? value : value[0];
        const newHsl = { ...currentColor.hsl, h };
        const newHex = hslToHex(newHsl);
        updateColor(newHex, currentColor.alpha, newHsl);
      },
      [currentColor.hsl, currentColor.alpha, updateColor]
    );

    const handleSaturationChange = useCallback(
      (value: number | number[]) => {
        const s = typeof value === 'number' ? value : value[0];
        const newHsl = { ...currentColor.hsl, s };
        const newHex = hslToHex(newHsl);
        updateColor(newHex, currentColor.alpha, newHsl);
      },
      [currentColor.hsl, currentColor.alpha, updateColor]
    );

    const handleLightnessChange = useCallback(
      (value: number | number[]) => {
        const l = typeof value === 'number' ? value : value[0];
        const newHsl = { ...currentColor.hsl, l };
        const newHex = hslToHex(newHsl);
        updateColor(newHex, currentColor.alpha, newHsl);
      },
      [currentColor.hsl, currentColor.alpha, updateColor]
    );

    const handleRedChange = useCallback(
      (value: number | number[]) => {
        const r = typeof value === 'number' ? value : value[0];
        const newRgb = { ...currentColor.rgb, r };
        const newHex = rgbToHex(newRgb);
        updateColor(newHex, currentColor.alpha, currentColor.hsl);
      },
      [currentColor.rgb, currentColor.alpha, currentColor.hsl, updateColor]
    );

    const handleGreenChange = useCallback(
      (value: number | number[]) => {
        const g = typeof value === 'number' ? value : value[0];
        const newRgb = { ...currentColor.rgb, g };
        const newHex = rgbToHex(newRgb);
        updateColor(newHex, currentColor.alpha, currentColor.hsl);
      },
      [currentColor.rgb, currentColor.alpha, currentColor.hsl, updateColor]
    );

    const handleBlueChange = useCallback(
      (value: number | number[]) => {
        const b = typeof value === 'number' ? value : value[0];
        const newRgb = { ...currentColor.rgb, b };
        const newHex = rgbToHex(newRgb);
        updateColor(newHex, currentColor.alpha, currentColor.hsl);
      },
      [currentColor.rgb, currentColor.alpha, currentColor.hsl, updateColor]
    );

    const handleAlphaChange = useCallback(
      (value: number | number[]) => {
        const alpha = (typeof value === 'number' ? value : value[0]) / 100;
        const hex = rgbToHex(currentColor.rgb);
        updateColor(hex, alpha, currentColor.hsl);
      },
      [currentColor.rgb, currentColor.hsl, updateColor]
    );

    // Handle input change
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        // Try to parse the color value (supports hex, rgb, hsl)
        const rgb = parseColorToRgb(value);
        if (rgb) {
          const hex = rgbToHex(rgb);
          updateColor(hex);
        }
      },
      [updateColor]
    );

    // Handle preset click
    const handlePresetClick = useCallback(
      (color: string) => {
        updateColor(color);
      },
      [updateColor]
    );

    // Container classes
    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

    // Display error message or helper text
    const displayHelperText = error && errorMessage ? errorMessage : helperText;

    // Get placeholder and maxLength based on format
    const getPlaceholderAndMaxLength = () => {
      if (showAlpha) {
        switch (format) {
          case 'rgb':
            return { placeholder: 'rgba(255, 87, 51, 0.8)', maxLength: 27 };
          case 'hsl':
            return { placeholder: 'hsla(12, 100%, 60%, 0.8)', maxLength: 29 };
          case 'hex':
          default:
            return { placeholder: '#FF5733CC', maxLength: 9 };
        }
      } else {
        switch (format) {
          case 'rgb':
            return { placeholder: 'rgb(255, 87, 51)', maxLength: 20 };
          case 'hsl':
            return { placeholder: 'hsl(12, 100%, 60%)', maxLength: 22 };
          case 'hex':
          default:
            return { placeholder: '#FF5733', maxLength: 7 };
        }
      }
    };

    const { placeholder: inputPlaceholder, maxLength: inputMaxLength } =
      getPlaceholderAndMaxLength();

    // Calculate canvas cursor position
    const canvasCursorX = (currentColor.hsl.s / 100) * 200; // Canvas width is 200px
    const canvasCursorY = (1 - currentColor.hsl.l / 100) * 150; // Canvas height is 150px

    return (
      <div className={containerClasses} style={style} data-testid={dataTestId}>
        {label && (
          <label className={styles.label} data-required={required || undefined} htmlFor={id}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
        )}

        <div className={styles.pickerContainer}>
          {/* Color swatch button with Popover */}
          {showSwatch && (
            <Popover
              isOpen={isPopoverOpen}
              onOpenChange={setIsPopoverOpen}
              trigger={
                <Button
                  variant="outline"
                  onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                  disabled={disabled}
                  aria-label="Open color picker"
                  type="button"
                  className={styles.swatchButton}
                >
                  <div
                    className={styles.swatch}
                    style={{
                      backgroundColor: `rgba(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b}, ${currentColor.alpha})`,
                    }}
                  />
                </Button>
              }
              position="bottom-left"
              offset={8}
              width="auto"
              closeOnClickOutside
              closeOnEscape
            >
              <div className={styles.pickerPanel}>
                {/* Color canvas */}
                <div className={styles.canvasWrapper}>
                  <canvas
                    ref={canvasRef}
                    className={styles.canvas}
                    width={200}
                    height={150}
                    onMouseDown={handleCanvasMouseDown}
                  />
                  <div
                    className={styles.canvasCursor}
                    style={{
                      left: `${canvasCursorX}px`,
                      top: `${canvasCursorY}px`,
                    }}
                  />
                </div>

                {/* HSL Sliders */}
                <div className={styles.sliderSection}>
                  <div className={styles.sliderLabel}>HSL</div>

                  <div className={styles.sliderRow}>
                    <label className={styles.sliderName}>H</label>
                    <Slider
                      min={0}
                      max={360}
                      value={currentColor.hsl.h}
                      onChange={handleHueChange}
                      disabled={disabled}
                      className={styles.slider}
                      data-type="hue"
                    />
                    <span className={styles.sliderValue}>{currentColor.hsl.h}°</span>
                  </div>

                  <div className={styles.sliderRow}>
                    <label className={styles.sliderName}>S</label>
                    <Slider
                      min={0}
                      max={100}
                      value={currentColor.hsl.s}
                      onChange={handleSaturationChange}
                      disabled={disabled}
                      className={styles.slider}
                    />
                    <span className={styles.sliderValue}>{currentColor.hsl.s}%</span>
                  </div>

                  <div className={styles.sliderRow}>
                    <label className={styles.sliderName}>L</label>
                    <Slider
                      min={0}
                      max={100}
                      value={currentColor.hsl.l}
                      onChange={handleLightnessChange}
                      disabled={disabled}
                      className={styles.slider}
                    />
                    <span className={styles.sliderValue}>{currentColor.hsl.l}%</span>
                  </div>
                </div>

                {/* RGB Sliders */}
                <div className={styles.sliderSection}>
                  <div className={styles.sliderLabel}>RGB</div>

                  <div className={styles.sliderRow}>
                    <label className={styles.sliderName}>R</label>
                    <Slider
                      min={0}
                      max={255}
                      value={currentColor.rgb.r}
                      onChange={handleRedChange}
                      disabled={disabled}
                      className={styles.slider}
                      data-type="red"
                    />
                    <span className={styles.sliderValue}>{currentColor.rgb.r}</span>
                  </div>

                  <div className={styles.sliderRow}>
                    <label className={styles.sliderName}>G</label>
                    <Slider
                      min={0}
                      max={255}
                      value={currentColor.rgb.g}
                      onChange={handleGreenChange}
                      disabled={disabled}
                      className={styles.slider}
                      data-type="green"
                    />
                    <span className={styles.sliderValue}>{currentColor.rgb.g}</span>
                  </div>

                  <div className={styles.sliderRow}>
                    <label className={styles.sliderName}>B</label>
                    <Slider
                      min={0}
                      max={255}
                      value={currentColor.rgb.b}
                      onChange={handleBlueChange}
                      disabled={disabled}
                      className={styles.slider}
                      data-type="blue"
                    />
                    <span className={styles.sliderValue}>{currentColor.rgb.b}</span>
                  </div>
                </div>

                {/* Alpha Slider */}
                {showAlpha && (
                  <div className={styles.sliderSection}>
                    <div className={styles.sliderLabel}>Alpha</div>

                    <div className={styles.sliderRow}>
                      <label className={styles.sliderName}>A</label>
                      <Slider
                        min={0}
                        max={100}
                        value={Math.round(currentColor.alpha * 100)}
                        onChange={handleAlphaChange}
                        disabled={disabled}
                        className={styles.slider}
                        data-type="alpha"
                      />
                      <span className={styles.sliderValue}>{currentColor.alpha.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Preset colors */}
                {showPresets && (
                  <div className={styles.presetsSection}>
                    <div className={styles.sliderLabel}>Presets</div>
                    <div className={styles.presets}>
                      {presetColors.map((color) => (
                        <Button
                          key={color}
                          variant="ghost"
                          onClick={() => handlePresetClick(color)}
                          disabled={disabled}
                          aria-label={`Select color ${color}`}
                          type="button"
                          className={styles.presetColor}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Popover>
          )}

          {/* Color input field */}
          {showInput && (
            <Input
              {...rest}
              ref={ref}
              id={id}
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e)}
              onBlur={onBlur}
              disabled={disabled}
              placeholder={inputPlaceholder}
              maxLength={inputMaxLength}
              showCounter={false}
              error={error}
              aria-label={ariaLabel || label || 'Color value'}
            />
          )}
        </div>

        {displayHelperText && (
          <div className={styles.helperText} data-error={error || undefined}>
            {displayHelperText}
          </div>
        )}
      </div>
    );
  }
);

ColorPicker.displayName = 'ColorPicker';
