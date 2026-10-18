// Run with PLAYWRIGHT_MODULE and optional BROWSER_CHANNEL.
const fs = require('fs'), path = require('path'), assert = require('assert').strict;
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {GifReader} = require('omggif');
const root = path.resolve(__dirname, '../play.pokemonshowdown.com');
const css = fs.readFileSync(path.join(root, 'style/battle.css'), 'utf8');


(async () => {
 const browser = await chromium.launch({headless: true, ...(process.env.BROWSER_CHANNEL ? {channel: process.env.BROWSER_CHANNEL} : {})});
 try {
  for (const species of ['corviknight','chesnaught']) for (const scale of [1, 1.25, 1.5, 2]) {
   const asset = fs.readFileSync(path.join(root, 'sprites/gen5ani-back/'+species+'.gif'));
   assert(new GifReader(asset).numFrames() > 1, 'Keep the animated BW sprite');
   const page = await browser.newPage({viewport: {width: 420, height: 260}, deviceScaleFactor: scale});
   await page.route('**/*', route => route.fulfill({body: asset, contentType: 'image/gif'}));
   await page.setContent('<style>'+css+'</style><style>body{background:#33404c;color:white;font:16px sans-serif}.battle{position:relative;width:400px;height:220px;background:#33404c}img{width:95px;height:105px;margin:32px}</style><div class="battle"><img id="bw" class="pixelated" src="https://sprites.test/gen5ani-back/'+species+'.gif"><img id="xy" src="https://sprites.test/ani-back/'+species+'.gif"></div>');
   await page.locator('#bw').evaluate(image => image.decode());
   assert.equal(await page.locator('#bw').evaluate(image => getComputedStyle(image).imageRendering), 'pixelated');
   assert.equal(await page.locator('#xy').evaluate(image => getComputedStyle(image).imageRendering), 'auto');
   if (scale === 1.25) {
    await page.locator('#xy').evaluate(image => image.remove());
    await page.locator('#bw').evaluate(image => image.style.imageRendering='auto');
    await page.screenshot({path: path.join(require('os').tmpdir(), species+'-back-before.png')});
    await page.locator('#bw').evaluate(image => image.style.removeProperty('image-rendering'));
    await page.screenshot({path: path.join(require('os').tmpdir(), species+'-back-after.png')});
   }
   console.log('PASS '+species+' animated back: crisp at device scale '+scale);
   await page.close();
  }
 } finally {await browser.close();}
})().catch(error => {console.error(error);process.exitCode=1;});
