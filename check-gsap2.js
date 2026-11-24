const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  page.on('console', (msg) => console.log(`[console:${msg.type()}]`, msg.text()));
  page.on('pageerror', (err) => console.log('[pageerror]', err.message));

  await page.goto('http://localhost:4300', { waitUntil: 'load' });

  // Check immediately (no artificial settle time) which tiles start hidden
  const early = await page.locator('.gallery-tile').evaluateAll((els) =>
    els.map((el, i) => ({ i, opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform }))
  );
  console.log('EARLY (right after load):', JSON.stringify(early, null, 0));

  // Now scroll gallery into full view step by step, watching a below-the-fold tile (say index 18)
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 500);
    await page.waitForTimeout(150);
    const snap = await page.locator('.gallery-tile').nth(18).evaluate((el) => ({
      opacity: getComputedStyle(el).opacity,
      transform: getComputedStyle(el).transform
    }));
    console.log(`scroll step ${i}, tile[18]:`, JSON.stringify(snap));
  }

  await page.waitForTimeout(1200);
  const finalTile18 = await page.locator('.gallery-tile').nth(18).evaluate((el) => ({
    opacity: getComputedStyle(el).opacity,
    transform: getComputedStyle(el).transform
  }));
  console.log('FINAL tile[18] after settle:', JSON.stringify(finalTile18));

  await browser.close();
})().catch((err) => {
  console.error('SCRIPT ERROR', err);
  process.exit(1);
});
