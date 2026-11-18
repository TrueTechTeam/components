import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Carousel } from './Carousel';
import { LabelsProvider } from '../../../contexts/LabelsContext';

describe('Carousel', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(
        <Carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
          <div>Slide 3</div>
        </Carousel>
      );
      expect(screen.getByText('Slide 1')).toBeInTheDocument();
      expect(screen.getByText('Slide 2')).toBeInTheDocument();
      expect(screen.getByText('Slide 3')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(
        <Carousel className="custom-class" data-testid="carousel">
          <div>Slide 1</div>
        </Carousel>
      );
      expect(screen.getByTestId('carousel')).toHaveClass('custom-class');
    });
  });

  describe('navigation', () => {
    it('renders navigation arrows when showArrows is true', () => {
      render(
        <Carousel showArrows>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </Carousel>
      );
      expect(screen.getByLabelText('Previous slide')).toBeInTheDocument();
      expect(screen.getByLabelText('Next slide')).toBeInTheDocument();
    });

    it('calls onChange when navigation arrows are clicked', () => {
      const onChange = jest.fn();
      render(
        <Carousel showArrows onChange={onChange} activeIndex={0}>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </Carousel>
      );
      fireEvent.click(screen.getByLabelText('Next slide'));
      expect(onChange).toHaveBeenCalledWith(1);
    });
  });

  describe('controlled mode', () => {
    it('renders correct slide based on activeIndex', () => {
      const { rerender } = render(
        <Carousel activeIndex={0}>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </Carousel>
      );
      expect(screen.getByText('Slide 1')).toBeInTheDocument();

      rerender(
        <Carousel activeIndex={1}>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </Carousel>
      );
      expect(screen.getByText('Slide 2')).toBeInTheDocument();
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Carousel ref={ref}>
          <div>Slide 1</div>
        </Carousel>
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe('Carousel translated labels', () => {
  it('translates navigation labels and slide descriptions', () => {
    render(
      <LabelsProvider
        labels={{
          'carousel.label': 'Karussell',
          'carousel.next': 'Weiter',
          'carousel.previous': 'Zurueck',
          'carousel.slideOf': 'Folie {n} von {total}',
          'carousel.goToSlide': 'Zu Folie {n}',
        }}
      >
        <Carousel>
          <div>Slide 1</div>
          <div>Slide 2</div>
        </Carousel>
      </LabelsProvider>
    );
    expect(screen.getByRole('region', { name: 'Karussell' })).toBeInTheDocument();
    expect(screen.getAllByLabelText('Weiter').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('Zurueck').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Folie 1 von 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Zu Folie 2')).toBeInTheDocument();
  });
});
