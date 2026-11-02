import React from 'react';
import { render, screen } from '@testing-library/react';
import { LabelsProvider } from '../../contexts/LabelsContext';
import {
  FilterProvider,
  FilterField,
  ActiveFilters,
  FilterBar,
  FilterAccordion,
  FilterModal,
  FilterPopover,
  FilterSidebar,
} from './index';
import type { FilterDefinition, FilterValue } from './types';

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];

const filters: FilterDefinition[] = [
  { id: 'status', type: 'select', label: 'Status', options },
  { id: 'name', type: 'text', label: 'Name' },
  { id: 'when', type: 'date', label: 'When' },
  {
    id: 'tags',
    type: 'multi-select',
    label: 'Tags',
    options,
    config: { displayMode: 'checkbox-group', showSelectAll: true },
  },
  { id: 'flag', type: 'checkbox', label: 'Flag' },
  { id: 'score', type: 'rating', label: 'Score' },
  {
    id: 'range',
    type: 'number-range',
    label: 'Range',
    config: { displayMode: 'inputs', showLabels: true, min: 0, max: 10 },
  },
  {
    id: 'pick',
    type: 'list-select',
    label: 'Pick',
    options,
    config: { searchable: true },
  },
];

const renderWith = (
  labels: Record<string, string>,
  ui: React.ReactNode,
  defaultValues?: Record<string, FilterValue>
) =>
  render(
    <LabelsProvider labels={labels}>
      <FilterProvider filters={filters} defaultValues={defaultValues}>
        {ui}
      </FilterProvider>
    </LabelsProvider>
  );

describe('filter labels', () => {
  it('SelectFilter translates its default placeholder', () => {
    renderWith(
      { 'filters.selectPlaceholder': 'Choisir {label}' },
      <FilterField filterId="status" />
    );
    expect(screen.getByText('Choisir Status')).toBeInTheDocument();
  });

  it('TextFilter translates its default placeholder', () => {
    renderWith({ 'filters.enterPlaceholder': 'Saisir {label}' }, <FilterField filterId="name" />);
    expect(screen.getByPlaceholderText('Saisir Name')).toBeInTheDocument();
  });

  it('DateFilter translates its default placeholder', () => {
    renderWith({ 'dateFilter.placeholder': 'Choisir une date' }, <FilterField filterId="when" />);
    expect(screen.getByPlaceholderText('Choisir une date')).toBeInTheDocument();
  });

  it('MultiSelectFilter translates select-all', () => {
    renderWith({ 'filters.selectAll': 'Tout' }, <FilterField filterId="tags" />);
    expect(screen.getByText('Tout')).toBeInTheDocument();
  });

  it('NumberRangeFilter translates min and max labels', () => {
    renderWith(
      { 'numberRangeFilter.min': 'Mini', 'numberRangeFilter.max': 'Maxi' },
      <FilterField filterId="range" />
    );
    expect(screen.getByText('Mini')).toBeInTheDocument();
    expect(screen.getByText('Maxi')).toBeInTheDocument();
  });

  it('ListSelectFilter translates the search placeholder', () => {
    renderWith({ 'filters.searchPlaceholder': 'Chercher' }, <FilterField filterId="pick" />);
    expect(screen.getByPlaceholderText('Chercher')).toBeInTheDocument();
  });

  it('ActiveFilters translates chips, remove label and clear all', () => {
    renderWith(
      {
        'activeFilters.removeFilter': 'Retirer le filtre {label}',
        'activeFilters.clearAll': 'Tout effacer',
        'filters.yes': 'Oui',
        'rating.stars': '{n} étoiles',
      },
      <ActiveFilters />,
      { status: 'a', flag: true, score: 4 }
    );
    expect(screen.getByLabelText('Retirer le filtre Status')).toBeInTheDocument();
    expect(screen.getByText('Flag: Oui')).toBeInTheDocument();
    expect(screen.getByText('Score: 4 étoiles')).toBeInTheDocument();
    expect(screen.getByText('Tout effacer')).toBeInTheDocument();
  });

  it('ActiveFilters translates the overflow and show-less buttons', async () => {
    renderWith({ 'truncatedList.more': '+{count} de plus' }, <ActiveFilters maxVisible={1} />, {
      status: 'a',
      flag: true,
      score: 4,
    });
    expect(screen.getByText('+2 de plus')).toBeInTheDocument();
  });

  it('ActiveFilters keeps English by default', () => {
    renderWith({}, <ActiveFilters />, { flag: true, score: 4 });
    expect(screen.getByText('Flag: Yes')).toBeInTheDocument();
    expect(screen.getByText('Score: 4 stars')).toBeInTheDocument();
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });

  it('layouts translate their button labels', () => {
    renderWith(
      { 'filters.reset': 'Réinitialiser' },
      <>
        <FilterBar showResetButton />
        <FilterAccordion showResetButton />
        <FilterSidebar showResetButton />
      </>
    );
    expect(screen.getAllByText('Réinitialiser')).toHaveLength(3);
  });

  it('FilterModal translates title, cancel and trigger', () => {
    renderWith(
      {
        'filters.title': 'Filtres',
        'filterModal.cancel': 'Annuler',
        'filterModal.apply': 'Appliquer',
      },
      <FilterModal defaultOpen />
    );
    expect(screen.getAllByText('Filtres').length).toBeGreaterThan(0);
    expect(screen.getByText('Annuler')).toBeInTheDocument();
    expect(screen.getByText('Appliquer')).toBeInTheDocument();
  });

  it('FilterModal keeps an explicit title', () => {
    renderWith({ 'filters.title': 'Filtres' }, <FilterModal defaultOpen title="Mine" />);
    expect(screen.getByRole('heading', { name: 'Mine' })).toBeInTheDocument();
  });

  it('FilterPopover translates its trigger label', () => {
    renderWith({ 'filters.title': 'Filtres' }, <FilterPopover />);
    expect(screen.getByText('Filtres')).toBeInTheDocument();
  });

  it('FilterSidebar translates the collapse button', () => {
    renderWith({ 'filterSidebar.collapse': 'Replier' }, <FilterSidebar collapsible />);
    expect(screen.getByLabelText('Replier')).toBeInTheDocument();
  });

  it('FilterBar translates the more-filters label', () => {
    renderWith(
      { 'filterBar.moreFilters': 'Plus de filtres' },
      <FilterBar visibleFilters={['status']} />
    );
    expect(screen.getByText('Plus de filtres')).toBeInTheDocument();
  });
});
