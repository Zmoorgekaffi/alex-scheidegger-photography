const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

  const consoleMsgs = [];
  page.on('console', (msg) => consoleMsgs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', (err) => consoleMsgs.push(`[pageerror] ${err.message}`));

  await page.goto('http://localhost:4300', { waitUntil: 'networkidle' });

  // Wait a beat for afterNextRender + IntersectionObserver setup
  await page.waitForTimeout(500);

  const tileCount = await page.locator('.gallery-tile').count();
  console.log('tileCount', tileCount);

  const initialOpacities = await page.locator('.gallery-tile').evaluateAll((els) =>
    els.map((el) => getComputedStyle(el).opacity)
  );
  console.log('initialOpacities (first 10)', initialOpacities.slice(0, 10));

  await page.screenshot({ path: 'C:\\Users\\andre\\AppData\\Local\\Temp\\claude\\c--Users-andre-Documents-Umschulung-Projekte-alex-seite---one-pager\\bebccf55-27ac-49ce-8c2e-ad1d137ae0fb\\scratchpad\\shot-1-top.png' });

  // Scroll down toward the gallery in steps, screenshotting each time
  for (let i = 1; i <= 4; i++) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(600);
    await page.screenshot({ path: `C:\\Users\\andre\\AppData\\Local\\Temp\\claude\\c--Users-andre-Documents-Umschulung-Projekte-alex-seite---one-pager\\bebccf55-27ac-49ce-8c2e-ad1d137ae0fb\\scratchpad\\shot-scroll-${i}.png` });
  }

  const laterOpacities = await page.locator('.gallery-tile').evaluateAll((els) =>
    els.map((el) => getComputedStyle(el).opacity)
  );
  console.log('laterOpacities (first 10)', laterOpacities.slice(0, 10));

  const transforms = await page.locator('.gallery-tile').evaluateAll((els) =>
    els.slice(0, 6).map((el) => getComputedStyle(el).transform)
  );
  console.log('transforms (first 6)', transforms);

  console.log('--- console/page errors ---');
  console.log(consoleMsgs.join('\n'));

  await browser.close();
})().catch((err) => {
  console.error('SCRIPT ERROR', err);
  process.exit(1);
});
