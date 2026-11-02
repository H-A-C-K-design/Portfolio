import sharp from '../node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const outDir = 'd:/POrtfolio/public/assets/images/t001-nova';

// Source: user's profile photo from DG image folder
const srcFile = 'd:/POrtfolio/DG image/WhatsApp Image 2026-11-02 at 11.07.30 PM.jpeg';

if (!fs.existsSync(srcFile)) {
  console.error('Source not found:', srcFile);
  process.exit(1);
}

const srcBuf = fs.readFileSync(srcFile);
const meta = await sharp(srcBuf).metadata();
console.log(`Source: ${meta.width}x${meta.height} ${meta.format} (${srcBuf.length} bytes)`);

// --- Hero image variants (portrait 4:5 ratio) ---
console.log('\nGenerating hero variants...');
const heroSizes = [220, 480, 640, 1080];
for (const w of heroSizes) {
  const h = Math.round(w * 1125 / 900);
  for (const fmt of ['webp', 'avif']) {
    const dest = path.join(outDir, `t001-nova-hero@${w}.${fmt}`);
    await sharp(srcBuf)
      .resize(w, h, { fit: 'cover', position: 'top' })
      [fmt]({ quality: 82 })
      .toFile(dest);
    console.log('  Written:', path.basename(dest));
  }
}
for (const fmt of ['webp', 'avif']) {
  const dest = path.join(outDir, `t001-nova-hero.${fmt}`);
  await sharp(srcBuf)
    .resize(900, 1125, { fit: 'cover', position: 'top' })
    [fmt]({ quality: 85 })
    .toFile(dest);
  console.log('  Written:', path.basename(dest));
}

// --- About team image variants (landscape) ---
console.log('\nGenerating about-team variants...');
const aboutSizes = [220, 480, 640, 1080, 1280];
for (const w of aboutSizes) {
  const h = Math.round(w * 900 / 1280);
  for (const fmt of ['webp', 'avif']) {
    const dest = path.join(outDir, `t001-nova-about-team@${w}.${fmt}`);
    await sharp(srcBuf)
      .resize(w, h, { fit: 'cover', position: 'top' })
      [fmt]({ quality: 82 })
      .toFile(dest);
    console.log('  Written:', path.basename(dest));
  }
}
for (const fmt of ['webp', 'avif']) {
  const dest = path.join(outDir, `t001-nova-about-team.${fmt}`);
  await sharp(srcBuf)
    .resize(1280, 900, { fit: 'cover', position: 'top' })
    [fmt]({ quality: 85 })
    .toFile(dest);
  console.log('  Written:', path.basename(dest));
}

// --- Avatar variants (square) ---
console.log('\nGenerating avatar variants...');
for (const w of [220, 480, 640, 1080]) {
  for (const fmt of ['webp', 'avif']) {
    const dest = path.join(outDir, `t001-nova-avatar-01@${w}.${fmt}`);
    await sharp(srcBuf)
      .resize(w, w, { fit: 'cover', position: 'top' })
      [fmt]({ quality: 82 })
      .toFile(dest);
    console.log('  Written:', path.basename(dest));
  }
}
for (const fmt of ['webp', 'avif']) {
  const dest = path.join(outDir, `t001-nova-avatar-01.${fmt}`);
  await sharp(srcBuf)
    .resize(220, 220, { fit: 'cover', position: 'top' })
    [fmt]({ quality: 85 })
    .toFile(dest);
  console.log('  Written:', path.basename(dest));
}

console.log('\nAll done!');
