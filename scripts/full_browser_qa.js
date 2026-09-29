const { spawn } = require('child_process');
const http = require('http');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = process.env.TEST_TARGET || 'https://akhyana2.vercel.app';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('=== AKHYANA FULL LIVE BROWSER QA TEST ===');
  console.log('Target URL:', BASE_URL);

  const edgeProcess = spawn(
    EDGE_PATH,
    [
      '--headless=new',
      '--remote-debugging-port=9224',
      '--disable-gpu',
      '--no-sandbox',
      '--disable-extensions',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let versionInfo = null;
  for (let i = 0; i < 20; i++) {
    await sleep(500);
    try {
      versionInfo = await fetchJson('http://localhost:9224/json/version');
      if (versionInfo && versionInfo.webSocketDebuggerUrl) break;
    } catch (_) {}
  }

  if (!versionInfo) {
    console.error('Failed to connect to browser on port 9224');
    edgeProcess.kill();
    process.exit(1);
  }

  // Get active page target
  const targets = await fetchJson('http://localhost:9224/json/list');
  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  console.log('Attached to target:', pageTarget.id);

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  let idCounter = 1;
  const pendingRequests = new Map();
  const consoleMessages = [];

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pendingRequests.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map((a) => a.value || a.description || '').join(' ');
      consoleMessages.push(`[${msg.params.type}] ${text}`);
    }
    if (msg.id && pendingRequests.has(msg.id)) {
      const { resolve, reject } = pendingRequests.get(msg.id);
      pendingRequests.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');

  async function evaluate(expression) {
    const res = await sendCommand('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result ? res.result.value : null;
  }

  async function navigate(path) {
    console.log(`Navigating to ${path}...`);
    await sendCommand('Page.navigate', { url: BASE_URL + path });
    await sleep(3500);
  }

  const testResults = [];

  // ==========================================
  // Test 1: Direct Load of HOME (/)
  // ==========================================
  await navigate('/');
  const homeTitle = await evaluate('document.title');
  const homeBody = await evaluate('document.body.innerText');
  const homeHasBranding = homeBody.includes('AKHYANA') && (homeBody.includes('CHRONICLES OF BHARAT') || homeBody.includes('HERITAGE'));
  testResults.push({
    name: '1. Home Page Render & Branding',
    pass: homeHasBranding && homeBody.length > 500,
    details: `Chars: ${homeBody.length}, Title: "${homeTitle}", Found Branding: ${homeHasBranding}`,
  });

  // ==========================================
  // Test 2: Global Navigation Tabs (Live Click Test)
  // ==========================================
  const tabsToTest = [
    { name: 'EXPLORE', href: '/explore', keyword: 'ARCHIVE' },
    { name: 'LEARN', href: '/learn', keyword: 'CURRICULUM' },
    { name: 'GAMES', href: '/games', keyword: 'CHRONOSEARCH' },
    { name: 'AAJ KA AKHYANA', href: '/aaj-ka-akhyana', keyword: 'TODAY' },
    { name: 'VOICES', href: '/heritage-voices', keyword: 'VOICES' },
    { name: 'PROGRESS', href: '/progress', keyword: 'MASTERY' },
    { name: 'HOME', href: '/', keyword: 'BHARAT' },
  ];

  for (const t of tabsToTest) {
    console.log(`Clicking tab [${t.name}] (href: ${t.href})...`);
    const clickResult = await evaluate(`
      (() => {
        // Tab buttons are inside the fixed bottom bar as <a> tags with exact hrefs
        const link = document.querySelector('a[href="${t.href}"]');
        if (link) {
          link.click();
          return { found: true, tag: link.tagName, text: link.innerText.trim() };
        }
        return { found: false };
      })()
    `);

    await sleep(2500);
    const curUrl = await evaluate('window.location.href');
    const curBody = (await evaluate('document.body.innerText')) || '';
    const onRightPage = t.name === 'HOME'
      ? (curUrl === BASE_URL || curUrl === BASE_URL + '/')
      : curUrl.includes(t.href);

    testResults.push({
      name: `2. Tab Click: ${t.name}`,
      pass: onRightPage && curBody.length > 300,
      details: `Clicked: ${JSON.stringify(clickResult)}, New URL: ${curUrl}, Body len: ${curBody.length}`,
    });
  }

  // ==========================================
  // Test 3: Direct URL Load for all core routes
  // ==========================================
  const directRoutes = [
    { path: '/explore', key: 'Explore Archives' },
    { path: '/learn', key: 'Akhyana Curriculum' },
    { path: '/games', key: 'Games Hub' },
    { path: '/aaj-ka-akhyana', key: 'Aaj Ka Akhyana' },
    { path: '/heritage-voices', key: 'Heritage Voices' },
    { path: '/progress', key: 'Progress & Mastery' },
    { path: '/game/ludo', key: 'Ludo Chaupar Setup' },
    { path: '/game/chronosearch', key: 'ChronoSearch Hub' },
  ];

  for (const r of directRoutes) {
    await navigate(r.path);
    const url = await evaluate('window.location.href');
    const body = (await evaluate('document.body.innerText')) || '';
    testResults.push({
      name: `3. Direct URL: ${r.path} (${r.key})`,
      pass: url.includes(r.path) && body.length > 200,
      details: `Loaded URL: ${url}, Body length: ${body.length}`,
    });
  }

  // ==========================================
  // Test 4: Ludo Setup & Rules Toggle
  // ==========================================
  await navigate('/game/ludo');
  console.log('Testing Ludo setup and rules accordion...');
  const rulesToggleClicked = await evaluate(`
    (() => {
      const btn = document.querySelector('[aria-label="Chaupar Rules and How to Play"]') ||
                  Array.from(document.querySelectorAll('*')).find(e => (e.innerText || '').includes('HOW TO PLAY / RULES'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()
  `);
  await sleep(1500);
  const ludoWithRules = (await evaluate('document.body.innerText')) || '';
  const has6Rules = ludoWithRules.includes('6-QUESTION QUIZ') && ludoWithRules.includes('SCORE TO MOVEMENT');
  testResults.push({
    name: '4. Ludo Setup & Rules Accordion',
    pass: rulesToggleClicked && has6Rules,
    details: `Rules toggle clicked: ${rulesToggleClicked}, Found 6 rules: ${has6Rules}`,
  });

  // ==========================================
  // Test 5: Ludo Match Play & Modal
  // ==========================================
  console.log('Starting Ludo match from setup...');
  const startMatchClicked = await evaluate(`
    (() => {
      const btn = Array.from(document.querySelectorAll('[role="button"], button')).find(e => (e.innerText || '').trim().includes('START GAME'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()
  `);
  await sleep(3500);
  const playUrl = await evaluate('window.location.href');
  const playText = (await evaluate('document.body.innerText')) || '';
  const inMatch = playUrl.includes('/game/ludo/play');

  // Test CHAUPAR Rules Modal
  const rulesModalBtnClicked = await evaluate(`
    (() => {
      const btn = Array.from(document.querySelectorAll('[role="button"], button')).find(e => (e.innerText || '').includes('CHAUPAR ℹ️'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    })()
  `);
  await sleep(1500);
  const modalText = (await evaluate('document.body.innerText')) || '';
  const modalHasRules = modalText.includes('HOW TO PLAY — CHAUPAR') && modalText.includes('NO DICE');

  testResults.push({
    name: '5. Ludo Match Play & Rules Modal',
    pass: inMatch && modalHasRules,
    details: `Play URL: ${playUrl}, In Match: ${inMatch}, Rules Modal Opened: ${modalHasRules}`,
  });

  // ==========================================
  // Test 6: Aaj Ka Akhyana Date Stepping & Modal
  // ==========================================
  await navigate('/aaj-ka-akhyana');
  console.log('Testing Aaj Ka Akhyana date stepping...');
  const initialDateText = await evaluate('document.body.innerText');
  
  // Click next day button
  const dateStepClicked = await evaluate(`
    (() => {
      const nextBtn = document.querySelector('[aria-label="Navigate to next day"]') ||
                      Array.from(document.querySelectorAll('*')).find(e => (e.innerText || '').includes('Next Day →'));
      if (nextBtn) {
        nextBtn.click();
        return true;
      }
      return false;
    })()
  `);
  await sleep(1500);
  const steppedBody = (await evaluate('document.body.innerText')) || '';
  testResults.push({
    name: '6. Aaj Ka Akhyana Date Stepping',
    pass: dateStepClicked && steppedBody.length > 200,
    details: `Step Clicked: ${dateStepClicked}, Body len: ${steppedBody.length}`,
  });

  // ==========================================
  // Summary Report
  // ==========================================
  console.log('\n======================================================');
  console.log('               FULL BROWSER QA SUMMARY                ');
  console.log('======================================================');
  let passedCount = 0;
  for (const r of testResults) {
    const mark = r.pass ? '✅ [PASS]' : '❌ [FAIL]';
    if (r.pass) passedCount++;
    console.log(`${mark} ${r.name}`);
    console.log(`     ${r.details}`);
  }
  console.log('======================================================');
  console.log(`Total: ${passedCount} / ${testResults.length} Passed`);
  console.log(`Console Logs Captured: ${consoleMessages.length}`);
  if (consoleMessages.length > 0) {
    console.log('Sample Console Logs:\n', consoleMessages.slice(0, 5).join('\n'));
  }
  console.log('======================================================\n');

  ws.close();
  edgeProcess.kill();
  process.exit(passedCount === testResults.length ? 0 : 1);
}

run().catch((err) => {
  console.error('Fatal error during QA run:', err);
  process.exit(1);
});
