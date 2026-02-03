import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Button CSS hover rules', () => {
  it('should contain hover color black for buttons', () => {
    const cssPath = resolve(process.cwd(), 'src/components/ui/Button.css');
    const css = readFileSync(cssPath, 'utf8');

    // Ensure base hover has black text
    expect(css).toMatch(/\.ui-button:hover[^}]*color:\s*#000/);

    // Ensure primary, ghost and danger variants also set color to #000 on hover
    expect(css).toMatch(/\.ui-button--primary:hover[^}]*color:\s*#000/);
    expect(css).toMatch(/\.ui-button--ghost:hover[^}]*color:\s*#000/);
    expect(css).toMatch(/\.ui-button--danger:hover[^}]*color:\s*#000/);
  });
});
