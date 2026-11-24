const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  page.on('pageerror', (err) => console.log('[pageerror]', err.message));

  await page.goto('http://localhost:4300', { waitUntil: 'load' });

  const info = await page.evaluate(() => {
    const tiles = Array.from(document.querySelectorAll('.gallery-tile'));
    return tiles.map((el, i) => {
      const img = el.querySelector('img');
      const rect = el.getBoundingClientRect();
      return {
        i,
        top: Math.round(rect.top),
        height: Math.round(rect.height),
        isLoadedClass: el.classList.contains('is-loaded'),
        imgComplete: img ? img.complete : null,
        imgNaturalW: img ? img.naturalWidth : null,
        opacity: getComputedStyle(el).opacity
      };
    });
  });
  console.log(JSON.stringify(info, null, 1));

  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log('documentHeight', docHeight);

  await browser.close();
})().catch((err) => {
  console.error('SCRIPT ERROR', err);
  process.exit(1);
});
