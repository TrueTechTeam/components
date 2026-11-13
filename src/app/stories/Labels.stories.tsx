import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PageMessages } from '../../lib/components/display/PageMessages';
import { Pagination } from '../../lib/components/navigation/Pagination';
import { AdaptiveGrid } from '../../lib/components/layout/AdaptiveGrid';
import { ActionRow, Code, DemoPanel, StoryApp, StoryFrame } from './storyHelpers';

// Every built-in key this demo renders, so nothing falls back to English.
const FRENCH: Record<string, string> = {
  'ui.pageMessages.error.title': 'Une erreur est survenue',
  'ui.pageMessages.error.description': "Une erreur inattendue s'est produite. Veuillez réessayer.",
  'ui.pageMessages.tryAgain': 'Réessayer',
  'ui.pageMessages.retry': 'Réessayer',
  'ui.pageMessages.empty.title': 'Aucune donnée',
  'ui.pageMessages.empty.description': "Il n'y a encore rien ici.",
  'ui.pagination.label': 'Pagination',
  'ui.pagination.first': 'Aller à la première page',
  'ui.pagination.previous': 'Aller à la page précédente',
  'ui.pagination.next': 'Aller à la page suivante',
  'ui.pagination.last': 'Aller à la dernière page',
  'ui.pagination.page': 'Page {n}',
};

// A real app passes i18n.t. Returning nothing makes the library fall back to its English default.
const translateFr = (key: string, vars?: Record<string, string | number>) => {
  const template = FRENCH[key];
  return template
    ? template.replace(/\{(\w+)\}/g, (m, name: string) => String(vars?.[name] ?? m))
    : undefined;
};

interface DemoProps {
  language: 'English' | 'French';
}

function Samples({ language }: DemoProps) {
  const [page, setPage] = useState(2);
  return (
    <StoryFrame
      title="Labels and translation"
      description={
        <>
          Built-in text comes from the app <Code>translate</Code> function (keys{' '}
          <Code>ui.&lt;key&gt;</Code>), then <Code>labels</Code> overrides, then English. Showing:{' '}
          {language}.
        </>
      }
    >
      <AdaptiveGrid minItemWidth={320} gap={16} justifyItems="stretch" fillMode="auto-fit">
        <DemoPanel title="Error state">
          <PageMessages error size="sm" onRetry={() => undefined} headingLevel={3} />
        </DemoPanel>
        <DemoPanel title="Empty state">
          <PageMessages empty size="sm" headingLevel={3} />
        </DemoPanel>
      </AdaptiveGrid>
      <DemoPanel
        title="Pagination"
        description="Button names (first, previous, page n, next, last) are translated too."
      >
        <ActionRow justify="center">
          <Pagination currentPage={page} totalPages={8} onPageChange={setPage} />
        </ActionRow>
      </DemoPanel>
    </StoryFrame>
  );
}

const meta: Meta<DemoProps> = {
  title: 'App Builder/Foundation/Labels & translation',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    globalDecorators: 'provider',
    docs: {
      description: {
        component: `
Every piece of built-in text resolves in this order: the app \`translate('ui.<key>')\`, then a
\`labels\` override, then the English default (\`DEFAULT_LABELS\`), then the key. Pass
\`translate={i18n.t}\` and \`locale\` to \`AppProvider\` (or \`GlobalProvider\` for core-only apps).
Return nothing for keys you have not translated. See \`guidelines/foundations/labels.md\`.
`,
      },
    },
  },
  argTypes: { language: { control: 'inline-radio', options: ['English', 'French'] } },
  args: { language: 'French' },
};
export default meta;

export const EnglishAndFrench: StoryObj<DemoProps> = {
  render: ({ language }) => (
    <StoryApp
      translate={language === 'French' ? translateFr : undefined}
      locale={language === 'French' ? 'fr-FR' : 'en-US'}
    >
      <Samples language={language} />
    </StoryApp>
  ),
};
