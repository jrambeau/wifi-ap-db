import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../../src/App';

// Mock fetch globally
const mockMachines = [
  {
    id: 'ap-001',
    vendor: 'Cisco',
    model: 'AP1840',
    reference: 'AIR-AP1840I-E-K9',
    antenna_type: 'Internal',
    indoor_outdoor: 'Indoor',
    generation: 'Wi-Fi 6',
    product_positioning: 'High End',
    total_phy_serving_radios: '4',
    concurrent_serving_radios: '2',
    serving_radio_1: '2.4 GHz',
    serving_radio_2: '5 GHz',
    serving_radio_3: '',
    serving_radio_4: '',
    dedicated_scanning_radio: 'Yes',
    poe_class: 'Class 6',
    max_poe_consumption_w: '30',
    limited_capabilities_poe_bt: 'No',
    limited_capabilities_poe_at: 'Yes',
    limited_capabilities_poe_af: 'Yes',
    ethernet1: '1 Gbps',
    ethernet2: '1 Gbps',
    weight_kg: '0.8',
    dimensions_cm: '20x20x5',
    geolocation: 'Yes',
    usb_ports: '1',
    uwb: 'No',
    gnss: 'No',
    bluetooth: 'Yes',
    zigbee: 'No',
    minimum_software_version: '8.10',
    public_price_usd: '1200',
    public_price_eur: '1100',
    comments: 'Premium model',
  },
  {
    id: 'ap-002',
    vendor: 'Aruba',
    model: 'AP-515',
    reference: 'R2H28A',
    antenna_type: 'Internal',
    indoor_outdoor: 'Indoor',
    generation: 'Wi-Fi 6',
    product_positioning: 'Mid Range',
    total_phy_serving_radios: '2',
    concurrent_serving_radios: '2',
    serving_radio_1: '2.4 GHz',
    serving_radio_2: '5 GHz',
    serving_radio_3: '',
    serving_radio_4: '',
    dedicated_scanning_radio: 'No',
    poe_class: 'Class 4',
    max_poe_consumption_w: '20',
    limited_capabilities_poe_bt: 'No',
    limited_capabilities_poe_at: 'No',
    limited_capabilities_poe_af: 'Yes',
    ethernet1: '1 Gbps',
    ethernet2: '1 Gbps',
    weight_kg: '0.6',
    dimensions_cm: '18x18x4',
    geolocation: 'Yes',
    usb_ports: '0',
    uwb: 'No',
    gnss: 'No',
    bluetooth: 'Yes',
    zigbee: 'No',
    minimum_software_version: '8.8',
    public_price_usd: '800',
    public_price_eur: '750',
    comments: '',
  },
];

describe('App', () => {
  beforeEach(() => {
    // Mock fetch to return test data
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockMachines),
      })
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('displays loading state initially', () => {
    render(<App />);
    expect(screen.getByText('Loading AP Catalog...')).toBeInTheDocument();
  });

  it('renders application header after loading', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Wi-Fi Access Point Database')).toBeInTheDocument();
    });
  });

  it('renders author link', async () => {
    render(<App />);
    
    await waitFor(() => {
      const authorLink = screen.getByText('by Jonathan Rambeau');
      expect(authorLink).toBeInTheDocument();
      expect(authorLink.closest('a')).toHaveAttribute('href', 'https://www.networkjon.fr');
    });
  });

  it('loads machines data on mount', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('renders table view by default', async () => {
    render(<App />);
    
    await waitFor(() => {
      // TableView should be rendered (contains search, filters, etc.)
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });
  });

  it('renders FontSizeControl', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Increase font size')).toBeInTheDocument();
      expect(screen.getByLabelText('Decrease font size')).toBeInTheDocument();
    });
  });

  it('handles fetch error gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock fetch to fail
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Network error'))
    ) as unknown as typeof fetch;
    
    render(<App />);
    
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'Failed to load machines:',
        expect.any(Error)
      );
    });
    
    consoleError.mockRestore();
  });

  it('uses correct data path with BASE_URL', async () => {
    render(<App />);
    
    await waitFor(() => {
      const fetchCalls = (global.fetch as ReturnType<typeof vi.fn>).mock.calls;
      expect(fetchCalls[0][0]).toContain('data/machines.json');
    });
  });

  it('initializes with empty selection', async () => {
    render(<App />);
    
    await waitFor(() => {
      // Should not have "Compare (X)" button with count > 0 initially
      const tableView = screen.queryByText(/Compare \(/);
      expect(tableView).not.toBeInTheDocument();
    });
  });
});
