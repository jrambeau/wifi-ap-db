export interface APMachine {
  id: string;
  vendor: string;
  model: string;
  reference: string;
  antenna_type: string;
  indoor_outdoor: string;
  generation: string;
  chipset: string;
  product_positioning: string;
  total_phy_serving_radios: string;
  concurrent_serving_radios: string;
  serving_radio_1: string;
  serving_radio_2: string;
  serving_radio_3: string;
  serving_radio_4: string;
  dedicated_scanning_radio: string;
  poe_class: string;
  max_poe_consumption_w: string;
  limited_capabilities_poe_bt: string;
  limited_capabilities_poe_at: string;
  limited_capabilities_poe_af: string;
  ethernet1: string;
  ethernet2: string;
  weight_kg: string;
  dimensions_cm: string;
  geolocation: string;
  usb_ports: string;
  uwb: string;
  gnss: string;
  bluetooth: string;
  zigbee: string;
  minimum_software_version: string;
  maximum_software_version: string;
  end_of_sale_date: string;
  end_of_support_date: string;
  public_price_usd: string;
  public_price_eur: string;
  comments: string;
}

export interface ColumnConfig {
  key: keyof APMachine;
  label: string;
  sortable: boolean;
  filterable: boolean;
  width?: number;
  pinned?: boolean;
}

export interface ColumnFilterState {
  search: string;
  selectedValues: Set<string>;
}

export type ColumnFilters = Record<string, ColumnFilterState>;
