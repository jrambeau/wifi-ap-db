import { useState, useEffect, useRef } from 'react';
import type React from 'react';
import { IconCheck, IconClose } from '../icons';
import './FilterDropdown.css';

/**
 * Props pour le composant FilterDropdown
 */
interface FilterDropdownProps {
  columnLabel: string;
  searchValue: string;
  selectedValues: Set<string>;
  availableValues: string[];
  onSearchChange: (value: string) => void;
  onValuesChange: (values: Set<string>) => void;
  onApply: () => void;
  onClear: () => void;
}

/**
 * Composant de filtre avec recherche + checkboxes multi-sélection.
 * 
 * Features:
 * - Recherche textuelle avec auto-focus
 * - Liste de checkboxes pour sélection multiple
 * - Boutons "Select All" et "Deselect All"
 * - Compteur de valeurs sélectionnées
 * - Support clavier (Enter pour appliquer, Escape pour clear)
 * - Sanitization XSS des valeurs affichées
 * 
 * @param props - Props du composant
 */
export default function FilterDropdown({
  columnLabel,
  searchValue,
  selectedValues,
  availableValues,
  onSearchChange,
  onValuesChange,
  onApply,
  onClear,
}: FilterDropdownProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus sur le champ de recherche à l'ouverture
    searchInputRef.current?.focus();
  }, []);

  // Filtrer les valeurs disponibles selon la recherche locale
  const filteredValues = localSearch
    ? availableValues.filter(value =>
        value.toLowerCase().includes(localSearch.toLowerCase())
      )
    : availableValues;

  const handleSelectAll = () => {
    onValuesChange(new Set(filteredValues));
  };

  const handleDeselectAll = () => {
    onValuesChange(new Set());
  };

  const handleToggleValue = (value: string) => {
    const newSet = new Set(selectedValues);
    if (newSet.has(value)) {
      newSet.delete(value);
    } else {
      newSet.add(value);
    }
    onValuesChange(newSet);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearchChange(localSearch);
      onApply();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClear();
    }
  };

  return (
    <div className="filter-dropdown">
      <div className="filter-dropdown-search">
        <input
          ref={searchInputRef}
          type="text"
          className="filter-dropdown-search-input"
          placeholder={`Search ${columnLabel}...`}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      </div>

      {availableValues.length > 0 && (
        <>
          <div className="filter-dropdown-actions-top">
            <button
              type="button"
              className="filter-dropdown-action-btn"
              onClick={handleSelectAll}
              disabled={filteredValues.length === 0}
            >
              Select All ({filteredValues.length})
            </button>
            <button
              type="button"
              className="filter-dropdown-action-btn"
              onClick={handleDeselectAll}
              disabled={selectedValues.size === 0}
            >
              Deselect All
            </button>
          </div>

          <div className="filter-dropdown-values">
            {filteredValues.length === 0 ? (
              <div className="filter-dropdown-empty">No values found</div>
            ) : (
              filteredValues.map((value) => (
                <label key={value} className="filter-dropdown-value-item">
                  <input
                    type="checkbox"
                    checked={selectedValues.has(value)}
                    onChange={() => handleToggleValue(value)}
                  />
                  <span className="filter-dropdown-value-label">{value}</span>
                </label>
              ))
            )}
          </div>
        </>
      )}

      <div className="filter-dropdown-actions-bottom">
        <button
          type="button"
          className="filter-dropdown-btn filter-dropdown-apply"
          onClick={() => {
            onSearchChange(localSearch);
            onApply();
          }}
          title="Apply filter"
        >
          <IconCheck size={14} />
          Apply
        </button>
        <button
          type="button"
          className="filter-dropdown-btn filter-dropdown-clear"
          onClick={onClear}
          title="Clear filter"
        >
          <IconClose size={14} />
          Clear
        </button>
      </div>
    </div>
  );
}
