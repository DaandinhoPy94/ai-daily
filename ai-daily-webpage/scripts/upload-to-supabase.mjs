// scripts/upload-to-supabase.mjs
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const OUT_DIR = path.resolve('public/images/articles');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
const BUCKET = process.env.SUPABASE_BUCKET || 'media';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE in .env.local');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE);

function detectContentType(filename) {
  const f = filename.toLowerCase();
  if (f.endsWith('.webp')) return 'image/webp';
  if (f.endsWith('.png')) return 'image/png';
  if (f.endsWith('.jpg') || f.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

// Haal <ID> uit bestandsnaam: <ID>_list_XXX.webp | <ID>_hero_YYY.webp | <ID>.png
function extractId(file) {
  const m =
    file.match(/^(.+?)_(?:list_\d+|hero_\d+)\.webp$/i) ||
    file.match(/^(.+?)\.png$/i);
  return m ? m[1] : null;
}

async function uploadOne(localPath, storagePath) {
  const buffer = await fs.readFile(localPath);
  const contentType = detectContentType(localPath);
  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType,
    upsert: true,
  });
  if (error) throw error;
  console.log('↑', storagePath);
}

async function main() {
  const files = await fs.readdir(OUT_DIR);
  const images = files.filter(f => /\.(webp|png|jpg|jpeg)$/i.test(f));

  if (images.length === 0) {
    console.log('No generated images in', OUT_DIR);
    return;
  }

  // Verzamel alle ids die we uploaden, zodat we ze daarna in 1x kunnen updaten
  const processedIds = new Set();

  for (const f of images) {
    const id = extractId(f);
    if (!id) {
      console.log('skip (no id):', f);
      continue;
    }
    processedIds.add(id);

    // Map lokaal -> storage pad:
    // <ID>_list_320.webp -> articles/<ID>/list_320.webp
    // <ID>_hero_800.webp -> articles/<ID>/hero_800.webp
    // <ID>.png           -> articles/<ID>/hero.png (origin)
    let storagePath;
    if (/\.png$/i.test(f)) {
      storagePath = `articles/${id}/hero.png`;
    } else if (/_list_\d+\.webp$/i.test(f)) {
      const suffix = f.replace(`${id}_`, ''); // list_320.webp
      storagePath = `articles/${id}/${suffix}`;
    } else if (/_hero_\d+\.webp$/i.test(f)) {
      const suffix = f.replace(`${id}_`, ''); // hero_800.webp
      storagePath = `articles/${id}/${suffix}`;
    } else {
      console.log('skip (unknown pattern):', f);
      continue;
    }

    await uploadOne(path.join(OUT_DIR, f), storagePath);
  }

  // 🔁 Na alle uploads: update de bijbehorende articles-records
  const basePublic = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/articles`;
  for (const id of processedIds) {
    const payload = {
      image_list:     `${basePublic}/${id}/list_480.webp`,
      image_standard: `${basePublic}/${id}/hero_1200.webp`,
      image_large:    `${basePublic}/${id}/hero_1600.webp`,
      updated_at:     new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('articles')
      .update(payload)
      .eq('id', id)
      .select('id')
      .single();

    if (error) {
      console.error('❌ articles update failed for', id, error);
    } else {
      console.log('🗂️  articles row updated for', id);
    }
  }

  console.log('✓ upload complete');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
