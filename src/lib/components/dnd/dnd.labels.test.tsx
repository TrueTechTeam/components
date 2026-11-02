import React from 'react';
import { render, screen } from '@testing-library/react';
import { LabelsProvider } from '../../contexts/LabelsContext';
import { DragHandle } from './DragHandle';
import { KanbanBoard } from './KanbanBoard';
import { ResizablePanels, ResizablePanel, ResizeHandle } from './ResizablePanels';
import { SortableGrid } from './SortableGrid';
import { SortableList } from './SortableList';

const withLabels = (labels: Record<string, string>, ui: React.ReactElement) =>
  render(<LabelsProvider labels={labels}>{ui}</LabelsProvider>);

describe('dnd labels', () => {
  it('DragHandle translates its label and keeps an explicit one', () => {
    withLabels(
      { 'dragHandle.label': 'Poignée' },
      <>
        <DragHandle data-testid="a" />
        <DragHandle data-testid="b" label="Mine" />
      </>
    );
    expect(screen.getByTestId('a')).toHaveAttribute('aria-label', 'Poignée');
    expect(screen.getByTestId('b')).toHaveAttribute('aria-label', 'Mine');
  });

  it('KanbanBoard translates its default label', () => {
    withLabels(
      { 'kanbanBoard.label': 'Tableau' },
      <KanbanBoard columns={[{ id: 'c', title: 'C', items: [] }]} renderCard={() => null} />
    );
    expect(screen.getByLabelText('Tableau')).toBeInTheDocument();
  });

  it('ResizablePanels translates the container and handle labels', () => {
    withLabels(
      { 'resizablePanels.label': 'Panneaux', 'resizablePanels.handle': 'Poignée' },
      <ResizablePanels>
        <ResizablePanel>One</ResizablePanel>
        <ResizeHandle />
        <ResizablePanel>Two</ResizablePanel>
      </ResizablePanels>
    );
    expect(screen.getByLabelText('Panneaux')).toBeInTheDocument();
    expect(screen.getByLabelText('Poignée')).toBeInTheDocument();
  });

  it('SortableList and SortableGrid translate their default labels', () => {
    withLabels(
      { 'sortableList.label': 'Liste', 'sortableGrid.label': 'Grille' },
      <>
        <SortableList items={[{ id: '1' }]} renderItem={() => <span>x</span>} />
        <SortableGrid items={[{ id: '1' }]} renderItem={() => <span>y</span>} />
      </>
    );
    expect(screen.getByLabelText('Liste')).toBeInTheDocument();
    expect(screen.getByLabelText('Grille')).toBeInTheDocument();
  });

  it('KanbanBoard translates the empty column text', () => {
    withLabels(
      { 'kanbanColumn.empty': 'Déposez ici' },
      <KanbanBoard columns={[{ id: 'c', title: 'C', items: [] }]} renderCard={() => null} />
    );
    expect(screen.getByText('Déposez ici')).toBeInTheDocument();
  });
});
