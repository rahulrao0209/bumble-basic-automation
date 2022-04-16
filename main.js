const puppeteer = require('puppeteer');

(async () => {

  /* Initialize Puppeteer */
  const browser = await puppeteer.launch({ headless: false});
  const page = await browser.newPage();
  await page.setViewport({
    width: 1300,
    height: 930,
    deviceScaleFactor: 1,
  });

  // Go to page
  await page.goto('https://bumble.com/en/the-buzz/bumble-web-the-same-experience-without-your-phone');

  // Click on signup
  await page.click('#__next > main > header > div > div > div.header__actions > div.header__actions-item.header__actions-item--sign-in > a');

  // New page opens, click on signin in with phone number
  try {
    const pages = await browser.pages();
    const latestPage = pages[1];
    await latestPage.waitForNavigation();
    await latestPage.click('#main > div > div.page__layout > div.page__content > main > div > div.registration__form > form > div:nth-child(3) > div > span > span > span');

    // Enter the phone number
    await latestPage.keyboard.type('8369777276');

    // Click to continue button to login
    await latestPage.click('#main > div > div.page__layout > div.page__content > main > div > div.registration__form > form > div:nth-child(4) > button');

    // Prompt the user for the code
    const prompt = require('prompt-sync')();
    const userCode = prompt('Enter the code: ');

    // Focus on the input element and enter the userCode
    await latestPage.focus('#main > div > div.page__layout > div.page__content > main > div > div.registration__form > form > div.form__control.form__control--vertical > div.form__field > div');
    await latestPage.keyboard.type(userCode);
    
  } catch (e) {
    console.log("Signup error", e);
  }
})();