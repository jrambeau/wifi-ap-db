import { useState, useEffect } from 'react';
import type { APMachine } from './types';
import TableView from './components/TableView';
import CompareView from './components/CompareView';
import { FontSizeControl, InfoModal } from './components/ui';
import { IconHelp } from './components/icons';
import Button from './components/ui/Button';
import './App.css';

type ViewMode = 'table' | 'compare';

/**
 * Composant principal de l'application Wi-Fi Access Point Database.
 * 
 * Gère:
 * - Navigation entre la vue tableau et la vue comparaison
 * - État de sélection des APs (max 4 pour comparaison)
 * - Chargement des données depuis machines.json
 * 
 * @returns Application principale
 */
function App() {
  const [machines, setMachines] = useState<APMachine[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [showInfoModal, setShowInfoModal] = useState(false);

  useEffect(() => {
    // Load machines data
    // Utilise import.meta.env.BASE_URL pour supporter GitHub Pages
    const dataPath = `${import.meta.env.BASE_URL}data/machines.json`;
    fetch(dataPath)
      .then(res => res.json())
      .then(data => {
        setMachines(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load machines:', err);
        setLoading(false);
      });
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else if (newSet.size < 4) {
        newSet.add(id);
      } else {
        alert('Maximum 4 APs can be selected for comparison');
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const goToCompare = () => {
    setViewMode('compare');
  };

  const goToTable = () => {
    setViewMode('table');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading AP Catalog...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-content">
          <div className="app-title-container">
            <h1 className="app-title">Wi-Fi Access Point Database</h1>
          </div>
          <div className="app-header-actions">
            <FontSizeControl />
            <Button
              variant="ghost"
              icon={<IconHelp size={18} />}
              onClick={() => setShowInfoModal(true)}
              aria-label="About and information"
            />
          </div>
        </div>
      </header>

      <main className="app-main">
        {viewMode === 'table' ? (
          <TableView
            machines={machines}
            selectedIds={selectedIds}
            onToggleSelection={toggleSelection}
            onClearSelection={clearSelection}
            onGoToCompare={goToCompare}
          />
        ) : (
          <CompareView
            machines={machines.filter(m => selectedIds.has(m.id))}
            onRemove={(id) => toggleSelection(id)}
            onBack={goToTable}
          />
        )}
      </main>

      {showInfoModal && <InfoModal onClose={() => setShowInfoModal(false)} />}
    </div>
  );
}

export default App;

