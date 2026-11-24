const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  page.on('pageerror', (err) => console.log('[pageerror]', err.message));

  await page.goto('http://localhost:4300', { waitUntil: 'load' });
  await page.waitForTimeout(50);

  const dbg = await page.evaluate(() => (window).__dbg);
  console.log('DBG right after load:', JSON.stringify(dbg));

  const opacities = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.gallery-tile')).map((el) => el.style.opacity)
  );
  console.log('inline opacities now:', JSON.stringify(opacities));

  await browser.close();
})().catch((err) => {
  console.error('SCRIPT ERROR', err);
  process.exit(1);
});
