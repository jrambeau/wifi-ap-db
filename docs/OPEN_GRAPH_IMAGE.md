# Instructions pour créer l'image Open Graph

## Méthode 1 : Screenshot du site (recommandé)

1. Ouvre ton site : https://ap.networkjon.fr
2. Ajuste la fenêtre du navigateur à **1200x630px** (utilise les DevTools)
3. Prends une capture d'écran propre
4. Sauvegarde comme `og-image.png` dans `/public/`
5. Rebuild et push

## Méthode 2 : Créer avec Figma/Canva

**Dimensions** : 1200 x 630 pixels (ratio 1.91:1)

**Contenu suggéré** :
```
┌──────────────────────────────────────┐
│                                      │
│      📡 Wi-Fi AP Database            │
│      by Jonathan Rambeau             │
│                                      │
│      105 Access Points               │
│      33 Specifications               │
│      Compare up to 4 APs             │
│                                      │
└──────────────────────────────────────┘
```

**Style** :
- Background : Gradient (#667eea → #764ba2) ou photo de WiFi AP
- Texte : Gros titre, subtitle, stats
- Logo ou icône WiFi

## Méthode 3 : Template HTML → Image

Si tu as Node.js avec Puppeteer :

```bash
npm install -D puppeteer
```

Crée `scripts/generate-og-image.js` :
```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          width: 1200px;
          height: 630px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Arial, sans-serif;
        }
        .card {
          background: white;
          border-radius: 24px;
          padding: 80px;
          text-align: center;
        }
        h1 {
          font-size: 72px;
          margin: 0 0 20px 0;
          color: #1a202c;
        }
        .subtitle {
          font-size: 32px;
          color: #718096;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>📡 Wi-Fi AP Database</h1>
        <div class="subtitle">by Jonathan Rambeau</div>
      </div>
    </body>
    </html>
  `);
  await page.screenshot({ path: 'public/og-image.png' });
  await browser.close();
})();
```

Puis :
```bash
node scripts/generate-og-image.js
```

## Placeholder temporaire

Pour l'instant, j'ai créé un placeholder. Tu peux le remplacer plus tard avec une vraie capture d'écran.

## Tester l'image

Une fois l'image créée :

1. **Commit et push** (le déploiement se fait ensuite automatiquement via CI) :
   ```bash
   git add public/og-image.png
   git commit -m "feat: Add Open Graph preview image"
   git push origin main
   ```

2. **Tester l'aperçu** sur :
   - [Facebook Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

3. Entre ton URL : `https://ap.networkjon.fr`

## Notes importantes

- **Taille recommandée** : 1200x630px (ratio 1.91:1)
- **Format** : PNG ou JPG
- **Poids max** : < 8MB (idéalement < 1MB)
- **Les changements peuvent prendre 24h** pour être reflétés par les caches des réseaux sociaux
