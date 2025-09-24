// scripts/generate-thumbs.mjs
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const IN_DIR  = path.resolve('images-input/articles');
const OUT_DIR = path.resolve('public/images/articles');

const listSizes = [320, 480, 640];      // thumbnails (16:9)
const heroSizes = [800, 1200, 1600];    // hero (16:9)

async function ensureDir(dir) { await fs.mkdir(dir, { recursive: true }); }

async function processOne(file) {
  // Input file: bijv. "<ARTICLE_ID>_hero.png" óf "<ARTICLE_ID>.png"
  const basename = path.parse(file).name;          // zonder .png
  const inputPath = path.join(IN_DIR, file);

  await ensureDir(OUT_DIR);
  const origin = await fs.readFile(inputPath);

  // Origin kopiëren (optioneel handig voor referentie/OG)
  await fs.copyFile(inputPath, path.join(OUT_DIR, `${basename}.png`));

  // LIST (16:9) → 320/480/640
  for (const w of listSizes) {
    const buf = await sharp(origin)
      .resize({ width: w, height: Math.round(w * 9/16), fit: 'cover', position: 'attention' })
      .webp({ quality: 80 })
      .toBuffer();

    // als jouw origin '..._hero.png' heet, strip _hero voor de list-bestanden:
    const listBase = basename.replace(/_hero$/, '');
    await fs.writeFile(path.join(OUT_DIR, `${listBase}_list_${w}.webp`), buf);
  }

  // HERO (16:9) → 800/1200/1600
  for (const w of heroSizes) {
    const buf = await sharp(origin)
      .resize({ width: w, height: Math.round(w * 9/16), fit: 'cover', position: 'attention' })
      .webp({ quality: 82 })
      .toBuffer();

    await fs.writeFile(path.join(OUT_DIR, `${basename}_${w}.webp`), buf); // hero_800.webp, etc.
  }

  // (optioneel) JPG fallback voor hero
  // for (const w of heroSizes) {
  //   const jpg = await sharp(origin)
  //     .resize({ width: w, height: Math.round(w * 9/16), fit: 'cover', position: 'attention' })
  //     .jpeg({ quality: 85 }).toBuffer();
  //   await fs.writeFile(path.join(OUT_DIR, `${basename}_${w}.jpg`), jpg);
  // }

  console.log('✓ generated variants for', file);
}

async function main() {
  await ensureDir(OUT_DIR);
  const files = await fs.readdir(IN_DIR);
  const pngs = files.filter(f => f.toLowerCase().endsWith('.png'));
  for (const f of pngs) {
    await processOne(f);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
