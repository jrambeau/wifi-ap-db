import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CompareView from '../../src/components/CompareView';

describe('CompareView', () => {
  it('renders empty state when no machines are selected', () => {
    render(
      <CompareView machines={[]} onRemove={() => {}} onBack={() => {}} />
    );
    
    expect(screen.getByText(/no aps selected/i)).toBeInTheDocument();
  });
});
