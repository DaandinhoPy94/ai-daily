// scripts/watch-images.mjs
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import chokidar from 'chokidar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// We watchen de MAP (robuuster dan een glob), filteren later op .png
const watchDir = path.join(projectRoot, 'images-input', 'articles');

// Helper om child-processen te draaien vanuit de projectroot
function run(cmd, args) {
  return new Promise((resolve, reject) => {
    console.log('▶️  run:', cmd, args.join(' '));
    const p = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
      cwd: projectRoot,
      env: process.env,
    });
    p.on('close', code => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`))));
  });
}

async function main() {
  console.log('🔎 projectRoot =', projectRoot);
  console.log('🔎 watchDir    =', watchDir);

  try {
    const s = await fs.stat(watchDir);
    console.log('📂 watchDir exists. isDirectory =', s.isDirectory());
  } catch (e) {
    console.error('❌ watchDir bestaat niet! Maak deze map aan:', watchDir);
    process.exit(1);
  }

  let isReady = false;

  const watcher = chokidar.watch(watchDir, {
    persistent: true,
    // ⬇️ Forceer polling → betrouwbaarder op macOS/externe drives
    usePolling: true,
    interval: 300,
    binaryInterval: 300,
    // Eerst alles scannen, maar niet verwerken tot 'ready'
    ignoreInitial: false,
    depth: 0,
    awaitWriteFinish: { stabilityThreshold: 1000, pollInterval: 100 },
    ignorePermissionErrors: true,
  });

  watcher
    .on('ready', () => {
      isReady = true;
      console.log('✅ watcher ready; now listening for add/change …');
    })
    .on('add', async (file) => {
      const ext = path.extname(file).toLowerCase();
      if (ext !== '.png') return;

      if (!isReady) {
        console.log('📁 initial add (skip):', file);
        return; // initial scan negeren
      }

      console.log('🆕 add detected:', file);
      try {
        await run('npm', ['run', 'images:build']);
        await run('npm', ['run', 'images:upload']);
        console.log('✅ processed & uploaded:', path.basename(file));
      } catch (e) {
        console.error('❌ add handler error:', e?.message || e);
      }
    })
    .on('change', async (file) => {
      const ext = path.extname(file).toLowerCase();
      if (ext !== '.png') return;

      if (!isReady) {
        console.log('📁 initial change (skip):', file);
        return;
      }

      console.log('✏️  change detected:', file);
      try {
        await run('npm', ['run', 'images:build']);
        await run('npm', ['run', 'images:upload']);
        console.log('✅ reprocessed & uploaded:', path.basename(file));
      } catch (e) {
        console.error('❌ change handler error:', e?.message || e);
      }
    })
    .on('all', (event, file) => {
      // Extra debug (mag je later weghalen)
      console.log('📣 all-event:', event, file);
    })
    .on('error', (err) => {
      console.error('💥 watcher error:', err);
    });

  console.log('👀 watching directory:', watchDir, '(PNG only)');
}

main().catch((e) => {
  console.error('💥 fatal:', e);
  process.exit(1);
});
