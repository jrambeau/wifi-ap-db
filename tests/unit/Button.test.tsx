import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../src/components/ui/Button';
import { IconDownload } from '../../src/components/icons';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders with primary variant', () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ui-button--primary');
  });

  it('renders with secondary variant (default)', () => {
    render(<Button>Secondary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ui-button--secondary');
  });

  it('renders with ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ui-button--ghost');
  });

  it('renders with danger variant', () => {
    render(<Button variant="danger">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ui-button--danger');
  });

  it('renders with small size', () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ui-button--sm');
  });

  it('renders with medium size (default)', () => {
    render(<Button>Medium</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ui-button--md');
  });

  it('renders with large size', () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ui-button--lg');
  });

  it('renders icon on the left (default)', () => {
    render(
      <Button icon={<IconDownload size={16} />}>Download</Button>
    );
    const button = screen.getByRole('button');
    const icon = button.querySelector('.ui-button__icon');
    const label = button.querySelector('.ui-button__label');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    // Icon should come before label
    expect(button.children[0]).toBe(icon);
  });

  it('renders icon on the right', () => {
    render(
      <Button icon={<IconDownload size={16} />} iconPosition="right">
        Download
      </Button>
    );
    const button = screen.getByRole('button');
    const icon = button.querySelector('.ui-button__icon');
    const label = button.querySelector('.ui-button__label');
    expect(icon).toBeInTheDocument();
    expect(label).toBeInTheDocument();
    // Label should come before icon
    expect(button.children[0]).toBe(label);
  });

  it('renders icon-only button', () => {
    render(<Button icon={<IconDownload size={16} />} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('ui-button--icon-only');
    expect(button.querySelector('.ui-button__icon')).toBeInTheDocument();
    expect(button.querySelector('.ui-button__label')).not.toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not trigger click when disabled', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('ui-button'); // Should still have base class
  });

  it('forwards HTML attributes', () => {
    render(
      <Button type="submit" title="Submit form" aria-label="Submit">
        Submit
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('title', 'Submit form');
    expect(button).toHaveAttribute('aria-label', 'Submit');
  });
});
