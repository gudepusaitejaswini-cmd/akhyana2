const http = require('http');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000';

function get(path) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${path}`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({ path, status: res.statusCode, length: data.length });
      });
    }).on('error', (err) => {
      resolve({ path, status: 0, error: err.message });
    });
  });
}

async function run() {
  console.log('========================================================');
  console.log('   AKHYANA — EXHAUSTIVE LIVE LINK AUDIT ON ' + BASE_URL);
  console.log('========================================================\n');

  const linksToTest = new Set();

  // 1. Static Top-Level Routes
  [
    '/',
    '/aaj-ka-akhyana',
    '/explore',
    '/games',
    '/heritage-voices',
    '/progress',
    '/game/chronosearch',
    '/game/ludo',
    '/game/ludo/play',
    '/heritage-voices/submit'
  ].forEach(r => linksToTest.add(r));

  // 2. Extract all IDs from data files
  const eventsContent = fs.readFileSync('src/data/historical-events.ts', 'utf8');
  // time windows
  const winMatches = [...eventsContent.matchAll(/id:\s*'([0-9a-z-]+)',\s*label:/g)].map(m => m[1]);
  winMatches.forEach(w => linksToTest.add(`/decade/${w}`));

  // historical events
  const eventIds = [...eventsContent.matchAll(/id:\s*'([0-9a-z-]+)',\s*timeWindowId:/g)].map(m => m[1]);
  eventIds.forEach(id => {
    // subtopic 1
    linksToTest.add(`/learn/${id}/${id}-subtopic-1`);
  });

  // ChronoSearch puzzles
  const puzzlesContent = fs.readFileSync('src/data/chronosearch.ts', 'utf8');
  const puzzleIds = [...puzzlesContent.matchAll(/id:\s*'([0-9a-z-]+)',\s*title:/g)].map(m => m[1]);
  puzzleIds.forEach(p => linksToTest.add(`/game/chronosearch/${p}`));

  // Heritage Voices articles & authors
  const heritageContent = fs.readFileSync('src/data/heritage-voices.ts', 'utf8');
  const articleIds = [...heritageContent.matchAll(/id:\s*'([a-z0-9-]+)',\s*title:/g)].map(m => m[1]);
  articleIds.forEach(a => linksToTest.add(`/heritage-voices/article/${a}`));

  const authorIds = [...heritageContent.matchAll(/id:\s*'([a-z0-9-]+)',\s*name:/g)].map(m => m[1]);
  authorIds.forEach(a => linksToTest.add(`/heritage-voices/author/${a}`));

  // Topics & Experiences
  const topicsContent = fs.readFileSync('src/data/topics.ts', 'utf8');
  const topicIds = [...topicsContent.matchAll(/id:\s*'([a-z0-9-]+)',\s*title:/g)].map(m => m[1]);
  topicIds.forEach(t => linksToTest.add(`/topic/${t}`));

  const expContent = fs.readFileSync('src/data/experiences.ts', 'utf8');
  const expIds = [...expContent.matchAll(/id:\s*'([a-z0-9-]+)',\s*topicId:/g)].map(m => m[1]);
  expIds.forEach(e => linksToTest.add(`/experience/${e}`));

  // Civilizations & Periods & Games
  const civContent = fs.readFileSync('src/data/civilizations.ts', 'utf8');
  const civIds = [...civContent.matchAll(/id:\s*'([a-z0-9-]+)',\s*name:/g)].map(m => m[1]);
  civIds.forEach(c => linksToTest.add(`/civilization/${c}`));

  const timelineContent = fs.readFileSync('src/data/timeline.ts', 'utf8');
  const periodIds = [...timelineContent.matchAll(/id:\s*'([a-z0-9-]+)',\s*title:/g)].map(m => m[1]);
  periodIds.forEach(p => linksToTest.add(`/period/${p}`));

  const gamesContent = fs.readFileSync('src/data/games.ts', 'utf8');
  const gameIds = [...gamesContent.matchAll(/id:\s*'([a-z0-9-]+)',\s*name:/g)].map(m => m[1]);
  gameIds.forEach(g => linksToTest.add(`/game/${g}`));

  console.log(`Total URLs to audit across site: ${linksToTest.size}`);

  let passed = 0;
  let failed = 0;

  for (const path of linksToTest) {
    const res = await get(path);
    if (res.status === 200 || res.status === 304) {
      passed++;
    } else {
      console.error(`❌ [FAIL] ${path} -> Status: ${res.status}`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} PASSED, ${failed} FAILED.`);
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('✅ ALL ACCESSIBLE LINKS AND DEEP ROUTES RETURN 200 OK!\n');
  }
}

run();
