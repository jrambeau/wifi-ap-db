import { useEffect, useState } from 'react';
import Button from './Button';
import { IconTextSize } from '../icons';
import './FontSizeControl.css';

const DEFAULT_LEVEL = 0; // Niveau par défaut (0 = taille normale)
const MIN_LEVEL = -2;    // Minimum: -2 niveaux
const MAX_LEVEL = 2;     // Maximum: +2 niveaux
const STORAGE_KEY = 'ap-catalog-font-size-level';

// Mapping des niveaux vers les tailles de police en pixels
const FONT_SIZE_MAP: Record<number, number> = {
  '-2': 12,  // Très petit
  '-1': 13,  // Petit
  '0': 14,   // Normal (défaut)
  '1': 15,   // Grand
  '2': 16,   // Très grand
};

/**
 * Contrôle de la taille de police globale de l'application.
 * Permet d'ajuster de -2 à +2 niveaux par rapport à la taille par défaut.
 * La préférence est sauvegardée dans localStorage.
 */
export default function FontSizeControl() {
  const [level, setLevel] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      // Valider que c'est dans les limites
      if (parsed >= MIN_LEVEL && parsed <= MAX_LEVEL) {
        return parsed;
      }
    }
    return DEFAULT_LEVEL;
  });

  useEffect(() => {
    const fontSize = FONT_SIZE_MAP[level];
    document.documentElement.style.fontSize = `${fontSize}px`;
    localStorage.setItem(STORAGE_KEY, level.toString());
  }, [level]);

  const decrease = () => {
    if (level > MIN_LEVEL) {
      setLevel(level - 1);
    }
  };

  const increase = () => {
    if (level < MAX_LEVEL) {
      setLevel(level + 1);
    }
  };

  const reset = () => {
    setLevel(DEFAULT_LEVEL);
  };

  const canDecrease = level > MIN_LEVEL;
  const canIncrease = level < MAX_LEVEL;

  return (
    <div className="font-size-control">
      <Button
        size="sm"
        variant="ghost"
        onClick={decrease}
        disabled={!canDecrease}
        aria-label="Decrease font size"
        title={`Reduce text size (${level > MIN_LEVEL ? level - 1 : level})`}
      >
        A−
      </Button>
      <Button
        size="sm"
        variant="ghost"
        icon={<IconTextSize size={16} />}
        onClick={reset}
        aria-label="Reset font size"
        title="Reset to default size"
      />
      <Button
        size="sm"
        variant="ghost"
        onClick={increase}
        disabled={!canIncrease}
        aria-label="Increase font size"
        title={`Increase text size (${level < MAX_LEVEL ? level + 1 : level})`}
      >
        A+
      </Button>
    </div>
  );
}
