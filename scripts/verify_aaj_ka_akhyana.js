const { spawn } = require('child_process');
const http = require('http');
const os = require('os');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = process.env.TEST_TARGET || 'http://localhost:5000';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  console.log('=== VERIFY AAJ KA AKHYANA DATA COVERAGE ===');
  console.log('Testing target:', BASE_URL);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-aaj-'));
  const port = 9266;

  const edge = spawn(
    EDGE_PATH,
    [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${tmpDir}`,
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-features=msFirstRunExperience,msEdgeSyncPrompt',
      '--disable-sync',
      '--disable-fre',
      BASE_URL + '/aaj-ka-akhyana'
    ],
    { stdio: 'ignore' }
  );

  await sleep(4000);
  const targets = await fetchJson(`http://localhost:${port}/json/list`);
  const target = targets.find((t) => t.type === 'page' && !t.url.startsWith('edge://')) || targets[0];
  const ws = new WebSocket(target.webSocketDebuggerUrl);

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  function evalCd(expr) {
    return new Promise((resolve) => {
      const id = Math.floor(Math.random() * 100000);
      const listener = (event) => {
        const m = JSON.parse(event.data);
        if (m.id === id) {
          ws.removeEventListener('message', listener);
          resolve(m.result && m.result.result ? m.result.result.value : null);
        }
      };
      ws.addEventListener('message', listener);
      ws.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression: expr, returnByValue: true, awaitPromise: true } }));
    });
  }

  const results = [];

  // ============================================
  // TEST 1: LOAD AAJ KA AKHYANA TODAY (30 SEPTEMBER)
  // ============================================
  await sleep(3500);
  const aajText = (await evalCd('document.body.innerText')) || '';
  const aajUrl = await evalCd('window.location.href');

  const onAaj = aajUrl.includes('/aaj-ka-akhyana');
  const hasAntiUntouchability = aajText.includes('Anti-Untouchability') || aajText.includes('Golconda');
  const hasSourceAttribution = aajText.includes('National Archives of India') || aajText.includes('Archaeological Survey of India');

  results.push({
    test: '1. 30 September displays verified historical milestones with approved sources',
    pass: onAaj && hasAntiUntouchability && hasSourceAttribution,
    details: `On Aaj: ${onAaj}, Has 30 Sept Event: ${hasAntiUntouchability}, Source attributed: ${hasSourceAttribution}`,
  });

  // ============================================
  // TEST 2: MULTIPLE EVENTS ON 30 SEPTEMBER
  // ============================================
  const hasMultipleEventsOnSept30 =
    (aajText.includes('Anti-Untouchability') && aajText.includes('Golconda')) ||
    aajText.includes('2 documented milestones');

  results.push({
    test: '2. Multiple verified events on 30 September are rendered properly',
    pass: hasMultipleEventsOnSept30,
    details: `Has both milestones: ${hasMultipleEventsOnSept30}`,
  });

  // ============================================
  // TEST 3: PREVIOUS DAY / NEXT DAY NAVIGATION
  // ============================================
  console.log('Testing Previous Day navigation...');
  const clickPrev = await evalCd(`
    (() => {
      const btn = document.querySelector('[aria-label="Navigate to previous day"]');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()
  `);
  await sleep(3500);
  const prevText = (await evalCd('document.body.innerText')) || '';
  const on29Sept = prevText.includes('29 September') && (prevText.includes('Matangini Hazra') || prevText.includes('Haj Notes'));

  console.log('Testing Next Day navigation (returning to 30 September)...');
  const clickNext = await evalCd(`
    (() => {
      const btn = document.querySelector('[aria-label="Navigate to next day"]');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()
  `);
  await sleep(3500);
  const backTodayText = (await evalCd('document.body.innerText')) || '';
  const backOn30Sept = backTodayText.includes('30 September') && backTodayText.includes('Anti-Untouchability');

  results.push({
    test: '3. Previous Day and Next Day navigation updates date and events dynamically',
    pass: clickPrev && on29Sept && clickNext && backOn30Sept,
    details: `Prev clicked: ${clickPrev}, 29 Sept loaded: ${on29Sept}, Next clicked: ${clickNext}, 30 Sept back: ${backOn30Sept}`,
  });

  // ============================================
  // TEST 4: CATEGORY FILTERS
  // ============================================
  console.log('Testing category filter: Battles...');
  const clickBattles = await evalCd(`
    (() => {
      const all = Array.from(document.querySelectorAll('*'));
      const chip = all.find(e => (e.innerText || '').trim() === 'Battles');
      if (chip) { chip.click(); return true; }
      return false;
    })()
  `);
  await sleep(2500);
  const battleText = (await evalCd('document.body.innerText')) || '';
  const filteredBattles = battleText.includes('Golconda') && !battleText.includes('Anti-Untouchability League');

  console.log('Resetting category filter to All...');
  await evalCd(`
    (() => {
      const all = Array.from(document.querySelectorAll('*'));
      const chip = all.find(e => (e.innerText || '').trim() === 'All');
      if (chip) { chip.click(); return true; }
      return false;
    })()
  `);
  await sleep(2000);

  results.push({
    test: '4. Category filtering filters events correctly on the active date',
    pass: clickBattles && filteredBattles,
    details: `Battles clicked: ${clickBattles}, Only battle shown: ${filteredBattles}`,
  });

  // ============================================
  // TEST 5: CURATED DATE STRIP CONTAINS EXTENSIVE CALENDAR COVERAGE
  // ============================================
  const dateStripText = (await evalCd('document.body.innerText')) || '';
  const hasDateStrip30Sept = dateStripText.includes('30 September') || dateStripText.includes('30 Sep');
  const hasDateStripJan = dateStripText.includes('Jan');
  const hasDateStripAug = dateStripText.includes('Aug') || dateStripText.includes('15 Aug');
  const hasDateStripDec = dateStripText.includes('Dec');

  results.push({
    test: '5. Curated milestone date strip is dynamically populated across the year',
    pass: hasDateStrip30Sept && hasDateStripJan && hasDateStripAug && hasDateStripDec,
    details: `Sept 30 chip: ${hasDateStrip30Sept}, Jan chip: ${hasDateStripJan}, Aug chip: ${hasDateStripAug}, Dec chip: ${hasDateStripDec}`,
  });

  // ============================================
  // TEST 6: EMPTY STATE PRESERVED FOR UNPOPULATED DATES
  // ============================================
  console.log('Testing unpopulated date (1 October) for honest empty state...');
  await evalCd(`
    (() => {
      const nextBtn = document.querySelector('[aria-label="Navigate to next day"]');
      if (nextBtn) nextBtn.click();
    })()
  `);
  await sleep(3500);
  const emptyDateText = (await evalCd('document.body.innerText')) || '';
  const hasHonestEmptyState = emptyDateText.includes('No verified events have been added for 1 October yet');

  results.push({
    test: '6. Honest empty state is strictly preserved for unpopulated dates',
    pass: hasHonestEmptyState,
    details: `Shows honest empty state: ${hasHonestEmptyState}`,
  });

  // ============================================
  // SUMMARY REPORT
  // ============================================
  console.log('\n======================================================');
  console.log('        AAJ KA AKHYANA COVERAGE AUDIT REPORT          ');
  console.log('======================================================');
  let allPass = true;
  for (const r of results) {
    const mark = r.pass ? '✅ [PASS]' : '❌ [FAIL]';
    if (!r.pass) allPass = false;
    console.log(`${mark} ${r.test}`);
    console.log(`     ${r.details}`);
  }
  console.log('======================================================');
  console.log(`Total: ${results.filter((r) => r.pass).length} / ${results.length} Passed`);
  console.log('======================================================\n');

  edge.kill();
  process.exit(allPass ? 0 : 1);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
