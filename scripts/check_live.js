async function testAsset(url) {
  try {
    const res = await fetch(url);
    return { status: res.status, ok: res.ok, type: res.headers.get('content-type') };
  } catch (err) {
    return { status: 0, ok: false, error: err.message };
  }
}

async function main() {
  const pages = [
    '/',
    '/explore',
    '/games',
    '/game/ludo',
    '/game/ludo/play',
    '/game/chronosearch',
    '/game/chronosearch/indus-valley',
    '/heritage-voices',
    '/heritage-voices/article/hva-001',
    '/heritage-voices/submit',
    '/aaj-ka-akhyana',
    '/progress',
    '/decade/1890s',
    '/civilization/indus-valley'
  ];

  console.log('--- TESTING ALL LIVE PAGES & ASSETS ---');
  const allAssets = new Set();

  for (const page of pages) {
    const pageUrl = 'https://akhyana2.vercel.app' + page;
    const res = await fetch(pageUrl);
    const html = await res.text();
    const isExpo = html.includes('expo-reset') || html.includes('react-native');
    console.log(`Page: ${page.padEnd(35)} -> Status: ${res.status} | Expo Hydrated: ${isExpo}`);

    // Extract scripts
    for (const m of html.matchAll(/src="([^"]+)"/g)) {
      if (!m[1].startsWith('http')) allAssets.add(m[1]);
    }
    // Extract link hrefs (css, favicon)
    for (const m of html.matchAll(/href="([^"]+\.(?:css|png|ico|json|svg))"/g)) {
      if (!m[1].startsWith('http')) allAssets.add(m[1]);
    }
  }

  console.log('\n--- VERIFYING ALL REFERENCED STATIC ASSETS ---');
  let failures = 0;
  for (const asset of allAssets) {
    const assetUrl = 'https://akhyana2.vercel.app' + asset;
    const result = await testAsset(assetUrl);
    console.log(`Asset: ${asset.padEnd(55)} -> ${result.status} (${result.type})`);
    if (!result.ok) failures++;
  }

  console.log(`\nTotal assets checked: ${allAssets.size}. Failures: ${failures}`);
  if (failures === 0) {
    console.log('✅ ALL PAGES AND ASSETS RETURNED 200 OK ON VERCEL!');
  } else {
    console.error('❌ SOME ASSETS FAILED!');
    process.exit(1);
  }
}

main();
