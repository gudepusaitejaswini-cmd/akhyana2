const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building Akhyana Expo Web from web wrapper...');
const rootDir = path.resolve(__dirname, '..');

const expoCli = path.join(rootDir, 'node_modules', 'expo', 'bin', 'cli');
if (!fs.existsSync(expoCli)) {
  console.log('Installing root dependencies...');
  try {
    execSync('npm install', { cwd: rootDir, stdio: 'inherit' });
  } catch (err) {
    console.error('Failed to npm install in root:', err);
  }
}

// Run expo export in root using current node binary
console.log('Exporting Expo Web in root directory...');
execSync(`"${process.execPath}" "${expoCli}" export --platform web`, { cwd: rootDir, stdio: 'inherit' });

// Copy root dist to web/dist and web/out
const srcDist = path.join(rootDir, 'dist');
const targetDist = path.join(__dirname, 'dist');
const targetOut = path.join(__dirname, 'out');

fs.rmSync(targetDist, { recursive: true, force: true });
fs.cpSync(srcDist, targetDist, { recursive: true });
fs.rmSync(targetOut, { recursive: true, force: true });
fs.cpSync(srcDist, targetOut, { recursive: true });

console.log('Akhyana Expo Web successfully built and staged in web/dist and web/out!');
