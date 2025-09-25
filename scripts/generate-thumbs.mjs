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
  // verwijder optioneel `_hero` suffix, zodat id = "<ARTICLE_ID>"
  return basename.replace(/_hero$/i, '');
}

async function processOne(file) {
  const basename = path.parse(file).name;  // zonder .png
  const id = getIdFromBasename(basename);
  const inputPath = path.join(IN_DIR, file);
  const origin = await fs.readFile(inputPath);

  await fs.copyFile(inputPath, path.join(OUT_DIR, `${id}.png`)); // origin (gestandaardiseerd)

  // LIST (16:9): <ID>_list_320.webp etc.
  for (const w of listSizes) {
    const buf = await sharp(origin)
      .resize({ width: w, height: Math.round(w * 9/16), fit: 'cover', position: 'attention' })
      .webp({ quality: 80 })
      .toBuffer();
    await fs.writeFile(path.join(OUT_DIR, `${id}_list_${w}.webp`), buf);
  }

  // HERO (16:9): <ID>_hero_800.webp etc.  <-- belangrijk voor frontend
  for (const w of heroSizes) {
    const buf = await sharp(origin)
      .resize({ width: w, height: Math.round(w * 9/16), fit: 'cover', position: 'attention' })
      .webp({ quality: 82 })
      .toBuffer();
    await fs.writeFile(path.join(OUT_DIR, `${id}_hero_${w}.webp`), buf);
  }

  console.log('✓ generated variants for', file);
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
