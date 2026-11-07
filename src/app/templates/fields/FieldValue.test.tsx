import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LabelsProvider } from '../../../lib/contexts/LabelsContext';
import { NavigationGuardProvider } from '../../../lib/contexts/NavigationGuardContext';
import { AppProvider } from '../../AppProvider';
import { FieldValue, fieldAlign, isEmptyFieldValue, type FieldValueProps } from './FieldValue';

const silentLogger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };

function renderField(props: FieldValueProps) {
  return render(
    <LabelsProvider locale="en-US">
      <NavigationGuardProvider>
        <AppProvider logger={silentLogger}>
          <FieldValue {...props} />
        </AppProvider>
      </NavigationGuardProvider>
    </LabelsProvider>
  );
}

describe('FieldValue', () => {
  it('formats currency', () => {
    renderField({ kind: 'currency', value: 1234.5 });
    expect(screen.getByText('$1,234.50')).toBeInTheDocument();
  });

  it('formats percent with fractionDigits', () => {
    renderField({ kind: 'percent', value: 0.256, fractionDigits: 1 });
    expect(screen.getByText('25.6%')).toBeInTheDocument();
  });

  it('formats number and fileSize', () => {
    renderField({ kind: 'number', value: 12345 });
    expect(screen.getByText('12,345')).toBeInTheDocument();
    renderField({ kind: 'fileSize', value: 1500 });
    expect(screen.getByText('1.5 kB')).toBeInTheDocument();
  });

  it('formats dates and datetimes', () => {
    renderField({ kind: 'date', value: '2026-01-05T12:00:00' });
    expect(screen.getByText('Jan 5, 2026')).toBeInTheDocument();
    renderField({ kind: 'datetime', value: '2026-01-05T12:00:00' });
    expect(screen.getByText('Jan 5, 2026, 12:00 PM')).toBeInTheDocument();
  });

  it('renders relative time in a time element with the absolute date as title', () => {
    const { container } = renderField({ kind: 'relative', value: new Date(Date.now() - 3600_000) });
    const time = container.querySelector('time');
    expect(time).toHaveAttribute('datetime');
    expect(time).toHaveAttribute('title');
    expect(time?.textContent).toMatch(/ago/);
  });

  it('renders booleans as Yes/No', () => {
    renderField({ kind: 'boolean', value: true });
    expect(screen.getByText('Yes')).toBeInTheDocument();
    renderField({ kind: 'boolean', value: false });
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('renders status as a toned badge with text', () => {
    renderField({ kind: 'status', value: 'paid', statusTones: { paid: 'success' } });
    const el = screen.getByText('Paid');
    expect(el).toHaveAttribute('data-variant', 'success');
  });

  it('uses statusLabels and a neutral tone for unknown status', () => {
    renderField({ kind: 'status', value: 'in_review', statusLabels: { in_review: 'Reviewing' } });
    expect(screen.getByText('Reviewing')).toHaveAttribute('data-variant', 'neutral');
    renderField({ kind: 'status', value: 'on_hold' });
    expect(screen.getByText('On hold')).toHaveAttribute('data-variant', 'neutral');
  });

  it('renders email, phone and url links', () => {
    renderField({ kind: 'email', value: 'a@b.co' });
    expect(screen.getByRole('link', { name: 'a@b.co' })).toHaveAttribute('href', 'mailto:a@b.co');
    renderField({ kind: 'phone', value: '+1 555 0100' });
    expect(screen.getByRole('link', { name: '+1 555 0100' })).toHaveAttribute(
      'href',
      'tel:+15550100'
    );
    renderField({ kind: 'url', value: 'https://www.example.com/path?q=1' });
    const link = screen.getByRole('link', { name: 'example.com' });
    expect(link).toHaveAttribute('href', 'https://www.example.com/path?q=1');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('does not link unsafe url schemes', () => {
    renderField({ kind: 'url', value: 'javascript:alert(1)' });
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Not set')).toBeInTheDocument();
  });

  it('copies an id', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    renderField({ kind: 'id', value: 'ord_123' });
    expect(screen.getByText('ord_123')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('ord_123'));
  });

  it('renders a lazy thumbnail', () => {
    const { container } = renderField({
      kind: 'image',
      value: '/a.png',
      imageAlt: 'Avatar',
      imageSize: 32,
    });
    const img = screen.getByAltText('Avatar');
    expect(img).toHaveAttribute('src', '/a.png');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('width', '32');
    expect(container.querySelector('img')).toBe(img);
  });

  it('renders an empty alt (decorative) when imageAlt is missing', () => {
    const { container } = renderField({ kind: 'image', value: '/a.png' });
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('renders lists and tags', () => {
    renderField({ kind: 'list', value: ['a', 'b', 'c'] });
    expect(screen.getByText('a, b, and c')).toBeInTheDocument();
    renderField({ kind: 'tags', value: ['x', 'y'] });
    expect(screen.getByText('x')).toBeInTheDocument();
    expect(screen.getByText('y')).toBeInTheDocument();
  });

  it('truncates longText with the full text in title', () => {
    renderField({ kind: 'longText', value: 'abcdefghij', truncate: 5 });
    const el = screen.getByText('abcde…');
    expect(el).toHaveAttribute('title', 'abcdefghij');
  });

  it.each([
    ['text', null],
    ['text', undefined],
    ['text', ''],
    ['date', 'not-a-date'],
    ['number', NaN],
    ['currency', 'abc'],
    ['list', []],
  ] as const)('renders an empty marker for %s %p', (kind, value) => {
    const { container } = renderField({ kind, value });
    expect(container.textContent).toContain('—');
    expect(screen.getByText('Not set')).toBeInTheDocument();
  });

  it('does not treat false or 0 as empty', () => {
    expect(isEmptyFieldValue('boolean', false)).toBe(false);
    expect(isEmptyFieldValue('number', 0)).toBe(false);
    expect(isEmptyFieldValue('number', NaN)).toBe(true);
    expect(isEmptyFieldValue('date', 'nope')).toBe(true);
    expect(isEmptyFieldValue('status', 'weird')).toBe(false);
  });

  it('aligns numeric kinds to the end', () => {
    expect(fieldAlign('number')).toBe('end');
    expect(fieldAlign('currency')).toBe('end');
    expect(fieldAlign('percent')).toBe('end');
    expect(fieldAlign('fileSize')).toBe('end');
    expect(fieldAlign('text')).toBe('start');
    expect(fieldAlign('date')).toBe('start');
  });
});
