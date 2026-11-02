import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeBuilder } from '../ThemeBuilder';
import { INITIAL_STATE, STORAGE_KEY } from '../builderState';

function makeStorage(seed?: Record<string, string>): Storage {
  const map = new Map<string, string>(Object.entries(seed ?? {}));
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => void map.delete(k),
    setItem: (k: string, v: string) => void map.set(k, v),
  };
}

function renderEditor() {
  return render(
    <ThemeBuilder
      storage={makeStorage({
        [STORAGE_KEY]: JSON.stringify({ ...INITIAL_STATE, path: 'direct', step: 'editor' }),
      })}
    />
  );
}

const json = () => document.querySelector('pre')?.textContent ?? '';

describe('Theme Builder editor', () => {
  it('shows all four sections in order with Colors open', () => {
    renderEditor();
    const headers = ['Colors', 'Typography', 'Shape & spacing', 'Depth & density'].map((name) =>
      screen.getByRole('button', { name })
    );
    for (let i = 1; i < headers.length; i++) {
      expect(
        headers[i - 1].compareDocumentPosition(headers[i]) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy();
    }
    expect(headers[0]).toHaveAttribute('aria-expanded', 'true');
    expect(headers[1]).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles a section open', async () => {
    const user = userEvent.setup();
    renderEditor();
    const typography = screen.getByRole('button', { name: 'Typography' });
    await user.click(typography);
    expect(typography).toHaveAttribute('aria-expanded', 'true');
  });

  it('changing primary updates the exported JSON', async () => {
    const user = userEvent.setup();
    renderEditor();
    const input = screen.getByLabelText('Primary color');
    await user.clear(input);
    await user.type(input, '#2563eb');
    expect(json()).toContain('#2563eb');
  });

  it('invalid primary text shows an error and leaves the JSON unchanged', async () => {
    const user = userEvent.setup();
    renderEditor();
    const before = json();
    const input = screen.getByLabelText('Primary color');
    await user.clear(input);
    await user.type(input, 'not-a-color');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(json()).toBe(before);
  });

  it('override then Auto restores the generated value', async () => {
    const user = userEvent.setup();
    renderEditor();
    const before = json();
    await user.click(screen.getByRole('button', { name: 'Override textPrimary' }));
    const input = screen.getByLabelText('textPrimary override');
    await user.clear(input);
    await user.type(input, '#123456');
    expect(json()).toContain('#123456');
    expect(screen.getByText('edited')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Auto textPrimary' }));
    expect(json()).toBe(before);
    expect(screen.queryByText('edited')).not.toBeInTheDocument();
  });

  it('contrast report offers a fix that makes the pair pass', async () => {
    const user = userEvent.setup();
    renderEditor();
    const report = screen.getByRole('region', { name: 'Contrast report' });
    expect(within(report).getByText('All pairs pass AA')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Override textPrimary' }));
    const input = screen.getByLabelText('textPrimary override');
    await user.clear(input);
    await user.type(input, '#cccccc');
    expect(within(report).getByText(/pairs? fail/)).toBeInTheDocument();

    await user.click(within(report).getAllByRole('button', { name: /Apply fix/ })[0]);
    expect(within(report).getByText('All pairs pass AA')).toBeInTheDocument();
  });

  it('download creates a theme.json blob', async () => {
    const user = userEvent.setup();
    const createObjectURL = jest.fn(() => 'blob:theme');
    const revokeObjectURL = jest.fn();
    Object.assign(URL, { createObjectURL, revokeObjectURL });
    const downloads: string[] = [];
    const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement
    ) {
      downloads.push(this.download);
    });
    renderEditor();
    await user.click(screen.getByRole('button', { name: 'Download theme.json' }));
    expect(createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(downloads).toEqual(['theme.json']);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:theme');
    click.mockRestore();
  });

  it('copy JSON writes the JSON to the clipboard and confirms', async () => {
    const user = userEvent.setup();
    renderEditor();
    const spy = jest.spyOn(navigator.clipboard, 'writeText');
    await user.click(screen.getByRole('button', { name: 'Copy JSON' }));
    expect(spy).toHaveBeenCalledWith(json());
    expect(await screen.findByText('Copied')).toBeInTheDocument();
  });

  it('radius slider changes borderRadius.md in the JSON', async () => {
    const user = userEvent.setup();
    renderEditor();
    await user.click(screen.getByRole('button', { name: 'Shape & spacing' }));
    fireEvent.change(screen.getByLabelText('Corner radius'), { target: { value: '12' } });
    expect(json()).toContain('"md": "12px"');
  });

  it('depth controls update the JSON', async () => {
    const user = userEvent.setup();
    renderEditor();
    await user.click(screen.getByRole('button', { name: 'Depth & density' }));
    await user.click(screen.getByRole('radio', { name: 'flat' }));
    expect(json()).toContain('"sm": "none"');
    await user.click(screen.getByRole('radio', { name: 'dark' }));
    expect(json()).toContain('"mode": "dark"');
  });
});
