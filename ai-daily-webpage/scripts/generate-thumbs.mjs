// scripts/generate-thumbs.mjs
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const IN_DIR  = path.resolve('images-input/articles');   // input
const OUT_DIR = path.resolve('public/images/articles');  // output

const listSizes = [320, 480, 640];
const heroSizes = [800, 1200, 1600];

async function ensureDir(dir) { await fs.mkdir(dir, { recursive: true }); }

function getIdFromBasename(basename) {
  return basename.replace(/_hero$/i, '');
}

async function processOne(file) {
  const basename = path.parse(file).name;  // zonder .png
  const id = getIdFromBasename(basename);
  const inputPath = path.join(IN_DIR, file);
  const DONE_DIR = path.join(IN_DIR, '_done');

  await ensureDir(DONE_DIR);

  // 1) lees origin één keer
  const origin = await fs.readFile(inputPath);

  try {
    // 2) origin naar OUT_DIR (gestandaardiseerde naam)
    await fs.writeFile(path.join(OUT_DIR, `${id}.png`), origin);

    // 3) LIST (16:9)
    for (const w of listSizes) {
      const buf = await sharp(origin)
        .resize({ width: w, height: Math.round(w * 9/16), fit: 'cover', position: 'attention' })
        .webp({ quality: 80 })
        .toBuffer();
      await fs.writeFile(path.join(OUT_DIR, `${id}_list_${w}.webp`), buf);
    }

    // 4) HERO (16:9)
    for (const w of heroSizes) {
      const buf = await sharp(origin)
        .resize({ width: w, height: Math.round(w * 9/16), fit: 'cover', position: 'attention' })
        .webp({ quality: 82 })
        .toBuffer();
      await fs.writeFile(path.join(OUT_DIR, `${id}_hero_${w}.webp`), buf);
    }

    console.log('✓ generated variants for', file);
  } finally {
    // 5) pas op het einde verplaatsen naar _done/
    try {
      await fs.rename(inputPath, path.join(DONE_DIR, file));
    } catch (e) {
      console.warn('⚠️ move to _done failed:', file, e?.message);
    }
  }
}

async function main() {
  await ensureDir(IN_DIR);
  await ensureDir(OUT_DIR);

  const files = await fs.readdir(IN_DIR);
  const pngs = files.filter(f => f.toLowerCase().endsWith('.png'));

  if (pngs.length === 0) {
    console.log(`No PNGs in ${IN_DIR}, nothing to do.`);
    return;
  }

  for (const f of pngs) await processOne(f);
}

main().catch(e => { console.error(e); process.exit(1); });
