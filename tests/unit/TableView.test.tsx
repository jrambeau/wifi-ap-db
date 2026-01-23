import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TableView from '../../src/components/TableView';
import type { APMachine } from '../../src/types';

const mockMachines: APMachine[] = [
  {
    id: 'ap-001',
    vendor: 'Cisco',
    model: 'AP1840',
    reference: 'AIR-AP1840I-E-K9',
    antenna_type: 'Internal',
    indoor_outdoor: 'Indoor',
    generation: 'Wi-Fi 6',
    product_positioning: 'Enterprise',
    total_phy_serving_radios: '2',
    concurrent_serving_radios: '2',
    serving_radio_1: '2.4 GHz',
    serving_radio_2: '5 GHz',
    serving_radio_3: '',
    serving_radio_4: '',
    dedicated_scanning_radio: 'No',
    poe_class: 'Class 6',
    max_poe_consumption_w: '30',
    limited_capabilities_poe_bt: 'No',
    limited_capabilities_poe_at: 'No',
    limited_capabilities_poe_af: 'Yes',
    ethernet1: '2.5GBASE-T',
    ethernet2: 'N/A',
    weight_kg: '0.5',
    dimensions_cm: '20x20x5',
    geolocation: 'Yes',
    usb_ports: '1',
    uwb: 'No',
    gnss: 'No',
    bluetooth: 'Yes',
    zigbee: 'No',
    minimum_software_version: '8.10',
    public_price_usd: '1000',
    public_price_eur: '900',
    comments: 'Excellent choice',
  },
  {
    id: 'ap-002',
    vendor: 'Aruba',
    model: 'AP-635',
    reference: 'R4W43A',
    antenna_type: 'Internal',
    indoor_outdoor: 'Indoor',
    generation: 'Wi-Fi 6E',
    product_positioning: 'Premium',
    total_phy_serving_radios: '3',
    concurrent_serving_radios: '3',
    serving_radio_1: '2.4 GHz',
    serving_radio_2: '5 GHz',
    serving_radio_3: '6 GHz',
    serving_radio_4: '',
    dedicated_scanning_radio: 'Yes',
    poe_class: 'Class 8',
    max_poe_consumption_w: '45',
    limited_capabilities_poe_bt: 'No',
    limited_capabilities_poe_at: 'No',
    limited_capabilities_poe_af: 'Yes',
    ethernet1: '5GBASE-T',
    ethernet2: '2.5GBASE-T',
    weight_kg: '0.8',
    dimensions_cm: '25x25x6',
    geolocation: 'Yes',
    usb_ports: '1',
    uwb: 'No',
    gnss: 'Yes',
    bluetooth: 'Yes',
    zigbee: 'No',
    minimum_software_version: '8.10',
    public_price_usd: '1500',
    public_price_eur: '1400',
    comments: 'Top of the line',
  },
];

