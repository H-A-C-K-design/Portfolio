import sharp from '../node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'd:/POrtfolio/public/assets/images/t001-nova';
const srcFile = 'd:/POrtfolio/DG image/WhatsApp Image 2026-11-02 at 11.07.30 PM.jpeg';

if (!fs.existsSync(srcFile)) {
  console.error('Source not found:', srcFile);
  process.exit(1);
}

const srcBuf = fs.readFileSync(srcFile);
const meta = await sharp(srcBuf).metadata();
console.log(`Source: ${meta.width}x${meta.height} ${meta.format}`);

// Theme colors from src/styles/themes.css:
// brand-dark:   #161616  (near-black)  — hero background
// brand-accent: #b98b6e  (warm bronze) — subtle glow
// brand-cream:  #f4f0e9  — about section background

function makeHeroBgSvg(w, h) {
  return Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1c1c1c"/>
        <stop offset="100%" stop-color="#101010"/>
      </linearGradient>
      <radialGradient id="glow" cx="65%" cy="90%" r="55%">
        <stop offset="0%" stop-color="#b98b6e" stop-opacity="0.20"/>
        <stop offset="100%" stop-color="#161616" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
  </svg>`);
}

function makeAboutBgSvg(w, h) {
  return Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#f4f0e9"/>
        <stop offset="100%" stop-color="#e8e2d8"/>
      </linearGradient>
      <radialGradient id="glow" cx="35%" cy="50%" r="55%">
        <stop offset="0%" stop-color="#b98b6e" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#f4f0e9" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
  </svg>`);
}

async function makeImage(bgSvgBuf, w, h, position) {
  const person = await sharp(srcBuf)
    .resize(w, h, { fit: 'cover', position })
    .removeAlpha()
    .toBuffer();
  return await sharp(bgSvgBuf)
    .resize(w, h)
    .composite([{ input: person, blend: 'over' }])
    .toBuffer();
}

// Only generate WebP (fast, fully supported). Existing AVIF files stay as-is.
const FORMATS = ['webp'];

// Hero variants (dark bg)
console.log('\nHero variants...');
for (const w of [220, 480, 640, 1080]) {
  const h = Math.round(w * 1125 / 900);
  const img = await makeImage(makeHeroBgSvg(w, h), w, h, 'top');
  for (const fmt of FORMATS) {
    const dest = path.join(outDir, `t001-nova-hero@${w}.${fmt}`);
    await sharp(img)[fmt]({ quality: 84 }).toFile(dest);
    console.log('  ', path.basename(dest));
  }
}
{
  const [w, h] = [900, 1125];
  const img = await makeImage(makeHeroBgSvg(w, h), w, h, 'top');
  for (const fmt of FORMATS) {
    const dest = path.join(outDir, `t001-nova-hero.${fmt}`);
    await sharp(img)[fmt]({ quality: 86 }).toFile(dest);
    console.log('  ', path.basename(dest));
  }
}

// About team variants (cream bg)
console.log('\nAbout-team variants...');
for (const w of [220, 480, 640, 1080, 1280]) {
  const h = Math.round(w * 900 / 1280);
  const img = await makeImage(makeAboutBgSvg(w, h), w, h, 'top');
  for (const fmt of FORMATS) {
    const dest = path.join(outDir, `t001-nova-about-team@${w}.${fmt}`);
    await sharp(img)[fmt]({ quality: 84 }).toFile(dest);
    console.log('  ', path.basename(dest));
  }
}
{
  const [w, h] = [1280, 900];
  const img = await makeImage(makeAboutBgSvg(w, h), w, h, 'top');
  for (const fmt of FORMATS) {
    const dest = path.join(outDir, `t001-nova-about-team.${fmt}`);
    await sharp(img)[fmt]({ quality: 86 }).toFile(dest);
    console.log('  ', path.basename(dest));
  }
}

// Avatar variants (cream bg, square)
console.log('\nAvatar variants...');
for (const w of [220, 480, 640, 1080]) {
  const img = await makeImage(makeAboutBgSvg(w, w), w, w, 'top');
  for (const fmt of FORMATS) {
    const dest = path.join(outDir, `t001-nova-avatar-01@${w}.${fmt}`);
    await sharp(img)[fmt]({ quality: 84 }).toFile(dest);
    console.log('  ', path.basename(dest));
  }
}
{
  const w = 220;
  const img = await makeImage(makeAboutBgSvg(w, w), w, w, 'top');
  for (const fmt of FORMATS) {
    const dest = path.join(outDir, `t001-nova-avatar-01.${fmt}`);
    await sharp(img)[fmt]({ quality: 86 }).toFile(dest);
    console.log('  ', path.basename(dest));
  }
}

console.log('\nAll done!');
