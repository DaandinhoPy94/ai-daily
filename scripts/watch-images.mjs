// scripts/watch-images.mjs
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import chokidar from 'chokidar';

// Resolves naar projectroot ongeacht hoe het script gestart is
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Absoluut glob naar je inputmap
const watchGlob = path.join(projectRoot, 'images-input', 'articles', '*.png');

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
      cwd: projectRoot,                 // <-- altijd vanuit projectroot
      env: process.env
    });
    p.on('close', code => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`))));
  });
}

const watcher = chokidar.watch(watchGlob, {
  ignoreInitial: true,                  // alleen NIEUWE/gewijzigde PNG’s
  awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 }
});

watcher.on('add', async (file) => {
  console.log('🆕 PNG detected:', file);
  try {
    await run('npm', ['run', 'images:build']);
    await run('npm', ['run', 'images:upload']);
    console.log('✅ processed & uploaded:', path.basename(file));
  } catch (e) {
    console.error('❌', e.message || e);
  }
});

console.log('👀 watching', watchGlob);