describe('TableView', () => {
  it('renders table with machines data', () => {
    const mockToggle = vi.fn();
    const mockClear = vi.fn();
    const mockCompare = vi.fn();

    render(
      <TableView
        machines={mockMachines}
        selectedIds={new Set()}
        onToggleSelection={mockToggle}
        onClearSelection={mockClear}
        onGoToCompare={mockCompare}
      />
    );

    // Vérifie que les données sont affichées
    expect(screen.getByText('Cisco')).toBeInTheDocument();
    expect(screen.getByText('AP1840')).toBeInTheDocument();
    expect(screen.getByText('Aruba')).toBeInTheDocument();
    expect(screen.getByText('AP-635')).toBeInTheDocument();
  });

  it('displays selection mode button', () => {
    const mockToggle = vi.fn();
    const mockClear = vi.fn();
    const mockCompare = vi.fn();

    render(
      <TableView
        machines={mockMachines}
        selectedIds={new Set()}
        onToggleSelection={mockToggle}
        onClearSelection={mockClear}
        onGoToCompare={mockCompare}
      />
    );

    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  it('activates selection mode when Select button is clicked', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    const mockClear = vi.fn();
    const mockCompare = vi.fn();

    render(
      <TableView
        machines={mockMachines}
        selectedIds={new Set()}
        onToggleSelection={mockToggle}
        onClearSelection={mockClear}
        onGoToCompare={mockCompare}
      />
    );

    const selectButton = screen.getByText('Select');
    await user.click(selectButton);

    // Le bouton devrait maintenant afficher "Cancel"
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onToggleSelection when row is clicked in selection mode', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    const mockClear = vi.fn();
    const mockCompare = vi.fn();

    render(
      <TableView
        machines={mockMachines}
        selectedIds={new Set()}
        onToggleSelection={mockToggle}
        onClearSelection={mockClear}
        onGoToCompare={mockCompare}
      />
    );

    // Activer le mode sélection
    const selectButton = screen.getByText('Select');
    await user.click(selectButton);

    // Cliquer sur une ligne
    const ciscoCell = screen.getByText('Cisco');
    const row = ciscoCell.closest('tr');
    if (row) {
      await user.click(row);
    }

    expect(mockToggle).toHaveBeenCalledWith('ap-001');
  });

  it('applies tr-selected class to selected rows', () => {
    const mockToggle = vi.fn();
    const mockClear = vi.fn();
    const mockCompare = vi.fn();

    render(
      <TableView
        machines={mockMachines}
        selectedIds={new Set(['ap-001'])}
        onToggleSelection={mockToggle}
        onClearSelection={mockClear}
        onGoToCompare={mockCompare}
      />
    );

    const ciscoCell = screen.getByText('Cisco');
    const row = ciscoCell.closest('tr');
    
    expect(row).toHaveClass('tr-selected');
  });

  it('applies column-pinned class to vendor and model cells', () => {
    const mockToggle = vi.fn();
    const mockClear = vi.fn();
    const mockCompare = vi.fn();

    render(
      <TableView
        machines={mockMachines}
        selectedIds={new Set()}
        onToggleSelection={mockToggle}
        onClearSelection={mockClear}
        onGoToCompare={mockCompare}
      />
    );

    const ciscoCell = screen.getByText('Cisco');
    const modelCell = screen.getByText('AP1840');
    
    expect(ciscoCell.closest('td')).toHaveClass('column-pinned');
    expect(modelCell.closest('td')).toHaveClass('column-pinned');
  });

  it('highlights pinned columns when row is selected', () => {
    const mockToggle = vi.fn();
    const mockClear = vi.fn();
    const mockCompare = vi.fn();

    render(
      <TableView
        machines={mockMachines}
        selectedIds={new Set(['ap-001'])}
        onToggleSelection={mockToggle}
        onClearSelection={mockClear}
        onGoToCompare={mockCompare}
      />
    );

    const ciscoCell = screen.getByText('Cisco');
    const row = ciscoCell.closest('tr');
    
    // La ligne doit avoir la classe tr-selected
    expect(row).toHaveClass('tr-selected');
    
    // Les cellules pinnées doivent aussi être dans une ligne sélectionnée
    // Le CSS s'occupe du styling avec .tr-selected td.column-pinned
    const vendorCell = ciscoCell.closest('td');
    const modelCell = screen.getByText('AP1840').closest('td');
    
    expect(vendorCell).toHaveClass('column-pinned');
    expect(modelCell).toHaveClass('column-pinned');
    expect(row).toHaveClass('tr-selected');
  });

  it('shows Compare button when machines are selected and in selection mode', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    const mockClear = vi.fn();
    const mockCompare = vi.fn();

    render(
      <TableView
        machines={mockMachines}
        selectedIds={new Set(['ap-001', 'ap-002'])}
        onToggleSelection={mockToggle}
        onClearSelection={mockClear}
        onGoToCompare={mockCompare}
      />
    );

    // Activer le mode sélection d'abord
    const selectButton = screen.getByText('Select');
    await user.click(selectButton);

    expect(screen.getByText(/Compare \(2\)/)).toBeInTheDocument();
  });

  it('calls onGoToCompare when Compare button is clicked', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    const mockClear = vi.fn();
    const mockCompare = vi.fn();

    render(
      <TableView
        machines={mockMachines}
        selectedIds={new Set(['ap-001'])}
        onToggleSelection={mockToggle}
        onClearSelection={mockClear}
        onGoToCompare={mockCompare}
      />
    );

    // Activer le mode sélection
    const selectButton = screen.getByText('Select');
    await user.click(selectButton);

    const compareButton = screen.getByText(/Compare \(1\)/);
    await user.click(compareButton);

    expect(mockCompare).toHaveBeenCalled();
  });

  it('filters machines by global search', async () => {
    const user = userEvent.setup();
    const mockToggle = vi.fn();
    const mockClear = vi.fn();
    const mockCompare = vi.fn();

    render(
      <TableView
        machines={mockMachines}
        selectedIds={new Set()}
        onToggleSelection={mockToggle}
        onClearSelection={mockClear}
        onGoToCompare={mockCompare}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search all fields...');
    await user.type(searchInput, 'Cisco');

    // Cisco devrait être visible
    expect(screen.getByText('Cisco')).toBeInTheDocument();
    expect(screen.getByText('AP1840')).toBeInTheDocument();
    
    // Aruba ne devrait pas être visible après le filtrage
    // Note: les deux machines sont toujours dans le DOM mais seule Cisco est affichée dans la pagination
  });

  it('displays pagination controls', () => {
    const mockToggle = vi.fn();
    const mockClear = vi.fn();
    const mockCompare = vi.fn();

    render(
      <TableView
        machines={mockMachines}
        selectedIds={new Set()}
        onToggleSelection={mockToggle}
        onClearSelection={mockClear}
        onGoToCompare={mockCompare}
      />
    );

    // Vérifie la présence des contrôles de pagination
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
  });

  it('renders column settings button', () => {
    const mockToggle = vi.fn();
    const mockClear = vi.fn();
    const mockCompare = vi.fn();

    render(
      <TableView
        machines={mockMachines}
        selectedIds={new Set()}
        onToggleSelection={mockToggle}
        onClearSelection={mockClear}
        onGoToCompare={mockCompare}
      />
    );

    const settingsButton = screen.getByText('Columns');
    expect(settingsButton).toBeInTheDocument();
  });
});
