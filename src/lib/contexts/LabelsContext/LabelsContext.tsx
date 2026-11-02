import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { DEFAULT_LABELS } from './defaultLabels';
import { resolveLocale } from '../../utils/format';

export type LabelVars = Record<string, string | number>;
export type LabelTranslator = (key: string, vars?: LabelVars) => string;
export type TranslateFn = (key: string, vars?: LabelVars) => string | undefined | null;

export interface LabelsProviderProps {
  /** Per-key text overrides (flat `component.key` to string). Merged over outer providers. */
  labels?: Partial<Record<string, string>>;
  /** App translate function. Called with `ui.<key>`; return nothing to fall back. */
  translate?: TranslateFn;
  /** BCP 47 locale (e.g. `fr-FR`) used for month and weekday names. Inherited from outer providers. */
  locale?: string;
  children: ReactNode;
}

interface LabelsContextValue {
  labels: Partial<Record<string, string>>;
  translate?: TranslateFn;
  locale?: string;
}

const LabelsContext = createContext<LabelsContextValue>({ labels: {} });

/** Replace `{name}` placeholders; unknown placeholders are left as-is. */
export function interpolate(template: string, vars?: LabelVars): string {
  if (!vars) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
  );
}

export function LabelsProvider({ labels, translate, locale, children }: LabelsProviderProps) {
  const parent = useContext(LabelsContext);
  const value = useMemo<LabelsContextValue>(
    () => ({
      labels: { ...parent.labels, ...labels },
      translate: translate ?? parent.translate,
      locale: locale ?? parent.locale,
    }),
    [parent, labels, translate, locale]
  );
  return <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>;
}

/**
 * Returns a `t(key, vars)` function. Resolution: app `translate('ui.' + key)`, then
 * `labels[key]`, then the English default, then the key. Works without a provider.
 */
export function useLabels(): (key: string, vars?: LabelVars) => string {
  const { labels, translate } = useContext(LabelsContext);
  return useMemo(
    () => (key: string, vars?: LabelVars) => {
      if (translate) {
        const prefixed = `ui.${key}`;
        const translated = translate(prefixed, vars);
        if (translated && translated !== prefixed) {
          return translated;
        }
      }
      const template = labels[key] ?? (DEFAULT_LABELS as Record<string, string>)[key] ?? key;
      return interpolate(template, vars);
    },
    [labels, translate]
  );
}

/** The nearest provider's locale, else the browser locale, else `en-US`. */
export function useLocale(): string {
  const { locale } = useContext(LabelsContext);
  return resolveLocale(locale);
}

/** English-only translator for helpers that run outside React (no provider available). */
export const translateDefault: LabelTranslator = (key, vars) =>
  interpolate((DEFAULT_LABELS as Record<string, string>)[key] ?? key, vars);
