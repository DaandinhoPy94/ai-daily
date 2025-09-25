// scripts/watch-images.mjs
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import chokidar from 'chokidar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const watchGlob = path.join(projectRoot, 'images-input', 'articles', '*.png');

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, {
      stdio: 'inherit',
      shell: true,
      cwd: projectRoot,
      env: process.env,
    });
    p.on('close', code => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`))));
  });
}

console.log('🟡 starting watcher with glob:', watchGlob);

const watcher = chokidar.watch(watchGlob, {
  // zet desnoods tijdelijk op false om ook bestaande files 1x te pakken:
  ignoreInitial: true,
  awaitWriteFinish: { stabilityThreshold: 800, pollInterval: 100 },
  ignorePermissionErrors: true,
  persistent: true,
});

watcher
  .on('ready', () => {
    console.log('✅ watcher ready; now listening for add/change …');
  })
  .on('add', async (file) => {
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
    console.log('✏️  change detected:', file);
    try {
      await run('npm', ['run', 'images:build']);
      await run('npm', ['run', 'images:upload']);
      console.log('✅ reprocessed & uploaded:', path.basename(file));
    } catch (e) {
      console.error('❌ change handler error:', e?.message || e);
    }
  })
  .on('error', (err) => {
    console.error('💥 watcher error:', err);
  });

console.log('👀 watching', watchGlob);
