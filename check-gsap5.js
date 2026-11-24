const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  page.on('pageerror', (err) => console.log('[pageerror]', err.message));

  await page.goto('http://localhost:4300', { waitUntil: 'load' });

  for (const delay of [0, 100, 300, 800, 1500]) {
    await page.waitForTimeout(delay === 0 ? 0 : delay);
    const snap = await page.evaluate(() => {
      const w = window;
      return {
        runCount: w.__dbgRunCount,
        elsCount: w.__dbgEls ? w.__dbgEls.length : null,
        viaStoredRefs: w.__dbgEls ? w.__dbgEls.map((el) => el.style.opacity) : null,
        viaFreshQuery: Array.from(document.querySelectorAll('.gallery-tile')).map((el) => el.style.opacity),
        sameNodeCheck: w.__dbgEls ? (w.__dbgEls[18] === document.querySelectorAll('.gallery-tile')[18]) : null
      };
    });
    console.log(`t+${delay}ms`, JSON.stringify(snap));
  }

  await browser.close();
})().catch((err) => {
  console.error('SCRIPT ERROR', err);
  process.exit(1);
});
