import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const browser = await chromium.launch();
const page = await browser.newPage();
const consoleMsgs = [];
page.on('console', msg => consoleMsgs.push({ type: msg.type(), text: msg.text() }));
page.on('pageerror', err => consoleMsgs.push({ type: 'pageerror', text: err.message }));
page.on('requestfailed', req => consoleMsgs.push({ type: 'requestfailed', url: req.url(), failure: req.failure()?.errorText }));
await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle' });
await page.screenshot({ path: 'workspace_screenshot.png', fullPage: true });
console.log('SCREENSHOT_SAVED');
console.log(JSON.stringify(consoleMsgs, null, 2));
await browser.close();
