import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeBuilder } from './ThemeBuilder';
import { INITIAL_STATE, STORAGE_KEY } from './builderState';

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

describe('ThemeBuilder', () => {
  it('starts on the entry screen with both paths and load option', () => {
    render(<ThemeBuilder storage={makeStorage()} />);
    expect(screen.getByRole('heading', { name: 'Theme Builder' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Help me find my theme/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /I know my theme/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Load theme\.json/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start over/ })).toBeInTheDocument();
  });

  it('guided path walks mood → hue → palette → editor', async () => {
    const user = userEvent.setup();
    render(<ThemeBuilder storage={makeStorage()} />);
    await user.click(screen.getByRole('button', { name: /Help me find my theme/ }));

    const calm = screen.getByRole('button', { name: 'Calm' });
    await user.click(calm);
    expect(calm).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByLabelText('Hue')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Triadic' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Triadic' }));
    expect(screen.getByRole('radio', { name: 'Triadic' })).toHaveAttribute('aria-checked', 'true');
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getAllByTestId('palette-card')).toHaveLength(6);
    await user.click(screen.getByRole('button', { name: /Shuffle/ }));
    expect(screen.getAllByTestId('palette-card')).toHaveLength(6);
    await user.click(screen.getAllByTestId('palette-card')[0]);
    expect(screen.getByRole('button', { name: 'Colors' })).toBeInTheDocument();
  });

  it('Back returns to the previous guided step', async () => {
    const user = userEvent.setup();
    render(<ThemeBuilder storage={makeStorage()} />);
    await user.click(screen.getByRole('button', { name: /Help me find my theme/ }));
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await user.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByRole('button', { name: 'Calm' })).toBeInTheDocument();
  });

  it('direct path goes straight to the editor', async () => {
    const user = userEvent.setup();
    render(<ThemeBuilder storage={makeStorage()} />);
    await user.click(screen.getByRole('button', { name: /I know my theme/ }));
    expect(screen.getByRole('button', { name: 'Colors' })).toBeInTheDocument();
  });

  it('Start over asks for confirmation then returns to entry and clears storage', async () => {
    const user = userEvent.setup();
    const storage = makeStorage();
    render(<ThemeBuilder storage={storage} />);
    await user.click(screen.getByRole('button', { name: /I know my theme/ }));
    expect(storage.getItem(STORAGE_KEY)).not.toBeNull();

    await user.click(screen.getByRole('button', { name: /Start over/ }));
    expect(screen.getByText(/This clears your saved progress/)).toBeInTheDocument();
    const dialog = screen.getByTestId('dialog');
    await user.click(within(dialog).getByRole('button', { name: /Start over/ }));

    expect(screen.getByRole('button', { name: /Help me find my theme/ })).toBeInTheDocument();
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('Start over can be cancelled', async () => {
    const user = userEvent.setup();
    render(<ThemeBuilder storage={makeStorage()} />);
    await user.click(screen.getByRole('button', { name: /I know my theme/ }));
    await user.click(screen.getByRole('button', { name: /Start over/ }));
    await user.click(within(screen.getByTestId('dialog')).getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('button', { name: 'Colors' })).toBeInTheDocument();
  });

  it('restores progress from storage on mount', () => {
    const storage = makeStorage({
      [STORAGE_KEY]: JSON.stringify({ ...INITIAL_STATE, path: 'direct', step: 'editor' }),
    });
    render(<ThemeBuilder storage={storage} />);
    expect(screen.getByRole('button', { name: 'Colors' })).toBeInTheDocument();
  });

  it('shows import errors and stays on entry for a malformed file', async () => {
    const user = userEvent.setup();
    render(<ThemeBuilder storage={makeStorage()} />);
    const file = new File(['not json'], 'theme.json', { type: 'application/json' });
    await user.upload(screen.getByLabelText('Load theme.json file'), file);
    expect(await screen.findByRole('alert')).toHaveTextContent('File is not valid JSON');
    expect(screen.getByRole('button', { name: /Help me find my theme/ })).toBeInTheDocument();
  });

  it('imports a valid theme.json, opens the editor and shows dismissible warnings', async () => {
    const user = userEvent.setup();
    render(<ThemeBuilder storage={makeStorage()} />);
    const file = new File([JSON.stringify({ extra: 1, theme: {} })], 'theme.json');
    await user.upload(screen.getByLabelText('Load theme.json file'), file);
    expect(await screen.findByRole('button', { name: 'Colors' })).toBeInTheDocument();
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('extra is not a known theme.json key');
    await user.click(within(status).getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('reports a file that cannot be read', async () => {
    const user = userEvent.setup();
    const spy = jest.spyOn(FileReader.prototype, 'readAsText').mockImplementation(function (
      this: FileReader
    ) {
      setTimeout(() => this.onerror?.(new ProgressEvent('error') as ProgressEvent<FileReader>));
    });
    render(<ThemeBuilder storage={makeStorage()} />);
    await user.upload(
      screen.getByLabelText('Load theme.json file'),
      new File(['{}'], 'theme.json')
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not read the file.');
    spy.mockRestore();
  });
});
