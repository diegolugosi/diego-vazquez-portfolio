const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const url = process.argv[2] || 'http://localhost:8000';
const outDir = process.argv[3] || 'assets/images';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  console.log('Opening', url);
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for at least one canvas in the work gallery
  await page.waitForSelector('#work-gallery canvas', { timeout: 15000 });

  // Extract dataURLs for all canvases inside #work-gallery
  const dataUrls = await page.evaluate(() => {
    const canvases = Array.from(document.querySelectorAll('#work-gallery canvas'));
    return canvases.map((c) => c.toDataURL('image/png'));
  });

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  if (!dataUrls || dataUrls.length === 0) {
    console.error('No canvases found in #work-gallery.');
    await browser.close();
    process.exit(1);
  }

  for (let i = 0; i < dataUrls.length; i++) {
    const data = dataUrls[i].split(',')[1];
    const buffer = Buffer.from(data, 'base64');
    const filePath = path.join(outDir, `work-${String(i + 1).padStart(2, '0')}.png`);
    fs.writeFileSync(filePath, buffer);
    console.log('Saved', filePath);
  }

  await browser.close();
  console.log('Done.');
})();
