import sharp from '../node_modules/sharp/lib/index.js';
import fs from 'fs';
import path from 'path';

const srcFile = 'd:/POrtfolio/public/assets/images/t001-nova/profile-source.jpg';
const outDir = 'd:/POrtfolio/public/assets/images/t001-nova';

// Check source
const srcBuf = fs.readFileSync(srcFile);
console.log('Source size:', srcBuf.length, 'bytes');

const meta = await sharp(srcBuf).metadata();
console.log('Image metadata:', meta.width, 'x', meta.height, meta.format);

// Hero image: portrait 900x1125 (4:5)
// About team: landscape 1280x900
// Avatar: square 220x220

const heroSizes = [220, 480, 640, 1080];
const aboutSizes = [220, 480, 640, 1080, 1280];

// Hero variants (portrait crop)
for (const w of heroSizes) {
  const h = Math.round(w * 1125 / 900);
  for (const fmt of ['webp', 'avif']) {
    const dest = path.join(outDir, `t001-nova-hero@${w}.${fmt}`);
    await sharp(srcBuf)
      .resize(w, h, { fit: 'cover', position: 'top' })
      [fmt]({ quality: 82 })
      .toFile(dest);
    console.log('Written:', dest);
  }
}
// Hero base (largest)
for (const fmt of ['webp', 'avif']) {
  const dest = path.join(outDir, `t001-nova-hero.${fmt}`);
  await sharp(srcBuf)
    .resize(900, 1125, { fit: 'cover', position: 'top' })
    [fmt]({ quality: 85 })
    .toFile(dest);
  console.log('Written:', dest);
}

// About team variants (landscape crop - use full image, pad/contain)
for (const w of aboutSizes) {
  const h = Math.round(w * 900 / 1280);
  for (const fmt of ['webp', 'avif']) {
    const dest = path.join(outDir, `t001-nova-about-team@${w}.${fmt}`);
    await sharp(srcBuf)
      .resize(w, h, { fit: 'cover', position: 'top' })
      [fmt]({ quality: 82 })
      .toFile(dest);
    console.log('Written:', dest);
  }
}
for (const fmt of ['webp', 'avif']) {
  const dest = path.join(outDir, `t001-nova-about-team.${fmt}`);
  await sharp(srcBuf)
    .resize(1280, 900, { fit: 'cover', position: 'top' })
    [fmt]({ quality: 85 })
    .toFile(dest);
  console.log('Written:', dest);
}

// Avatar variants (square)
for (const w of [220, 480, 640, 1080]) {
  for (const fmt of ['webp', 'avif']) {
    const dest = path.join(outDir, `t001-nova-avatar-01@${w}.${fmt}`);
    await sharp(srcBuf)
      .resize(w, w, { fit: 'cover', position: 'top' })
      [fmt]({ quality: 82 })
      .toFile(dest);
    console.log('Written:', dest);
  }
}
for (const fmt of ['webp', 'avif']) {
  const dest = path.join(outDir, `t001-nova-avatar-01.${fmt}`);
  await sharp(srcBuf)
    .resize(220, 220, { fit: 'cover', position: 'top' })
    [fmt]({ quality: 85 })
    .toFile(dest);
  console.log('Written:', dest);
}

console.log('\nAll done!');
