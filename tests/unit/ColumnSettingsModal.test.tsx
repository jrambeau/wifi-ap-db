import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import ColumnSettingsModal from '../../src/components/ui/ColumnSettingsModal';
import type { ColumnConfig } from '../../src/types';

describe('ColumnSettingsModal', () => {
  const mockColumns: ColumnConfig[] = [
    { key: 'vendor', label: 'Vendor', width: 150, pinned: true, sortable: true, filterable: true },
    { key: 'model', label: 'Model', width: 200, pinned: true, sortable: true, filterable: true },
    { key: 'generation', label: 'Generation', width: 212, pinned: false, sortable: true, filterable: true },
    { key: 'antenna_type', label: 'Antenna Type', width: 150, pinned: false, sortable: true, filterable: true },
    { key: 'poe_class', label: 'PoE Class', width: 120, pinned: false, sortable: true, filterable: true },
  ];

  const defaultProps = {
    columns: mockColumns,
    visibleColumns: ['vendor', 'model', 'generation', 'antenna_type', 'poe_class'],
    columnOrder: ['vendor', 'model', 'generation', 'antenna_type', 'poe_class'],
    onSave: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal with title', () => {
    render(<ColumnSettingsModal {...defaultProps} />);
    expect(screen.getByText('Table Settings')).toBeInTheDocument();
  });

  it('displays all columns', () => {
    render(<ColumnSettingsModal {...defaultProps} />);
    
    expect(screen.getByText('Vendor')).toBeInTheDocument();
    expect(screen.getByText('Model')).toBeInTheDocument();
    expect(screen.getByText('Generation')).toBeInTheDocument();
    expect(screen.getByText('Antenna Type')).toBeInTheDocument();
    expect(screen.getByText('PoE Class')).toBeInTheDocument();
  });

  it('shows checkboxes checked for visible columns', () => {
    render(<ColumnSettingsModal {...defaultProps} />);
    
    const checkboxes = screen.getAllByRole('checkbox');
    // All columns are visible by default
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
    });
  });

  it('shows checkboxes unchecked for hidden columns', () => {
    render(
      <ColumnSettingsModal
        {...defaultProps}
        visibleColumns={['vendor', 'model']}
      />
    );
    
    const vendorCheckbox = screen.getByLabelText(/Vendor/i);
    const generationCheckbox = screen.getByLabelText(/Generation/i);
    
    expect(vendorCheckbox).toBeChecked();
    expect(generationCheckbox).not.toBeChecked();
  });

  it('marks pinned columns as locked', () => {
    render(<ColumnSettingsModal {...defaultProps} />);
    
    // Vendor and Model are pinned - should show (locked) badge
    const vendorLabel = screen.getByText(/Vendor/);
    const modelLabel = screen.getByText(/Model/);
    
    expect(vendorLabel.textContent).toContain('(locked)');
    expect(modelLabel.textContent).toContain('(locked)');
  });

  it('disables checkboxes for locked columns', () => {
    render(<ColumnSettingsModal {...defaultProps} />);
    
    const vendorCheckbox = screen.getByLabelText(/Vendor/i);
    const modelCheckbox = screen.getByLabelText(/Model/i);
    const generationCheckbox = screen.getByLabelText(/Generation/i);
    
    expect(vendorCheckbox).toBeDisabled();
    expect(modelCheckbox).toBeDisabled();
    expect(generationCheckbox).not.toBeDisabled();
  });

  it('toggles column visibility when clicking checkbox', () => {
    render(<ColumnSettingsModal {...defaultProps} />);
    
    const generationCheckbox = screen.getByLabelText(/Generation/i);
    
    expect(generationCheckbox).toBeChecked();
    
    fireEvent.click(generationCheckbox);
    
    expect(generationCheckbox).not.toBeChecked();
  });

  it('renders search input', () => {
    render(<ColumnSettingsModal {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search columns');
    expect(searchInput).toBeInTheDocument();
  });

  it('filters columns based on search query', () => {
    render(<ColumnSettingsModal {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search columns');
    
    fireEvent.change(searchInput, { target: { value: 'antenna' } });
    
    // Only Antenna Type should be visible
    expect(screen.getByText('Antenna Type')).toBeInTheDocument();
    expect(screen.queryByText('Generation')).not.toBeInTheDocument();
    expect(screen.queryByText('PoE Class')).not.toBeInTheDocument();
  });

  it('shows "Select All" and "Deselect All" buttons', () => {
    render(<ColumnSettingsModal {...defaultProps} />);
    
    expect(screen.getByText('Select All')).toBeInTheDocument();
    expect(screen.getByText('Deselect All')).toBeInTheDocument();
  });

  it('calls onSave with updated values when Apply is clicked', () => {
    render(<ColumnSettingsModal {...defaultProps} />);
    
    const generationCheckbox = screen.getByLabelText(/Generation/i);
    fireEvent.click(generationCheckbox);
    
    const applyButton = screen.getByText('Apply');
    fireEvent.click(applyButton);
    
    expect(defaultProps.onSave).toHaveBeenCalledWith(
      expect.arrayContaining(['vendor', 'model', 'antenna_type', 'poe_class']),
      expect.any(Array)
    );
  });

  it('calls onClose when Cancel is clicked', () => {
    render(<ColumnSettingsModal {...defaultProps} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when close button (X) is clicked', () => {
    render(<ColumnSettingsModal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
    
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('applies locked class to pinned columns', () => {
    const { container } = render(<ColumnSettingsModal {...defaultProps} />);
    
    const items = container.querySelectorAll('.column-settings-item');
    const firstItem = items[0]; // Vendor (pinned)
    const thirdItem = items[2]; // Generation (not pinned)
    
    expect(firstItem).toHaveClass('column-settings-item--locked');
    expect(thirdItem).not.toHaveClass('column-settings-item--locked');
  });
});
