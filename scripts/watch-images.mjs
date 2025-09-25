import { spawn } from 'node:child_process';
import chokidar from 'chokidar';

const watcher = chokidar.watch('images-input/articles/*.png', {
  ignoreInitial: true,
  awaitWriteFinish: { stabilityThreshold: 500, pollInterval: 100 }
});

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true });
    p.on('close', code => code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} exited ${code}`)));
  });
}

watcher.on('add', async (file) => {
  console.log('🆕 PNG detected:', file);
  try {
    await run('npm', ['run', 'images:build']);
    await run('npm', ['run', 'images:upload']);
    console.log('✅ processed & uploaded:', file);
  } catch (e) {
    console.error('❌', e);
  }
});

console.log('👀 watching images-input/articles/*.png …');
