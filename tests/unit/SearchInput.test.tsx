import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from '../../src/components/ui/SearchInput';

describe('SearchInput', () => {
  it('renders search input', () => {
    render(<SearchInput placeholder="Search..." />);
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'search');
  });

  it('displays search icon', () => {
    const { container } = render(<SearchInput />);
    const icon = container.querySelector('.search-input__icon');
    expect(icon).toBeInTheDocument();
  });

  it('displays value prop', () => {
    render(<SearchInput value="test query" onChange={() => {}} />);
    const input = screen.getByDisplayValue('test query');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const handleChange = vi.fn();
    render(<SearchInput value="" onChange={handleChange} />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows clear button when value is not empty and onClear is provided', () => {
    render(<SearchInput value="some text" onClear={() => {}} onChange={() => {}} />);
    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('does not show clear button when value is empty', () => {
    render(<SearchInput value="" onClear={() => {}} onChange={() => {}} />);
    const clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('does not show clear button when onClear is not provided', () => {
    render(<SearchInput value="some text" onChange={() => {}} />);
    const clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    const handleClear = vi.fn();
    render(<SearchInput value="text" onClear={handleClear} onChange={() => {}} />);
    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(<SearchInput className="custom-search" />);
    const searchContainer = container.querySelector('.search-input');
    expect(searchContainer).toHaveClass('custom-search');
  });

  it('forwards HTML attributes to input', () => {
    render(
      <SearchInput
        placeholder="Find items..."
        disabled={true}
        autoFocus={true}
        aria-label="Global search"
      />
    );
    const input = screen.getByPlaceholderText('Find items...');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-label', 'Global search');
  });

  it('has correct structure with wrapper, icon, input, and conditional clear button', () => {
    const { container } = render(
      <SearchInput value="test" onClear={() => {}} onChange={() => {}} />
    );
    
    const wrapper = container.querySelector('.search-input');
    expect(wrapper).toBeInTheDocument();
    
    const icon = wrapper?.querySelector('.search-input__icon');
    expect(icon).toBeInTheDocument();
    
    const input = wrapper?.querySelector('.search-input__field');
    expect(input).toBeInTheDocument();
    
    const clearButton = wrapper?.querySelector('.search-input__clear');
    expect(clearButton).toBeInTheDocument();
  });
});
