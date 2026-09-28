const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = getFiles('./src');
const routeTargets = [];
const linkPatterns = [
  /router\.(push|replace)\s*\(\s*['"](\/[^'"]+)['"]/g,
  /href\s*=\s*['"](\/[^'"]+)['"]/g,
  /pathname\s*:\s*['"](\/[^'"]+)['"]/g,
  /router\.(push|replace)\s*\(\s*`(\/[^`]+)`/g
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  linkPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      routeTargets.push({ file: path.relative('.', f), match: match[2] || match[1] });
    }
  });
});

console.log('Total navigation links found:', routeTargets.length);
const unique = new Map();
routeTargets.forEach(t => {
  if (!unique.has(t.match)) unique.set(t.match, []);
  unique.get(t.match).push(t.file);
});

for (const [target, locs] of unique.entries()) {
  console.log(`- ${target} (${locs.length} refs: ${locs[0]})`);
}

// Also get all route files in src/app
console.log('\n--- Route Files in src/app ---');
const appFiles = getFiles('./src/app');
appFiles.forEach(f => {
  console.log(path.relative('src/app', f));
});
