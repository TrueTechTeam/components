import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { PreviewFrame } from './PreviewFrame';
import { MSG_CONFIG, MSG_READY } from './messages';
import type { ThemeConfig } from '../../../lib/types/theme.types';

const A: ThemeConfig = { mode: 'light', theme: { colors: { primary: '#111111' } } };
const B: ThemeConfig = { mode: 'dark', theme: { colors: { primary: '#222222' } } };

const dispatchReady = (source: MessageEventSource | null) =>
  act(() => {
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: MSG_READY },
        source,
        origin: window.location.origin,
      })
    );
  });

describe('PreviewFrame', () => {
  it('posts the config to the iframe after it reports ready, and again on change', () => {
    const { container, rerender } = render(<PreviewFrame config={A} mode="light" />);
    const iframe = container.querySelector('iframe')!;
    const post = jest.spyOn(iframe.contentWindow!, 'postMessage');

    expect(post).not.toHaveBeenCalled();
    dispatchReady(iframe.contentWindow);
    expect(post).toHaveBeenLastCalledWith(
      { type: MSG_CONFIG, config: A, mode: 'light' },
      window.location.origin
    );

    rerender(<PreviewFrame config={B} mode="dark" />);
    expect(post).toHaveBeenLastCalledWith(
      { type: MSG_CONFIG, config: B, mode: 'dark' },
      window.location.origin
    );
  });

  it('ignores ready messages from other windows', () => {
    const { container } = render(<PreviewFrame config={A} mode="light" />);
    const post = jest.spyOn(container.querySelector('iframe')!.contentWindow!, 'postMessage');
    dispatchReady(window);
    expect(post).not.toHaveBeenCalled();
  });

  it('has an accessible title', () => {
    render(<PreviewFrame config={A} mode="light" />);
    expect(screen.getByTitle('Theme preview')).toBeInTheDocument();
  });
});
