import { useState, useMemo, useEffect, useRef } from 'react';
import type React from 'react';
import type { APMachine, ColumnConfig, ColumnFilters } from '../types';
import { columns as defaultColumns } from '../config/columns';
import { Button, SearchInput, ColumnSettingsModal, FilterDropdown } from '../components/ui';
import { IconSettings, IconClear, IconSort, IconFilter, IconDownload } from '../components/icons';
import { getUniqueColumnValues } from '../utils/columnFilters';
import './TableView.css';

/**
 * Props pour le composant TableView
 */
interface Props {
  machines: APMachine[];
  selectedIds: Set<string>;
  onClearSelection: () => void;
  onGoToCompare: () => void;
}

const STORAGE_KEY_VISIBLE_COLUMNS = 'ap-catalog-visible-columns';
const STORAGE_KEY_COLUMN_ORDER = 'ap-catalog-column-order';

/**
 * Garantit que les colonnes pinned (Vendor, Model) sont toujours en premier
 * dans l'ordre des colonnes, quel que soit l'ordre sauvegardé dans localStorage.
 * 
 * @param order - Ordre des clés de colonnes
 * @param columns - Configuration des colonnes
 * @returns Ordre avec colonnes pinned en premier
 */
function ensurePinnedColumnsFirst(order: string[], columns: ColumnConfig[]): string[] {
  const pinnedKeys = columns.filter(c => c.pinned).map(c => c.key as string);
  const unpinnedKeys = order.filter(key => !pinnedKeys.includes(key));
  return [...pinnedKeys, ...unpinnedKeys];
}

/**
 * Composant principal du tableau d'APs avec filtrage, tri, pagination.
 * 
 * Features:
 * - Colonnes pinned sticky (Vendor, Model)
 * - Filtrage multi-valeurs avec checkboxes
 * - Tri par colonne
 * - Recherche globale
 * - Pagination
 * - Sélection pour comparaison (max 4)
 * - Configuration des colonnes (show/hide, reorder)
 */
