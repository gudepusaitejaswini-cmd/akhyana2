const http = require('http');

const BASE_URL = 'http://localhost:5000';

function get(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({ url, status: res.statusCode, length: data.length });
      });
    }).on('error', (err) => {
      resolve({ url, status: 0, error: err.message });
    });
  });
}

// Import data modules to check all parameter permutations
async function run() {
  console.log('--- AUDITING ALL APP ROUTES & LINKS ON ' + BASE_URL + ' ---\n');

  // Core Pages
  const staticRoutes = [
    '/',
    '/explore',
    '/games',
    '/heritage-voices',
    '/progress',
    '/game/chronosearch',
    '/game/ludo',
    '/game/ludo/play',
    '/heritage-voices/submit'
  ];

  let passed = 0;
  let failed = 0;

  console.log('1. Testing Core Top-Level Static Routes:');
  for (const route of staticRoutes) {
    const res = await get(`${BASE_URL}${route}`);
    if (res.status === 200 || res.status === 304) {
      console.log(`  [PASS] ${route} -> Status: ${res.status}`);
      passed++;
    } else {
      console.log(`  [FAIL] ${route} -> Status: ${res.status}`);
      failed++;
    }
  }

  // Dynamic Routes
  console.log('\n2. Testing Dynamic Entity & Content Links:');

  // Let's test known entity IDs
  const sampleDynamicRoutes = [
    // Decades
    '/decade/1890s',
    '/decade/1940s',
    '/decade/1950s',
    '/decade/2010s',
    // Puzzles
    '/game/chronosearch/1947-independence',
    '/game/chronosearch/1950-republic',
    '/game/chronosearch/indus-valley',
    '/game/chronosearch/maurya-empire',
    // Heritage Voices
    '/heritage-voices/article/sih-2026-indus-drainage-study',
    '/heritage-voices/article/chola-naval-inscriptions-nagapattinam',
    '/heritage-voices/author/dr-rajesh-sharma',
    '/heritage-voices/author/prof-meenakshi-sundaram',
    // Topics & Experiences
    '/topic/indus-valley-urban-planning',
    '/topic/dholavira-water-engineering',
    '/experience/harappa-citadel-investigation',
    '/experience/dholavira-reservoir-system',
    // Civilizations & Periods
    '/civilization/indus-valley',
    '/period/ancient-india',
    '/period/medieval-india',
    // Games
    '/game/chronosearch',
    '/game/ludo-legends',
    // Learn event & subtopic
    '/learn/1947-independence/subtopic-1',
    '/learn/1950-constitution/subtopic-1'
  ];

  for (const route of sampleDynamicRoutes) {
    const res = await get(`${BASE_URL}${route}`);
    if (res.status === 200 || res.status === 304) {
      console.log(`  [PASS] ${route} -> Status: ${res.status}`);
      passed++;
    } else {
      console.log(`  [FAIL] ${route} -> Status: ${res.status}`);
      failed++;
    }
  }

  console.log(`\n--- SUMMARY: ${passed} Passed, ${failed} Failed ---`);
}

run();
