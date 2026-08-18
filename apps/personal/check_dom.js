const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3005', { waitUntil: 'networkidle2' });

  const result = await page.evaluate(() => {
    const map = document.querySelector('.maplibregl-map');
    const marker = document.querySelector('.maplibregl-marker');
    return {
      map: map ? {
        exists: true,
        width: window.getComputedStyle(map).width,
        height: window.getComputedStyle(map).height,
        position: window.getComputedStyle(map).position
      } : { exists: false },
      marker: marker ? {
        exists: true,
        position: window.getComputedStyle(marker).position,
        top: window.getComputedStyle(marker).top,
        left: window.getComputedStyle(marker).left,
        transform: window.getComputedStyle(marker).transform
      } : { exists: false }
    };
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
