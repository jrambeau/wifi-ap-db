import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { columns } from '../../src/config/columns';
import type { APMachine } from '../../src/types';

describe('Column widths validation', () => {
  // Fonction pour estimer la largeur en pixels
  function estimateTextWidth(text: string, isBold = false): number {
    if (!text) return 0;
    // Approximation: ~8px par caractère pour texte normal, ~9px pour bold
    const charWidth = isBold ? 9 : 8;
    return text.length * charWidth;
  }

  it('all column widths should be sufficient for their content', () => {
    console.log('[TEST WIDTH] Starting column width validation');
    
    // Lire les données réelles
    const machinesPath = join(__dirname, '../../public/data/machines.json');
    const machines: APMachine[] = JSON.parse(readFileSync(machinesPath, 'utf-8'));
    console.log(`[TEST WIDTH] Loaded ${machines.length} machines`);

    const issues: string[] = [];

    columns.forEach(column => {
      // Largeur du titre (en gras) + icônes + padding (60px)
      const titleWidth = estimateTextWidth(column.label, true) + 60;
      
      // Largeur maximale du contenu
      let maxContentWidth = 0;
      let longestValue = '';
      
      machines.forEach(machine => {
        const value = machine[column.key as keyof APMachine];
        if (value !== undefined && value !== null) {
          const valueStr = String(value);
          const width = estimateTextWidth(valueStr);
          if (width > maxContentWidth) {
            maxContentWidth = width;
            longestValue = valueStr;
          }
        }
      });

      // Padding pour les cellules du tableau (environ 24px)
      const requiredWidth = Math.max(titleWidth, maxContentWidth + 24);
      const currentWidth = column.width || 150;

      console.log(`[TEST WIDTH] ${column.key}:`);
      console.log(`  Title width: ${titleWidth}px`);
      console.log(`  Max content width: ${maxContentWidth}px (value: "${longestValue.substring(0, 50)}")`);
      console.log(`  Required: ${requiredWidth}px, Current: ${currentWidth}px`);

      if (currentWidth < requiredWidth) {
        const message = `Column "${column.key}" width (${currentWidth}px) is too small. Required: ${requiredWidth}px (longest: "${longestValue.substring(0, 50)}")`;
        console.log(`  ❌ ${message}`);
        issues.push(message);
      } else {
        console.log(`  ✅ OK`);
      }
    });

    console.log(`[TEST WIDTH] Validation complete. Issues found: ${issues.length}`);
    
    if (issues.length > 0) {
      console.log('\n[TEST WIDTH] Issues:');
      issues.forEach(issue => console.log(`  - ${issue}`));
    }

    expect(issues).toEqual([]);
  }, 30000);

  it('generation column should be at least 212px wide', () => {
    console.log('[TEST WIDTH GENERATION] Checking generation column width');
    
    const generationColumn = columns.find(col => col.key === 'generation');
    expect(generationColumn).toBeDefined();
    
    console.log(`[TEST WIDTH GENERATION] Generation column width: ${generationColumn?.width}px`);
    expect(generationColumn?.width).toBeGreaterThanOrEqual(212);
    
    console.log('[TEST WIDTH GENERATION] ✅ Generation column width is sufficient');
  });

  it('all non-pinned columns should have a defined width', () => {
    console.log('[TEST WIDTH DEFINED] Checking non-pinned columns have defined widths');

    // Les colonnes pinnées (Vendor, Model) se dimensionnent au contenu
    // (table-layout: auto) et n'ont donc volontairement pas de largeur fixe.
    const columnsWithoutWidth = columns.filter(col => !col.pinned && !col.width);

    console.log(`[TEST WIDTH DEFINED] Columns without width: ${columnsWithoutWidth.length}`);
    
    if (columnsWithoutWidth.length > 0) {
      console.log('[TEST WIDTH DEFINED] Missing widths for:');
      columnsWithoutWidth.forEach(col => console.log(`  - ${col.key}`));
    }
    
    expect(columnsWithoutWidth).toEqual([]);
    console.log('[TEST WIDTH DEFINED] ✅ All columns have defined widths');
  });

  it('column widths should be between reasonable limits (100-800px)', () => {
    console.log('[TEST WIDTH LIMITS] Checking column width limits');
    
    const outOfBounds = columns.filter(col => {
      // Colonnes auto-dimensionnées (pinnées) : pas de largeur fixe à borner.
      if (col.width == null) return false;
      return col.width < 100 || col.width > 800;
    });
    
    console.log(`[TEST WIDTH LIMITS] Columns out of bounds: ${outOfBounds.length}`);
    
    if (outOfBounds.length > 0) {
      console.log('[TEST WIDTH LIMITS] Out of bounds:');
      outOfBounds.forEach(col => {
        console.log(`  - ${col.key}: ${col.width}px`);
      });
    }
    
    expect(outOfBounds).toEqual([]);
    console.log('[TEST WIDTH LIMITS] ✅ All widths within limits');
  });
});
