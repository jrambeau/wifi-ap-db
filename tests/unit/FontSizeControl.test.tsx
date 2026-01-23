import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FontSizeControl from '../../src/components/ui/FontSizeControl';

describe('FontSizeControl', () => {
  const STORAGE_KEY = 'ap-catalog-font-size-level';

  beforeEach(() => {
    localStorage.clear();
    // Reset root font size
    document.documentElement.style.fontSize = '14px';
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.style.fontSize = '';
  });

  it('renders all three buttons (decrease, reset, increase)', () => {
    render(<FontSizeControl />);
    expect(screen.getByLabelText('Decrease font size')).toBeInTheDocument();
    expect(screen.getByLabelText('Reset font size')).toBeInTheDocument();
    expect(screen.getByLabelText('Increase font size')).toBeInTheDocument();
  });

  it('starts at default level (14px)', () => {
    render(<FontSizeControl />);
    expect(document.documentElement.style.fontSize).toBe('14px');
  });

  it('increases font size when increase button is clicked', () => {
    render(<FontSizeControl />);
    const increaseBtn = screen.getByLabelText('Increase font size');
    
    fireEvent.click(increaseBtn);
    expect(document.documentElement.style.fontSize).toBe('15px');
    
    fireEvent.click(increaseBtn);
    expect(document.documentElement.style.fontSize).toBe('16px');
  });

  it('decreases font size when decrease button is clicked', () => {
    render(<FontSizeControl />);
    const decreaseBtn = screen.getByLabelText('Decrease font size');
    
    fireEvent.click(decreaseBtn);
    expect(document.documentElement.style.fontSize).toBe('13px');
    
    fireEvent.click(decreaseBtn);
    expect(document.documentElement.style.fontSize).toBe('12px');
  });

  it('resets font size to default when reset button is clicked', () => {
    render(<FontSizeControl />);
    const increaseBtn = screen.getByLabelText('Increase font size');
    const resetBtn = screen.getByLabelText('Reset font size');
    
    // Increase twice
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);
    expect(document.documentElement.style.fontSize).toBe('16px');
    
    // Reset
    fireEvent.click(resetBtn);
    expect(document.documentElement.style.fontSize).toBe('14px');
  });

  it('disables decrease button at minimum level', () => {
    render(<FontSizeControl />);
    const decreaseBtn = screen.getByLabelText('Decrease font size');
    
    // Go to minimum (-2)
    fireEvent.click(decreaseBtn);
    fireEvent.click(decreaseBtn);
    
    expect(decreaseBtn).toBeDisabled();
  });

  it('disables increase button at maximum level', () => {
    render(<FontSizeControl />);
    const increaseBtn = screen.getByLabelText('Increase font size');
    
    // Go to maximum (+2)
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);
    
    expect(increaseBtn).toBeDisabled();
  });

  it('saves preference to localStorage', () => {
    render(<FontSizeControl />);
    const increaseBtn = screen.getByLabelText('Increase font size');
    
    fireEvent.click(increaseBtn);
    
    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).toBe('1');
  });

  it('loads preference from localStorage on mount', () => {
    localStorage.setItem(STORAGE_KEY, '2');
    
    render(<FontSizeControl />);
    
    expect(document.documentElement.style.fontSize).toBe('16px');
  });

  it('ignores invalid localStorage values', () => {
    localStorage.setItem(STORAGE_KEY, 'invalid');
    
    render(<FontSizeControl />);
    
    // Should use default (14px)
    expect(document.documentElement.style.fontSize).toBe('14px');
  });

  it('ignores out-of-bounds localStorage values', () => {
    localStorage.setItem(STORAGE_KEY, '10'); // Too high
    
    render(<FontSizeControl />);
    
    // Should use default (14px)
    expect(document.documentElement.style.fontSize).toBe('14px');
  });

  it('displays correct button labels', () => {
    render(<FontSizeControl />);
    
    expect(screen.getByText('A−')).toBeInTheDocument();
    expect(screen.getByText('A+')).toBeInTheDocument();
  });

  it('has correct range of font sizes (12px to 16px)', () => {
    render(<FontSizeControl />);
    const decreaseBtn = screen.getByLabelText('Decrease font size');
    const increaseBtn = screen.getByLabelText('Increase font size');
    
    // Go to minimum
    fireEvent.click(decreaseBtn);
    fireEvent.click(decreaseBtn);
    expect(document.documentElement.style.fontSize).toBe('12px');
    
    // Go to maximum
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);
    fireEvent.click(increaseBtn);
    expect(document.documentElement.style.fontSize).toBe('16px');
  });
});
