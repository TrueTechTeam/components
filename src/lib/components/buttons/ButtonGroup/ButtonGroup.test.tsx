import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button';
import { IconButton } from '../IconButton';

describe('ButtonGroup', () => {
  describe('rendering', () => {
    it('should render with children', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <Button>Save</Button>
          <IconButton icon="close" aria-label="More options" />
        </ButtonGroup>
      );
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByLabelText('More options')).toBeInTheDocument();
    });

    it('should render with group role', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <Button>Save</Button>
        </ButtonGroup>
      );
      expect(screen.getByRole('group')).toBeInTheDocument();
    });
  });

  describe('independent actions', () => {
    it('should call each button onClick handler independently', () => {
      const handleSave = jest.fn();
      const handleMore = jest.fn();
      render(
        <ButtonGroup aria-label="Test group">
          <Button onClick={handleSave}>Save</Button>
          <IconButton icon="close" aria-label="More options" onClick={handleMore} />
        </ButtonGroup>
      );

      fireEvent.click(screen.getByText('Save'));
      expect(handleSave).toHaveBeenCalledTimes(1);
      expect(handleMore).not.toHaveBeenCalled();

      fireEvent.click(screen.getByLabelText('More options'));
      expect(handleMore).toHaveBeenCalledTimes(1);
      expect(handleSave).toHaveBeenCalledTimes(1);
    });

    it('should not have a concept of selected state', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <Button>Save</Button>
          <IconButton icon="close" aria-label="More options" />
        </ButtonGroup>
      );

      expect(screen.getByText('Save').closest('button')).not.toHaveAttribute('aria-checked');
      expect(screen.getByLabelText('More options')).not.toHaveAttribute('aria-checked');
    });
  });

  describe('shared variant', () => {
    it('should apply the default variant to every button', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <Button>Save</Button>
          <IconButton icon="close" aria-label="More options" />
        </ButtonGroup>
      );
      expect(screen.getByText('Save').closest('button')).toHaveAttribute('data-variant', 'primary');
      expect(screen.getByLabelText('More options')).toHaveAttribute('data-variant', 'primary');
    });

    it('should apply a custom variant to every button', () => {
      render(
        <ButtonGroup variant="outline" aria-label="Test group">
          <Button>Save</Button>
          <IconButton icon="close" aria-label="More options" />
        </ButtonGroup>
      );
      expect(screen.getByText('Save').closest('button')).toHaveAttribute('data-variant', 'outline');
      expect(screen.getByLabelText('More options')).toHaveAttribute('data-variant', 'outline');
    });

    it('should let an individual button override the group variant', () => {
      render(
        <ButtonGroup variant="outline" aria-label="Test group">
          <Button>Save</Button>
          <IconButton icon="close" variant="danger" aria-label="Delete" />
        </ButtonGroup>
      );
      expect(screen.getByText('Save').closest('button')).toHaveAttribute('data-variant', 'outline');
      expect(screen.getByLabelText('Delete')).toHaveAttribute('data-variant', 'danger');
    });
  });

  describe('data attributes', () => {
    it('should default to horizontal orientation', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <Button>Save</Button>
        </ButtonGroup>
      );
      expect(screen.getByRole('group')).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('should set data-orientation', () => {
      render(
        <ButtonGroup orientation="vertical" aria-label="Test group">
          <Button>Save</Button>
        </ButtonGroup>
      );
      expect(screen.getByRole('group')).toHaveAttribute('data-orientation', 'vertical');
    });

    it('should set data-full-width when fullWidth is true', () => {
      render(
        <ButtonGroup fullWidth aria-label="Test group">
          <Button>Save</Button>
        </ButtonGroup>
      );
      expect(screen.getByRole('group')).toHaveAttribute('data-full-width', 'true');
    });
  });

  describe('accessibility', () => {
    it('should have aria-label on group', () => {
      render(
        <ButtonGroup aria-label="Test group">
          <Button>Save</Button>
        </ButtonGroup>
      );
      expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Test group');
    });
  });

  describe('custom props', () => {
    it('should apply custom className to group', () => {
      render(
        <ButtonGroup className="custom-class" aria-label="Test group">
          <Button>Save</Button>
        </ButtonGroup>
      );
      expect(screen.getByRole('group')).toHaveClass('custom-class');
    });

    it('should apply custom data-testid', () => {
      render(
        <ButtonGroup data-testid="custom-testid" aria-label="Test group">
          <Button>Save</Button>
        </ButtonGroup>
      );
      expect(screen.getByTestId('custom-testid')).toBeInTheDocument();
    });
  });
});
