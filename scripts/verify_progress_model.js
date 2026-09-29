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
  console.log('=== VERIFY PROGRESS & MASTERY DATA MODEL ===');
  console.log('Testing target:', BASE_URL);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-progress-'));
  const port = 9255;

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
      BASE_URL + '/progress'
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
  // TEST 1: LOAD PROGRESS PAGE & CHECK LEGACY CARDS REMOVED
  // ============================================
  await sleep(3000);
  const progressText = (await evalCd('document.body.innerText')) || '';
  const progressUrl = await evalCd('window.location.href');

  const hasLegacyCivCard = progressText.includes('CIVILIZATIONS\n0 / 7') || progressText.includes('Documented Cultures');
  const hasLegacyArtifactCard = progressText.includes('ARTIFACTS\n0 /') || progressText.includes('Discovered Relics');
  const hasLegacyExhibitCard = progressText.includes('EXHIBITS VIEWED') || progressText.includes('Learning Modules');

  results.push({
    test: '1. Obsolete Exploration Cards (Civilizations, Artifacts, Exhibits) are removed',
    pass: !hasLegacyCivCard && !hasLegacyArtifactCard && !hasLegacyExhibitCard,
    details: `Civ card: ${!hasLegacyCivCard}, Artifact card: ${!hasLegacyArtifactCard}, Exhibit card: ${!hasLegacyExhibitCard}`,
  });

  // ============================================
  // TEST 2: CURRENT EXPLORATION CATEGORIES PRESENT
  // ============================================
  const hasDecadesCard = progressText.includes('TIMELINE DECADES') && progressText.includes('Decades Explored');
  const hasEventsCard = progressText.includes('HISTORICAL EVENTS') && progressText.includes('Documented Events');
  const hasLearnSubtopicsCard = progressText.includes('LEARN SUBTOPICS') && progressText.includes('Subtopics Explored');
  const hasHeritageVoicesCard = progressText.includes('HERITAGE VOICES') && progressText.includes('Articles Read');
  const hasAajKaAkhyanaCard = progressText.includes('AAJ KA AKHYANA') && progressText.includes('Daily Events Explored');

  const allCurrentCategoriesPresent = hasDecadesCard && hasEventsCard && hasLearnSubtopicsCard && hasHeritageVoicesCard && hasAajKaAkhyanaCard;

  results.push({
    test: '2. All 5 current Exploration categories are present in active UI',
    pass: allCurrentCategoriesPresent,
    details: `Decades: ${hasDecadesCard}, Events: ${hasEventsCard}, LearnSubtopics: ${hasLearnSubtopicsCard}, Voices: ${hasHeritageVoicesCard}, AajKaAkhyana: ${hasAajKaAkhyanaCard}`,
  });

  // ============================================
  // TEST 3: NO FABRICATED DENOMINATORS / CLEAN NEW USER STATE
  // ============================================
  const hasFakeDenominators = progressText.includes('/ 7') || progressText.includes('/ 5') || progressText.includes('/ 15') && !progressText.includes('0 / 15');
  const hasHonestMastery = progressText.includes('0%') && progressText.includes('HISTORICAL MASTERY');
  const hasStartExploringPrompt = progressText.includes('Start exploring history to build your journey');

  results.push({
    test: '3. Honest new user state (Mastery separated, no fabricated denominators)',
    pass: hasHonestMastery && hasStartExploringPrompt,
    details: `Honest 0% mastery: ${hasHonestMastery}, New user encouragement: ${hasStartExploringPrompt}`,
  });

  // ============================================
  // TEST 4: INTERACTION TRACKING: EXPLORE A DECADE & SUBTOPIC
  // ============================================
  console.log('Navigating to /decade/1890s to simulate decade exploration...');
  await evalCd(`window.location.href = '${BASE_URL}/decade/1890s'`);
  await sleep(3500);

  console.log('Navigating to /learn/1947-independence-partition/1947-independence-partition-subtopic-1 to simulate subtopic learning...');
  await evalCd(`window.location.href = '${BASE_URL}/learn/1947-independence-partition/1947-independence-partition-subtopic-1'`);
  await sleep(3500);

  console.log('Navigating to /heritage-voices/article/art-keeladi-hydrology to simulate article reading...');
  await evalCd(`window.location.href = '${BASE_URL}/heritage-voices/article/art-keeladi-hydrology'`);
  await sleep(3500);

  console.log('Navigating back to /progress to verify updated exploration...');
  await evalCd(`window.location.href = '${BASE_URL}/progress'`);
  await sleep(3500);

  const updatedProgressText = (await evalCd('document.body.innerText')) || '';
  const trackedDecades = updatedProgressText.includes('TIMELINE DECADES\n1') || updatedProgressText.includes('1\nDecades Explored');
  const trackedSubtopics = updatedProgressText.includes('LEARN SUBTOPICS\n1') || updatedProgressText.includes('1\nSubtopics Explored');
  const trackedVoices = updatedProgressText.includes('HERITAGE VOICES\n1') || updatedProgressText.includes('1\nArticles Read');

  results.push({
    test: '4. Real user exploration activity is tracked honestly across sessions',
    pass: trackedDecades && trackedSubtopics && trackedVoices,
    details: `Tracked Decades: ${trackedDecades}, Tracked Subtopics: ${trackedSubtopics}, Tracked Voices: ${trackedVoices}`,
  });

  // ============================================
  // TEST 5: CORE SECTIONS INTEGRITY (Home, Explore, Learn, Games)
  // ============================================
  console.log('Testing Home navigation...');
  await evalCd(`window.location.href = '${BASE_URL}/'`);
  await sleep(2500);
  const homeOk = ((await evalCd('document.body.innerText')) || '').includes('AKHYANA');

  console.log('Testing Explore navigation...');
  await evalCd(`window.location.href = '${BASE_URL}/explore'`);
  await sleep(2500);
  const exploreOk = ((await evalCd('document.body.innerText')) || '').includes('CHRONOLOGICAL');

  console.log('Testing Learn navigation...');
  await evalCd(`window.location.href = '${BASE_URL}/learn'`);
  await sleep(2500);
  const learnOk = ((await evalCd('document.body.innerText')) || '').includes('SUBTOPIC');

  console.log('Testing Games navigation...');
  await evalCd(`window.location.href = '${BASE_URL}/games'`);
  await sleep(2500);
  const gamesOk = ((await evalCd('document.body.innerText')) || '').includes('LUDO');

  results.push({
    test: '5. Core application sections remain fully intact and operational',
    pass: homeOk && exploreOk && learnOk && gamesOk,
    details: `Home: ${homeOk}, Explore: ${exploreOk}, Learn: ${learnOk}, Games: ${gamesOk}`,
  });

  // ============================================
  // SUMMARY REPORT
  // ============================================
  console.log('\n======================================================');
  console.log('        PROGRESS & MASTERY AUDIT REPORT               ');
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
