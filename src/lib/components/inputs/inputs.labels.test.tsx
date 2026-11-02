import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LabelsProvider } from '../../contexts/LabelsContext';
import { GlobalProvider } from '../../providers/GlobalProvider';
import { getMonthName } from '../../utils/dateUtils';
import { Autocomplete } from './Autocomplete';
import { ColorPicker } from './ColorPicker';
import { DatePicker } from './DatePicker';
import { DateRangePicker } from './DateRangePicker';
import { FilePicker } from './FilePicker';
import { Input } from './Input';
import { NumberInput } from './NumberInput';
import { PhoneInput } from './PhoneInput';
import { Rating } from './Rating';
import { Select } from './Select';
import { TagInput } from './TagInput';
import { Textarea } from './Textarea';

const withLabels = (labels: Record<string, string>, ui: React.ReactElement) =>
  render(<LabelsProvider labels={labels}>{ui}</LabelsProvider>);

describe('input labels', () => {
  it('Autocomplete translates the no-options message and loading text', async () => {
    const { unmount } = withLabels(
      { 'autocomplete.noOptions': 'Rien' },
      <Autocomplete options={[{ value: 'a', label: 'Apple' }]} />
    );
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'zzz' } });
    await waitFor(() =>
      expect(screen.getByTestId('autocomplete-no-options')).toHaveTextContent('Rien')
    );
    unmount();

    withLabels({ 'autocomplete.loading': 'Chargement' }, <Autocomplete options={[]} loading />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a' } });
    await waitFor(() =>
      expect(screen.getByTestId('autocomplete-loading')).toHaveTextContent('Chargement')
    );
  });

  it('Autocomplete keeps an explicit empty noOptionsMessage', async () => {
    render(<Autocomplete options={[]} noOptionsMessage="" />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'zzz' } });
    await waitFor(() => expect(screen.getByTestId('autocomplete-no-options').textContent).toBe(''));
  });

  it('ColorPicker translates its aria-labels', () => {
    withLabels({ 'colorPicker.open': 'Ouvrir' }, <ColorPicker />);
    expect(screen.getByLabelText('Ouvrir')).toBeInTheDocument();
  });

  it('ColorPicker translates preset labels', async () => {
    const user = userEvent.setup();
    withLabels(
      { 'colorPicker.selectColor': 'Couleur {color}', 'colorPicker.presets': 'Prédéfinis' },
      <ColorPicker presetColors={['#FF0000']} />
    );
    await user.click(screen.getByRole('button'));
    expect(await screen.findByText('Prédéfinis')).toBeInTheDocument();
    expect(screen.getByLabelText('Couleur #FF0000')).toBeInTheDocument();
  });

  it('DatePicker translates navigation labels', async () => {
    const user = userEvent.setup();
    withLabels(
      { 'datePicker.previousMonth': 'Mois précédent', 'datePicker.nextMonth': 'Mois suivant' },
      <DatePicker />
    );
    await user.click(screen.getByRole('textbox'));
    expect(await screen.findByLabelText('Mois précédent')).toBeInTheDocument();
    expect(screen.getByLabelText('Mois suivant')).toBeInTheDocument();
  });

  it('DatePicker shows English month and weekday names by default', async () => {
    const user = userEvent.setup();
    render(
      <LabelsProvider locale="en-US">
        <DatePicker defaultValue={new Date(2024, 0, 15)} />
      </LabelsProvider>
    );
    await user.click(screen.getByRole('textbox'));
    expect(await screen.findByText('Jan')).toBeInTheDocument();
    for (const day of ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']) {
      expect(screen.getByText(day)).toBeInTheDocument();
    }
  });

  it('DatePicker renders month names in the GlobalProvider locale', async () => {
    const user = userEvent.setup();
    render(
      <GlobalProvider locale="fr-FR">
        <DatePicker defaultValue={new Date(2024, 0, 15)} />
      </GlobalProvider>
    );
    await user.click(screen.getByRole('textbox'));
    expect(await screen.findByText('janvier')).toBeInTheDocument();
  });

  it('DateRangePicker translates presets and month names', async () => {
    const user = userEvent.setup();
    render(
      <LabelsProvider locale="fr-FR" labels={{ 'dateRangePicker.today': "Aujourd'hui" }}>
        <DateRangePicker
          defaultStartDate={new Date(2024, 0, 15)}
          defaultEndDate={new Date(2024, 0, 20)}
        />
      </LabelsProvider>
    );
    await user.click(screen.getByRole('textbox'));
    expect(await screen.findByText("Aujourd'hui")).toBeInTheDocument();
    const now = new Date();
    const fr = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(now);
    expect(screen.getByText(`${fr} ${now.getFullYear()}`)).toBeInTheDocument();
  });

  it('DateRangePicker shows English month names by default', async () => {
    const user = userEvent.setup();
    render(
      <LabelsProvider locale="en-US">
        <DateRangePicker
          defaultStartDate={new Date(2024, 0, 15)}
          defaultEndDate={new Date(2024, 0, 20)}
        />
      </LabelsProvider>
    );
    await user.click(screen.getByRole('textbox'));
    const now = new Date();
    expect(
      await screen.findByText(`${getMonthName(now.getMonth())} ${now.getFullYear()}`)
    ).toBeInTheDocument();
  });

  it('DateRangePicker keeps caller-supplied preset labels', async () => {
    const user = userEvent.setup();
    withLabels(
      {},
      <DateRangePicker
        presets={[{ label: 'Custom', getValue: () => ({ startDate: null, endDate: null }) }]}
      />
    );
    await user.click(screen.getByRole('textbox'));
    expect(await screen.findByText('Custom')).toBeInTheDocument();
  });

  it('FilePicker translates button, dropzone and aria text', () => {
    withLabels(
      {
        'filePicker.choose': 'Choisir',
        'filePicker.dropzone': 'ou déposez ici',
        'filePicker.upload': 'Téléverser',
      },
      <FilePicker />
    );
    expect(screen.getByText('Choisir')).toBeInTheDocument();
    expect(screen.getByText('ou déposez ici')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléverser')).toBeInTheDocument();
  });

  it('FilePicker translates validation messages', () => {
    const onError = jest.fn();
    const { container } = withLabels(
      { 'filePicker.maxSize': 'Trop gros: {size}' },
      <FilePicker maxSize={1} onError={onError} />
    );
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, {
      target: { files: [new File(['abcdef'], 'a.txt', { type: 'text/plain' })] },
    });
    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0][0].message).toBe('Trop gros: 1 Bytes');
  });

  it('Input translates clear, show/hide password and required', async () => {
    const user = userEvent.setup();
    withLabels(
      {
        'input.clear': 'Effacer',
        'input.showPassword': 'Afficher',
        'input.hidePassword': 'Masquer',
        'input.required': 'obligatoire',
      },
      <>
        <Input label="A" required defaultValue="x" showClearButton />
        <Input type="password" aria-label="pw" />
      </>
    );
    expect(screen.getByLabelText('Effacer')).toBeInTheDocument();
    expect(screen.getByLabelText('obligatoire')).toBeInTheDocument();
    await user.click(screen.getByLabelText('Afficher'));
    expect(screen.getByLabelText('Masquer')).toBeInTheDocument();
  });

  it('NumberInput translates the step buttons', () => {
    withLabels(
      { 'numberInput.decrease': 'Moins', 'numberInput.increase': 'Plus' },
      <NumberInput />
    );
    expect(screen.getByLabelText('Moins')).toBeInTheDocument();
    expect(screen.getByLabelText('Plus')).toBeInTheDocument();
  });

  it('PhoneInput translates the country button and search placeholder', async () => {
    const user = userEvent.setup();
    withLabels(
      { 'phoneInput.selectCountry': 'Pays', 'phoneInput.searchCountries': 'Chercher' },
      <PhoneInput />
    );
    await user.click(screen.getByLabelText('Pays'));
    expect(await screen.findByPlaceholderText('Chercher')).toBeInTheDocument();
  });

  it('Rating translates star labels', () => {
    withLabels({ 'rating.stars': '{n} étoiles', 'rating.star': '{n} étoile' }, <Rating max={3} />);
    expect(screen.getByLabelText('1 étoiles')).toBeInTheDocument();
    expect(screen.getByLabelText('3 étoiles')).toBeInTheDocument();
  });

  it('Rating uses the singular label when max is 1', () => {
    withLabels({ 'rating.star': '{n} étoile' }, <Rating max={1} />);
    expect(screen.getByLabelText('1 étoile')).toBeInTheDocument();
  });

  it('Select translates placeholder, search placeholder and empty state', async () => {
    const user = userEvent.setup();
    withLabels(
      {
        'select.placeholder': 'Choisir',
        'select.searchPlaceholder': 'Rechercher',
        'select.noOptions': 'Aucune option',
      },
      <Select options={[]} searchable />
    );
    expect(screen.getByText('Choisir')).toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(await screen.findByPlaceholderText('Rechercher')).toBeInTheDocument();
    expect(screen.getByText('Aucune option')).toBeInTheDocument();
  });

  it('TagInput translates placeholder and remove label', () => {
    withLabels(
      { 'tagInput.placeholder': 'Ajouter', 'tag.remove': 'Retirer {name}' },
      <>
        <TagInput />
        <TagInput defaultValue={['a']} />
      </>
    );
    expect(screen.getAllByPlaceholderText('Ajouter').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Retirer a')).toBeInTheDocument();
  });

  it('Textarea translates the validation message', async () => {
    const user = userEvent.setup();
    withLabels(
      { 'textarea.invalid': 'Invalide' },
      <Textarea validationRegex={/^[a-z]+$/} validateOn="blur" aria-label="t" />
    );
    await user.type(screen.getByRole('textbox'), '123');
    await user.tab();
    expect(screen.getByText('Invalide')).toBeInTheDocument();
  });
});
