import puppeteer from "puppeteer";
import fs from "fs";
import * as SELECTORS from "./selectors.js";

const isHeadless = true;

const delay = 3000;
// await new Promise((r) => setTimeout(r, 1000));

const EXIT_TEXT = "!exit";

const SS_PATH = "./screenshots/";

const SS_OBJECT = {
  QR_CODE: "qr.png",
  DRAWER_LEFT: "drawer_left.png",
  INPUT: "input.png",
};

/**
 * Delete images from folder
 */
Object.keys(SS_OBJECT).forEach((key) => {
  fs.unlink(SS_PATH + SS_OBJECT[key], (error) => {
    if (error) console.warn(error);
  });
});

function getRandom(min, max) {
  const floatRandom = Math.random();

  const difference = max - min;

  // random between 0 and the difference
  const random = Math.round(difference * floatRandom);

  const randomWithinRange = random + min;

  return randomWithinRange;
}

const contactNameTemporal = "C&D: Cena navideña 🎅🏻";
// const contactNameTemporal = "It's vicioing time 🌑🧛‍♂️🦇⚰️🧄";

(async () => {
  const browser = await puppeteer.launch({ headless: isHeadless });

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
  );

  await page.goto("https://web.whatsapp.com");

  await page.waitForSelector(SELECTORS.QR_CODE);

  await page.screenshot({ path: SS_PATH + SS_OBJECT.QR_CODE });

  await page.waitForSelector(SELECTORS.DRAWER_LEFT);

  await new Promise((r) => setTimeout(r, delay));

  await page.screenshot({ path: SS_PATH + SS_OBJECT.DRAWER_LEFT });

  await new Promise((r) => setTimeout(r, 1000));

  await page.click(`span[title="${contactNameTemporal}"]`);

  let lastMessageSpan = "";

  while (lastMessageSpan !== EXIT_TEXT) {
    await new Promise((r) => setTimeout(r, 1000));

    await page.screenshot({ path: SS_PATH + SS_OBJECT.INPUT });

    try {
      const messagesOnScreen = await page.$$(SELECTORS.MESSAGES);
  
      const lastMessage = messagesOnScreen.pop();
  
      lastMessageSpan = await lastMessage.$eval(
        "span",
        (element) => element.textContent
      );
  
      if (lastMessageSpan === "!d20") {
        const D20 = getRandom(1, 20);
        await page.type(SELECTORS.INPUT_MESSAGE, `El lorax dice: *${D20}*`);
        await page.click(SELECTORS.SEND_BUTTON);
      }
    } catch (error) {
      lastMessageSpan = '';
      console.log(error);
    }

    console.log(`El último elemento span es: ${lastMessageSpan}`);
  }

  // const unreadElements = await page.$$(SELECTORS.UNREAD_CLASS);

  // unreadElements.forEach((element) => {
  //   element.click();
  // });

  // console.log(unreadElements);

  await browser.close();
})();
