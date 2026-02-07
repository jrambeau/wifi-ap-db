import { writeFileSync, copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const docsDir = resolve(process.cwd(), 'docs');
const publicDir = resolve(process.cwd(), 'public');

console.log('🔨 Post-build processing...\n');

try {
  // Créer le fichier .nojekyll si nécessaire
  const nojekyllPath = resolve(docsDir, '.nojekyll');
  if (!existsSync(nojekyllPath)) {
    writeFileSync(nojekyllPath, '', 'utf-8');
    console.log('✅ Fichier .nojekyll créé');
  }
  
  // Copier CNAME si présent dans public/
  const cnameSrc = resolve(publicDir, 'CNAME');
  const cnameDest = resolve(docsDir, 'CNAME');
  if (existsSync(cnameSrc)) {
    copyFileSync(cnameSrc, cnameDest);
    console.log('✅ Fichier CNAME copié');
  }
  
  console.log('✅ Post-build terminé avec succès !\n');
  
} catch (error) {
  console.error('❌ Erreur lors du post-build:', error.message);
  process.exit(1);
}
