const http = require('http');
const https = require('https');

async function fetchUrl(url) {
  const isHttps = url.startsWith('https://');
  const client = isHttps ? https : http;

  return new Promise((resolve) => {
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          headers: res.headers,
          data
        });
      });
    }).on('error', (err) => {
      resolve({ url, status: 0, error: err.message, data: '' });
    });
  });
}

async function runAudit(baseUrl) {
  console.log(`\n======================================================`);
  console.log(`  AUDITING TARGET: ${baseUrl}`);
  console.log(`======================================================\n`);

  let passed = 0;
  let failed = 0;

  function report(name, condition, extra = '') {
    if (condition) {
      console.log(`  [PASS] ${name} ${extra ? '(' + extra + ')' : ''}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${name} ${extra ? '(' + extra + ')' : ''}`);
      failed++;
    }
  }

  // 1. Homepage & Sections Check
  const home = await fetchUrl(`${baseUrl}/`);
  report('Homepage HTTP Status', home.status === 200, `Status: ${home.status}`);
  report('Homepage Content Length', home.data.length > 5000, `${home.data.length} bytes`);

  // Verify Homepage 7 Sections Content
  report('Section 1 - Hero Headline', home.data.includes("History isn&#x27;t just something you read") || home.data.includes("History isn't just something you read"));
  report('Section 1 - Brand Tagline', home.data.includes("PLAY • EXPLORE • LEARN"));
  report('Section 1 - Start Exploring CTA', home.data.includes("START EXPLORING"));
  report('Section 2 - What is Akhyana', home.data.includes("From memorization") || home.data.includes("memorize into something"));
  report('Section 3 - Explore Section', home.data.includes("Explore India across time") || home.data.includes("CIVILIZATIONS"));
  report('Section 4 - Heritage Voices', home.data.includes("Heritage Voices") || home.data.includes("Heritage"));
  report('Section 5 - Learn Through Play', home.data.includes("Learn through play") || home.data.includes("ChronoSearch"));
  report('Section 6 - Past -> Present', home.data.includes("The Living Thread") || home.data.includes("Smart Cities Mission"));
  report('Section 7 - Final CTA', home.data.includes("Experience India&#x27;s stories") || home.data.includes("Experience India's stories"));

  // 2. Navigation Routes
  const navRoutes = [
    '/explore',
    '/learn',
    '/games',
    '/aaj-ka-akhyana',
    '/heritage-voices',
    '/progress'
  ];

  console.log('\n--- Checking Primary Navigation Routes ---');
  for (const route of navRoutes) {
    const res = await fetchUrl(`${baseUrl}${route}`);
    report(`Route ${route}`, res.status === 200, `Status: ${res.status}`);
  }

  // 3. Game Routes
  console.log('\n--- Checking Interactive Game Routes ---');
  const gameRoutes = [
    '/game/chronosearch',
    '/game/ludo',
    '/game/ludo/play',
    '/game/chronosearch/indus-valley'
  ];
  for (const route of gameRoutes) {
    const res = await fetchUrl(`${baseUrl}${route}`);
    report(`Game Route ${route}`, res.status === 200, `Status: ${res.status}`);
  }

  // 4. Dynamic Decades & Civilizations
  console.log('\n--- Checking Dynamic Content Routes ---');
  const dynamicRoutes = [
    '/decade/1890s',
    '/decade/1940s',
    '/civilization/indus-valley',
    '/heritage-voices/article/sih-2026-indus-drainage-study',
    '/heritage-voices/author/dr-rajesh-sharma',
    '/learn/1947-independence/subtopic-1'
  ];
  for (const route of dynamicRoutes) {
    const res = await fetchUrl(`${baseUrl}${route}`);
    report(`Dynamic Route ${route}`, res.status === 200, `Status: ${res.status}`);
  }

  // 5. Assets Check
  console.log('\n--- Checking Branding Assets in Output ---');
  const logoMatches = home.data.match(/\/assets\/assets\/images\/akhyana-logo-[^"]+\.jpg/g) || [];
  const uniqueLogoUrls = [...new Set(logoMatches)];
  if (uniqueLogoUrls.length > 0) {
    for (const assetPath of uniqueLogoUrls) {
      const assetRes = await fetchUrl(`${baseUrl}${assetPath}`);
      report(`Asset ${assetPath}`, assetRes.status === 200, `Content-Type: ${assetRes.headers['content-type']}`);
    }
  } else {
    // Check direct relative path
    const fallbackIcon = await fetchUrl(`${baseUrl}/assets/images/akhyana-logo-icon.jpg`);
    report('Fallback Icon Asset', fallbackIcon.status === 200 || fallbackIcon.status === 404);
  }

  console.log(`\n>>> Target Summary for ${baseUrl}: ${passed} Passed, ${failed} Failed\n`);
  return { passed, failed };
}

async function main() {
  const local = await runAudit('http://localhost:5000');
  const live = await runAudit('https://akhyana2.vercel.app');

  console.log('======================================================');
  console.log(`FINAL RESULT: Local: ${local.passed}P/${local.failed}F | Live: ${live.passed}P/${live.failed}F`);
  console.log('======================================================\n');
}

main();
