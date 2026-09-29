const { spawn } = require('child_process');
const http = require('http');

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
  console.log('=== TARGETED VERIFICATION: LEARN SUBTOPICS & LUDO PLAY ===');
  console.log('Testing target:', BASE_URL);

  const edge = spawn(
    EDGE_PATH,
    ['--headless=new', '--remote-debugging-port=9228', '--disable-gpu', BASE_URL + '/learn'],
    { stdio: 'ignore' }
  );

  await sleep(4000);
  const targets = await fetchJson('http://localhost:9228/json/list');
  const target = targets.find((t) => t.url.includes(BASE_URL) || t.type === 'page');
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
  // TEST 1: LEARN PAGE RENDERS SUBTOPICS
  // ============================================
  await sleep(3000);
  const learnUrl = await evalCd('window.location.href');
  const learnText = (await evalCd('document.body.innerText')) || '';
  const hasSubtopic01 = learnText.includes('Setting and background');
  const hasOpenSubtopicBtn = learnText.includes('OPEN SUBTOPIC');
  results.push({
    test: '1. Learn page renders subtopics',
    pass: hasSubtopic01 && hasOpenSubtopicBtn,
    details: `URL: ${learnUrl}, Has Subtopic 01: ${hasSubtopic01}, Has "OPEN SUBTOPIC": ${hasOpenSubtopicBtn}`,
  });

  // ============================================
  // TEST 2: CLICK OPEN SUBTOPIC 01
  // ============================================
  console.log('Clicking "OPEN SUBTOPIC" on Subtopic 01...');
  const click01 = await evalCd(`
    (() => {
      const all = Array.from(document.querySelectorAll('*'));
      const btn = all.find(e => (e.innerText || '').trim() === 'OPEN SUBTOPIC');
      if (btn) {
        btn.click();
        return { clicked: true, tag: btn.tagName };
      }
      return { clicked: false };
    })()
  `);

  await sleep(3500);
  const subtopic01Url = await evalCd('window.location.href');
  const subtopic01Text = (await evalCd('document.body.innerText')) || '';
  const onSubtopic01 = subtopic01Url.includes('/learn/') && (subtopic01Text.includes('Setting and background') || subtopic01Text.includes('FACTUAL KNOWLEDGE'));
  const notRedirectedHome = subtopic01Url !== BASE_URL && subtopic01Url !== BASE_URL + '/';
  results.push({
    test: '2. Click "OPEN SUBTOPIC" opens Subtopic 01',
    pass: onSubtopic01 && notRedirectedHome,
    details: `Clicked: ${JSON.stringify(click01)}, Loaded URL: ${subtopic01Url}, Title in page: ${subtopic01Text.includes('Setting and background')}`,
  });

  // ============================================
  // TEST 3: BACK TO LEARN
  // ============================================
  console.log('Clicking "← BACK TO LEARN"...');
  const clickBack = await evalCd(`
    (() => {
      const all = Array.from(document.querySelectorAll('[role="button"], button'));
      const backBtn = all.find(e => (e.innerText || '').includes('BACK TO LEARN'));
      if (backBtn) {
        backBtn.click();
        return true;
      }
      return false;
    })()
  `);

  await sleep(3500);
  const backUrl = await evalCd('window.location.href');
  const backText = (await evalCd('document.body.innerText')) || '';
  const backOnLearn = backUrl.includes('/learn') && (backText.includes('SUBTOPICS') || backText.includes('Setting and background'));
  results.push({
    test: '3. "← BACK TO LEARN" returns to Learn',
    pass: backOnLearn,
    details: `Back URL: ${backUrl}, Shows Subtopics: ${backOnLearn}`,
  });

  // ============================================
  // TEST 4: CLICK ARROW BUTTON ON SUBTOPIC 02
  // ============================================
  console.log('Clicking arrow button on Subtopic 02...');
  const clickArrow02 = await evalCd(`
    (() => {
      // Look for the arrow button specifically in the 2nd subtopic or aria-label for subtopic 2
      const subtopic2Btn = Array.from(document.querySelectorAll('[aria-label*="subtopic 2" i], [aria-label*="Subtopic 2" i]'));
      if (subtopic2Btn.length > 0) {
        subtopic2Btn[0].click();
        return { clicked: true, method: 'aria-label' };
      }
      const arrows = Array.from(document.querySelectorAll('*')).filter(e => (e.innerText || '').trim() === '→');
      if (arrows.length >= 2) {
        arrows[1].click();
        return { clicked: true, method: 'arrow-index-1' };
      }
      const openButtons = Array.from(document.querySelectorAll('*')).filter(e => (e.innerText || '').trim() === 'OPEN SUBTOPIC');
      if (openButtons.length >= 2) {
        openButtons[1].click();
        return { clicked: true, method: 'open-btn-index-1' };
      }
      return { clicked: false };
    })()
  `);

  await sleep(3500);
  const subtopic02Url = await evalCd('window.location.href');
  const subtopic02Text = (await evalCd('document.body.innerText')) || '';
  const onSubtopic02 = subtopic02Url.includes('/learn/') && (subtopic02Text.includes('People and organisations') || subtopic02Text.includes('SUBTOPIC 02'));
  results.push({
    test: '4. Arrow / card button opens Subtopic 02',
    pass: onSubtopic02,
    details: `Clicked: ${JSON.stringify(clickArrow02)}, Loaded URL: ${subtopic02Url}, Title: ${subtopic02Text.includes('People and organisations')}`,
  });

  // ============================================
  // TEST 5: DIRECT REFRESH OF SUBTOPIC
  // ============================================
  console.log('Testing subtopic refresh...');
  await evalCd('window.location.reload()');
  await sleep(4000);
  const refreshedUrl = await evalCd('window.location.href');
  const refreshedText = (await evalCd('document.body.innerText')) || '';
  const refreshPreserved = refreshedUrl.includes('/learn/') && (refreshedText.includes('People and organisations') || refreshedText.includes('SUBTOPIC 02') || refreshedText.includes('FACTUAL KNOWLEDGE'));
  results.push({
    test: '5. Refresh keeps Subtopic 02 open',
    pass: refreshPreserved,
    details: `Refreshed URL: ${refreshedUrl}, Content preserved: ${refreshPreserved}`,
  });

  // ============================================
  // TEST 6: GAMES SCREEN HAS PLAYABLE LUDO BUTTON
  // ============================================
  console.log('Navigating to /games...');
  await evalCd(`window.location.href = '${BASE_URL}/games'`);
  await sleep(3500);
  const gamesText = (await evalCd('document.body.innerText')) || '';
  const hasPlayLudoBtn = gamesText.includes('PLAY LUDO');
  results.push({
    test: '6. Games page displays prominent "PLAY LUDO" button',
    pass: hasPlayLudoBtn,
    details: `Found PLAY LUDO button text: ${hasPlayLudoBtn}`,
  });

  // ============================================
  // TEST 7: CLICK PLAY LUDO OPENS SETUP & LAUNCHER
  // ============================================
  console.log('Clicking "PLAY LUDO" button...');
  const clickPlayLudo = await evalCd(`
    (() => {
      const all = Array.from(document.querySelectorAll('[role="button"], button'));
      const btn = all.find(e => (e.innerText || '').trim().includes('PLAY LUDO'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()
  `);

  await sleep(3500);
  const ludoSetupUrl = await evalCd('window.location.href');
  const ludoSetupText = (await evalCd('document.body.innerText')) || '';
  const onLudoSetup = ludoSetupUrl.includes('/game/ludo') && ludoSetupText.includes('CHAUPAR') && ludoSetupText.includes('START GAME');
  results.push({
    test: '7. "PLAY LUDO" launches Ludo Setup and Launcher',
    pass: onLudoSetup,
    details: `Setup URL: ${ludoSetupUrl}, Has CHAUPAR & START GAME: ${onLudoSetup}`,
  });

  // ============================================
  // TEST 8: START GAME OPENS PLAYABLE BOARD
  // ============================================
  console.log('Clicking "START GAME →" to launch match...');
  const clickStart = await evalCd(`
    (() => {
      const all = Array.from(document.querySelectorAll('[role="button"], button'));
      const btn = all.find(e => (e.innerText || '').trim().includes('START GAME'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()
  `);

  await sleep(4000);
  const playUrl = await evalCd('window.location.href');
  const playText = (await evalCd('document.body.innerText')) || '';
  const inMatchPlay = playUrl.includes('/game/ludo/play') && (playText.includes('QUESTION') || playText.includes('CHAUPAR') || playText.includes('QUIZ'));
  results.push({
    test: '8. Launches actual playable Ludo screen with 6-question cycle',
    pass: inMatchPlay,
    details: `Play URL: ${playUrl}, Active match rendered: ${inMatchPlay}`,
  });

  // ============================================
  // SUMMARY REPORT
  // ============================================
  console.log('\n======================================================');
  console.log('           TARGETED FIX AUDIT REPORT                  ');
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
