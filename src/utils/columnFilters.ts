import type { APMachine } from '../types';

/**
 * Extrait les valeurs uniques d'une colonne depuis les données machines
 * @param machines - Tableau des machines
 * @param columnKey - Clé de la colonne
 * @returns Tableau trié des valeurs uniques (sans les valeurs vides)
 */
export function getUniqueColumnValues(machines: APMachine[], columnKey: keyof APMachine): string[] {
  const uniqueValuesMap = new Map<string, string>();
  
  machines.forEach(machine => {
    const value = machine[columnKey];
    // Ignorer les valeurs null, undefined ou chaînes vides
    if (value != null && String(value).trim() !== '') {
      const trimmedValue = String(value).trim();
      const lowerKey = trimmedValue.toLowerCase();
      // Ne garder que la première occurrence (en préservant sa casse originale)
      if (!uniqueValuesMap.has(lowerKey)) {
        uniqueValuesMap.set(lowerKey, trimmedValue);
      }
    }
  });
  
  // Convertir en tableau et trier
  return Array.from(uniqueValuesMap.values()).sort((a, b) => 
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
}

/**
 * Filtre les machines selon une colonne donnée.
 * Priorité : les valeurs sélectionnées (checkboxes) priment sur la recherche textuelle.
 * 
 * Logique:
 * 1. Si selectedValues non vide : filtre par valeurs exactes (OR)
 * 2. Sinon, si searchText non vide : filtre par recherche textuelle (LIKE, case-insensitive)
 * 3. Sinon : retourne toutes les machines
 * 
 * @param machines - Liste des machines à filtrer
 * @param columnKey - Clé de la colonne
 * @param searchText - Texte de recherche (optionnel)
 * @param selectedValues - Valeurs sélectionnées via checkboxes
 * @returns Machines filtrées
 * 
 * @example
 * const filtered = filterMachinesByColumn(
 *   machines,
 *   'vendor',
 *   '',
 *   new Set(['Cisco', 'Aruba'])
 * );
 */
export function filterMachinesByColumn(
  machines: APMachine[],
  columnKey: keyof APMachine,
  searchText: string,
  selectedValues?: Set<string>
): APMachine[] {
  return machines.filter(machine => {
    const value = String(machine[columnKey] || '').trim();
    
    // Si des valeurs sont sélectionnées, filtrer uniquement sur ces valeurs
    if (selectedValues && selectedValues.size > 0) {
      return selectedValues.has(value);
    }
    
    // Sinon, filtrer sur le texte de recherche
    if (searchText) {
      return value.toLowerCase().includes(searchText.toLowerCase());
    }
    
    // Pas de filtre actif
    return true;
  });
}
