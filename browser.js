import puppeteer from 'puppeteer';
import fs from 'fs';
import * as SELECTORS from './selectors.js';

const isHeadless = true;

const delay = 3000;
// await new Promise((r) => setTimeout(r, 1000));

const SS_PATH = './screenshots/';

const SS_OBJECT = {
  QR_CODE: 'qr.png',
  DRAWER_LEFT: 'drawer_left.png',
};

/**
 * Delete images from folder
 */
Object.keys(SS_OBJECT).forEach((key) => {
  fs.unlink(SS_PATH + SS_OBJECT[key], (error) => {
    if (error) console.warn(error);
  });
});

(async () => {
  const browser = await puppeteer.launch({ headless: isHeadless });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
  );

  await page.goto('https://web.whatsapp.com');

  await page.waitForSelector(SELECTORS.QR_CODE);

  await page.screenshot({ path: SS_PATH + SS_OBJECT.QR_CODE });

  await page.waitForSelector(SELECTORS.DRAWER_LEFT);

  await new Promise((r) => setTimeout(r, delay));

  await page.screenshot({ path: SS_PATH + SS_OBJECT.DRAWER_LEFT });

  const unreadElements = await page.$$(SELECTORS.UNREAD_CLASS);

  unreadElements.forEach((element) => {
    element.click();
  });

  console.log(unreadElements);

  await browser.close();
})();
