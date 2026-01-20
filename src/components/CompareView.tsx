import type { APMachine } from '../types';
import { columns } from '../config/columns';
import { Button } from '../components/ui';
import { IconArrowLeft, IconDownload, IconClose } from '../components/icons';
import './CompareView.css';

/**
 * Props pour le composant CompareView
 */
interface Props {
  machines: APMachine[];
  onRemove: (id: string) => void;
  onBack: () => void;
}

/**
 * Composant de comparaison côte-à-côte d'APs (max 4).
 * Design inspiré des comparateurs Apple : épuré, aéré, avec hover de ligne complète.
 * 
 * Features:
 * - Affichage en colonnes des APs sélectionnés
 * - Ligne de features (label) sticky à gauche avec ombre
 * - Croix de suppression en haut à droite de chaque colonne
 * - Hover synchronisé sur toute la ligne horizontale
 * - Export CSV de la comparaison
 */
export default function CompareView({ machines, onRemove, onBack }: Props) {
  if (machines.length === 0) {
    return (
      <div className="compare-view">
        <div className="compare-header">
          <Button
            variant="ghost"
            icon={<IconArrowLeft size={20} />}
            onClick={onBack}
          >
            Back to Table
          </Button>
        </div>
        <div className="empty-state">
          <h2>No APs selected for comparison</h2>
          <p>Go back to the table and select up to 4 APs to compare</p>
        </div>
      </div>
    );
  }

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };

  const exportCSV = () => {
    const headers = columns.map(c => c.label).join(',');
    const rows = machines.map(m =>
      columns.map(c => {
        const val = m[c.key];
        const formatted = formatValue(val);
        return `"${formatted.replace(/"/g, '""')}"`;
      }).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ap-comparison-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="compare-view">
      <div className="compare-header">
        <Button
          variant="ghost"
          icon={<IconArrowLeft size={20} />}
          onClick={onBack}
        >
          Back to Table
        </Button>
        <h2>Compare Access Points ({machines.length}/4)</h2>
        <Button
          variant="secondary"
          icon={<IconDownload size={16} />}
          onClick={exportCSV}
        >
          Export CSV
        </Button>
      </div>

      <div className="compare-container">
        <div className="compare-grid">
          <div className="compare-labels">
            <div className="label-header">Feature</div>
            {columns.map((col, idx) => (
              <div key={String(col.key)} className="label-cell" data-row={idx}>
                {col.label}
              </div>
            ))}
          </div>

          {machines.map(machine => (
            <div key={machine.id} className="compare-column">
              <div className="column-header">
                <button
                  className="remove-button"
                  onClick={() => onRemove(machine.id)}
                  title="Remove from comparison"
                  aria-label="Remove from comparison"
                >
                  <IconClose size={16} />
                </button>
                <div className="column-header-content">
                  <div className="machine-info">
                    <div className="machine-model">{machine.model}</div>
                    <div className="machine-vendor">{machine.vendor}</div>
                  </div>
                </div>
              </div>
              {columns.map((col, idx) => (
                <div key={String(col.key)} className="value-cell" data-row={idx}>
                  {formatValue(machine[col.key])}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