export default function TableView({
  machines,
  selectedIds,
  onClearSelection,
  onGoToCompare,
}: Props) {
  // Search & Filters
  const [globalSearch, setGlobalSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({});
  
  // Sorting
  const [sortBy, setSortBy] = useState<keyof APMachine | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  
  // Selection mode
  const [selectionMode, setSelectionMode] = useState(false);
  
  // Column settings
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [openFilters, setOpenFilters] = useState<Set<string>>(new Set());
  const [dropdownPosition, setDropdownPosition] = useState<{top: number, left: number} | null>(null);
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);
  const filterButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_VISIBLE_COLUMNS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Vérifier si les colonnes sauvegardées correspondent aux colonnes actuelles
        const currentKeys = defaultColumns.map(c => c.key as string);
        const allKeysExist = parsed.every((key: string) => currentKeys.includes(key));
        if (allKeysExist) {
          return parsed;
        }
      } catch {
        // Si erreur de parsing, réinitialiser
      }
    }
    // Par défaut : toutes les colonnes visibles
    return defaultColumns.map(c => c.key as string);
  });
  const [columnOrder, setColumnOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_COLUMN_ORDER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Vérifier si l'ordre sauvegardé correspond aux colonnes actuelles
        const currentKeys = defaultColumns.map(c => c.key as string);
        const allKeysExist = parsed.every((key: string) => currentKeys.includes(key));
        if (allKeysExist && parsed.length === currentKeys.length) {
          // Forcer les colonnes pinnées en premier
          return ensurePinnedColumnsFirst(parsed, defaultColumns);
        }
      } catch {
        // Si erreur de parsing, réinitialiser
      }
    }
    // Par défaut : ordre défini dans columns.ts (colonnes pinnées déjà en premier)
    return defaultColumns.map(c => c.key as string);
  });

  // Ensure column order is always correct with pinned columns first
  const validatedColumnOrder = useMemo(() => 
    ensurePinnedColumnsFirst(columnOrder, defaultColumns),
    [columnOrder]
  );

  // Save visible columns and order to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VISIBLE_COLUMNS, JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COLUMN_ORDER, JSON.stringify(validatedColumnOrder));
  }, [validatedColumnOrder]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Ne pas fermer si on clique sur l'icône de filtre ou à l'intérieur du dropdown
      if (!target.closest('.th-filter') && !target.closest('.th-filter-icon')) {
        setOpenFilters(new Set());
        setDropdownPosition(null);
        setActiveFilterColumn(null);
      }
    };

    if (openFilters.size > 0) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openFilters]);

  // Filter machines
  const filteredMachines = useMemo(() => {
    let filtered = machines;

    // Global search
    if (globalSearch) {
      const query = globalSearch.toLowerCase();
      filtered = filtered.filter(m =>
        Object.values(m).some(val =>
          val !== null && val !== undefined && String(val).toLowerCase().includes(query)
        )
      );
    }

    // Column filters
    Object.entries(columnFilters).forEach(([key, filterState]) => {
      const { search, selectedValues } = filterState;
      
      // Si des valeurs sont sélectionnées, filtrer sur ces valeurs uniquement
      if (selectedValues.size > 0) {
        filtered = filtered.filter(m => {
          const fieldValue = m[key as keyof APMachine];
          const strValue = String(fieldValue || '').trim();
          return selectedValues.has(strValue);
        });
      }
      // Sinon, appliquer le filtre de recherche texte
      else if (search) {
        const filterQuery = search.toLowerCase();
        filtered = filtered.filter(m => {
          const fieldValue = m[key as keyof APMachine];
          return fieldValue !== null &&
            fieldValue !== undefined &&
            String(fieldValue).toLowerCase().includes(filterQuery);
        });
      }
    });

    return filtered;
  }, [machines, globalSearch, columnFilters]);

  // Sort machines
  const sortedMachines = useMemo(() => {
    if (!sortBy) return filteredMachines;

    return [...filteredMachines].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredMachines, sortBy, sortOrder]);

  // Paginate
  const paginatedMachines = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return sortedMachines.slice(start, start + perPage);
  }, [sortedMachines, currentPage, perPage]);

  const totalPages = Math.ceil(sortedMachines.length / perPage);

  // Handlers
  const handleSort = (key: keyof APMachine) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleColumnFilterChange = (key: string, search: string, selectedValues: Set<string>) => {
    setColumnFilters(prev => {
      // Si ni recherche ni valeurs sélectionnées, supprimer le filtre
      if (!search && selectedValues.size === 0) {
        const newFilters = { ...prev };
        delete newFilters[key];
        return newFilters;
      }
      return { 
        ...prev, 
        [key]: { search, selectedValues } 
      };
    });
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setGlobalSearch('');
    setColumnFilters({});
    setCurrentPage(1);
  };

  const hasActiveFilters = globalSearch || Object.values(columnFilters).some(
    f => f.search || f.selectedValues.size > 0
  );


  const handleSaveColumnSettings = (newVisibleColumns: string[], newColumnOrder: string[]) => {
    setVisibleColumns(newVisibleColumns);
    setColumnOrder(newColumnOrder);
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };

  const exportCSV = () => {
    // Exporter les machines filtrées avec les colonnes visibles
    const headers = orderedColumns.map(c => c.label).join(',');
    const rows = sortedMachines.map(m =>
      orderedColumns.map(c => {
        const val = m[c.key];
        const formatted = formatValue(val);
        return `"${formatted.replace(/"/g, '""')}"`;
      }).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    a.href = url;
    a.download = `ap-catalog-${timestamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get ordered and filtered columns
  const orderedColumns = validatedColumnOrder
    .map(key => defaultColumns.find(c => c.key === key))
    .filter((c): c is ColumnConfig => c !== undefined && visibleColumns.includes(c.key));

  return (
    <div className="table-view">
      {/* Toolbar */}
      <div className="table-toolbar">
        <div className="table-toolbar-left">
          <SearchInput
            placeholder="Search all fields..."
            value={globalSearch}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setGlobalSearch(e.target.value);
              setCurrentPage(1);
            }}
            onClear={() => {
              setGlobalSearch('');
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="table-toolbar-right">
          <Button
            variant="secondary"
            size="sm"
            icon={<IconDownload size={16} />}
            onClick={exportCSV}
            title={`Export ${sortedMachines.length} APs to CSV`}
          >
            Export CSV
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<IconSettings size={16} />}
            onClick={() => setShowColumnSettings(true)}
            title="Column settings"
          >
            Columns
          </Button>

          {hasActiveFilters && (
            <Button
              variant="secondary"
              size="sm"
              icon={<IconClear size={16} />}
              onClick={clearAllFilters}
              title="Clear all filters"
            >
              Clear Filters
            </Button>
          )}

          {!selectionMode && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectionMode(true)}
              title="Enable selection mode"
            >
              Select
            </Button>
          )}

          {selectionMode && selectedIds.size > 0 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onClearSelection();
                  setSelectionMode(false);
                }}
                title="Deselect all"
              >
                Deselect All
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={onGoToCompare}
                title={`Compare ${selectedIds.size} APs`}
              >
                Compare ({selectedIds.size})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="table-container">
        <table className="ap-table">
          <thead>
            <tr>
              {orderedColumns.map((column) => {
                const width = column.pinned && column.width ? `${column.width}px` : undefined;
                return (
                <th
                  key={column.key}
                  className={column.pinned ? 'column-pinned' : ''}
                  style={width ? { width, minWidth: width, maxWidth: width } : undefined}
                >
                  <div className="th-content">
                    {column.filterable && (
                      <button
                        className={`th-filter-icon ${
                          columnFilters[column.key] && 
                          (columnFilters[column.key].search || columnFilters[column.key].selectedValues.size > 0)
                            ? 'th-filter-icon--active' 
                            : ''
                        }`}
                        ref={(el) => {
                          if (el) filterButtonRefs.current.set(column.key, el);
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          const button = e.currentTarget;
                          const rect = button.getBoundingClientRect();
                          
                          setOpenFilters(prev => {
                            const newSet = new Set(prev);
                            if (newSet.has(column.key)) {
                              newSet.delete(column.key);
                              setDropdownPosition(null);
                              setActiveFilterColumn(null);
                            } else {
                              newSet.clear(); // Fermer les autres dropdowns
                              newSet.add(column.key);
                              // Calculer la position du dropdown
                              const isMobile = window.innerWidth < 480;
                              
                              if (isMobile) {
                                // Sur mobile : centré comme un popup
                                setDropdownPosition({
                                  top: -1, // Valeur spéciale pour indiquer le mode mobile
                                  left: -1
                                });
                              } else {
                                // Sur desktop/tablette : sous le bouton
                                setDropdownPosition({
                                  top: rect.bottom + window.scrollY,
                                  left: rect.left + window.scrollX
                                });
                              }
                              setActiveFilterColumn(column.key);
                            }
                            return newSet;
                          });
                        }}
                        title={`Filter ${column.label}`}
                      >
                        <IconFilter size={14} />
                      </button>
                    )}
                    <button
                      className="th-sort-button"
                      onClick={() => column.sortable && handleSort(column.key)}
                      disabled={!column.sortable}
                    >
                      <span>{column.label}</span>
                      {column.sortable && sortBy === column.key && (
                        <IconSort
                          size={14}
                          direction={sortOrder === 'asc' ? 'up' : 'down'}
                        />
                      )}
                    </button>
                  </div>
                </th>
                );
              })}
            </tr>
          </thead>
          
          <tbody>
            {paginatedMachines.map((machine) => {
              const rowKey = machine.id;
              
              return (
                <tr key={rowKey} className="tr">
                  {orderedColumns.map((column) => {
                    const value = machine[column.key];
                    const displayValue = value !== undefined && value !== null ? String(value) : '—';
                    
                    return (
                      <td key={column.key} className="td">
                        <div className="td-content">
                          {displayValue}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Dropdown affiché en dehors du tableau pour éviter les avertissements de validation DOM */}
      {activeFilterColumn && dropdownPosition && (() => {
        const column = orderedColumns.find(c => c.key === activeFilterColumn);
        if (!column) return null;
        
        const isMobilePopup = dropdownPosition.top === -1;
        
        return (
          <>
            {/* Overlay mobile */}
            {isMobilePopup && (
              <div 
                className="th-filter-overlay"
                onClick={() => {
                  setActiveFilterColumn(null);
                  setDropdownPosition(null);
                  setOpenFilters(new Set());
                }}
              />
            )}
            <div 
              className={`th-filter ${isMobilePopup ? 'th-filter--mobile' : ''}`}
              style={isMobilePopup ? {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 100000
              } : {
                position: 'fixed',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                zIndex: 99999
              }}
            >
            <FilterDropdown
              columnLabel={column.label}
              searchValue={columnFilters[activeFilterColumn]?.search || ''}
              selectedValues={columnFilters[activeFilterColumn]?.selectedValues || new Set()}
              availableValues={getUniqueColumnValues(machines, activeFilterColumn)}
              onSearchChange={(search) => {
                const currentFilter = columnFilters[activeFilterColumn] || { search: '', selectedValues: new Set() };
                handleColumnFilterChange(activeFilterColumn, search, currentFilter.selectedValues);
              }}
              onValuesChange={(selectedValues) => {
                const currentFilter = columnFilters[activeFilterColumn] || { search: '', selectedValues: new Set() };
                handleColumnFilterChange(activeFilterColumn, currentFilter.search, selectedValues);
              }}
              onApply={() => {
                setActiveFilterColumn(null);
                setDropdownPosition(null);
                setOpenFilters(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(activeFilterColumn);
                  return newSet;
                });
              }}
              onClear={() => {
                handleColumnFilterChange(activeFilterColumn, '', new Set());
                setActiveFilterColumn(null);
                setDropdownPosition(null);
                setOpenFilters(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(activeFilterColumn);
                  return newSet;
                });
              }}
            />
          </div>
          </>
        );
      })()}

      {/* Pagination */}
      <div className="table-pagination">
        <div className="pagination-info">
          Showing {sortedMachines.length === 0 ? 0 : (currentPage - 1) * perPage + 1} to{' '}
          {Math.min(currentPage * perPage, sortedMachines.length)} of {sortedMachines.length} APs
        </div>

        <div className="pagination-controls">
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="per-page-select"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>

          <div className="pagination-buttons">
            <Button
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <span className="pagination-current">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      </div>

      {/* Column Settings Modal */}
      {showColumnSettings && (
        <ColumnSettingsModal
          columns={defaultColumns}
          visibleColumns={visibleColumns}
          columnOrder={columnOrder}
          onSave={handleSaveColumnSettings}
          onClose={() => setShowColumnSettings(false)}
        />
      )}
    </div>
  );
}
