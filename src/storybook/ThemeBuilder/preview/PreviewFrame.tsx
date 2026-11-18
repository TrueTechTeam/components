import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ThemeConfig, ThemeMode } from '../../../lib/types/theme.types';
import { MSG_CONFIG, MSG_READY, PREVIEW_STORY_ID, type PreviewMessage } from './messages';

export interface PreviewFrameProps {
  config: ThemeConfig;
  mode: ThemeMode;
  title?: string;
  height?: number | string;
}

/**
 * Embeds the hidden preview story in an iframe and feeds it the in-progress theme.
 * The iframe keeps the theme's CSS variables, `data-theme` and portalled overlays out of
 * Storybook's own page.
 */
export function PreviewFrame({
  config,
  mode,
  title = 'Theme preview',
  height = '100%',
}: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  const post = useCallback(() => {
    const message: PreviewMessage = { type: MSG_CONFIG, config, mode };
    iframeRef.current?.contentWindow?.postMessage(message, window.location.origin);
  }, [config, mode]);
  const postRef = useRef(post);
  postRef.current = post;

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }
      if (!iframeRef.current || event.source !== iframeRef.current.contentWindow) {
        return;
      }
      if ((event.data as PreviewMessage | undefined)?.type !== MSG_READY) {
        return;
      }
      // Post on every ready (the preview announces again after a reload), not just the first.
      setReady(true);
      postRef.current();
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    if (ready) {
      post();
    }
  }, [ready, post]);

  return (
    <iframe
      ref={iframeRef}
      title={title}
      src={`iframe.html?id=${PREVIEW_STORY_ID}&viewMode=story`}
      style={{ width: '100%', height, border: 0, display: 'block' }}
    />
  );
}
