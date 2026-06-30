#!/usr/bin/env node

/**
 * Génère les déclinaisons PNG du logo et les favicons à partir de public/logo.svg.
 *
 * Sortie :
 *  - branding/logo.svg            : copie du vecteur maître (archive réutilisable)
 *  - branding/logo-<size>.png     : PNG transparents (16,32,48,64,128,180,256,512)
 *  - public/favicon.ico           : favicon multi-tailles (PNG-in-ICO : 16,32,48)
 *  - public/apple-touch-icon.png  : 180x180 pour iOS
 *
 * Usage : node scripts/generate-logo-assets.js
 * Prérequis : navigateur Chromium de Playwright (npx playwright install chromium)
 */

import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs';
import { resolve } from 'path';

const root = resolve(process.cwd());
const svgPath = resolve(root, 'public/logo.svg');
const brandingDir = resolve(root, 'branding');
const publicDir = resolve(root, 'public');

const SIZES = [16, 32, 48, 64, 128, 180, 256, 512];

mkdirSync(brandingDir, { recursive: true });

const svg = readFileSync(svgPath, 'utf8');
copyFileSync(svgPath, resolve(brandingDir, 'logo.svg'));

async function renderPng(browser, size) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(
    `<!doctype html><meta charset="utf-8">
     <style>html,body{margin:0;padding:0;background:transparent}
     svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
    { waitUntil: 'networkidle' }
  );
  const el = await page.$('svg');
  const buf = await el.screenshot({ omitBackground: true });
  await page.close();
  return buf;
}

/** Assemble un .ico (PNG-in-ICO) à partir de buffers PNG. */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = icon
  header.writeUInt16LE(entries.length, 4);

  const dir = [];
  const images = [];
  let offset = 6 + entries.length * 16;

  for (const { size, png } of entries) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset
    offset += png.length;
    dir.push(entry);
    images.push(png);
  }

  return Buffer.concat([header, ...dir, ...images]);
}

const browser = await chromium.launch();
try {
  const pngBySize = {};
  for (const size of SIZES) {
    const buf = await renderPng(browser, size);
    pngBySize[size] = buf;
    writeFileSync(resolve(brandingDir, `logo-${size}.png`), buf);
    console.log(`✅ branding/logo-${size}.png`);
  }

  writeFileSync(resolve(publicDir, 'apple-touch-icon.png'), pngBySize[180]);
  console.log('✅ public/apple-touch-icon.png (180)');

  const ico = buildIco([
    { size: 16, png: pngBySize[16] },
    { size: 32, png: pngBySize[32] },
    { size: 48, png: pngBySize[48] },
  ]);
  writeFileSync(resolve(publicDir, 'favicon.ico'), ico);
  console.log('✅ public/favicon.ico (16/32/48)');
} finally {
  await browser.close();
}

console.log('\n✨ Assets logo générés.');
