const { chromium } = require('playwright');

// Selectors 
const signin = '#__next > main > header > div > div > div.header__actions > div.header__actions-item.header__actions-item--sign-in > a';
const signInWithPhone = '#main > div > div.page__layout > div.page__content > main > div > div.registration__form > form > div:nth-child(3) > div > span > span > span';
const inputCode = '#main > div > div.page__layout > div.page__content > main > div > div.registration__form > form > div.form__control.form__control--vertical > div.form__field > div';
const continueBtn = '#main > div > div.page__layout > div.page__content > main > div > div.registration__form > form > div:nth-child(4) > button';
const passBtn = '#main > div > div.page__layout > main > div.page__content-inner > div > div > span > div.encounters-user__controls > div > div:nth-child(2) > div > div:nth-child(2) > div > div.encounters-action__icon';
const smashBtn = '#main > div > div.page__layout > main > div.page__content-inner > div > div > span > div.encounters-user__controls > div > div:nth-child(2) > div > div:nth-child(4) > div > div.encounters-action__icon';

// Generate a random delay value
const randomValueGenerator = (max) => {
  return Math.round(Math.random() * max) * 1000;
}

// Generic Swipe Logic
const swipe = async (page) => {    
    const delay = randomValueGenerator(7);
    for(let count = 0; count < 10; count++) {
      console.log("Count: " + count);
          if(count % 4 === 0 || count % 7 === 0 || count % 9 === 0) {
            await page.click(passBtn);
          } else {
            await page.click(smashBtn);
          }
     }
}


(async () => {

  /* Initialize Playwright to use chromium */
  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  const page = await browser.newPage();

  // Go to page
  await page.goto('https://bumble.com/en/the-buzz/bumble-web-the-same-experience-without-your-phone');

  // Click on signup
  await page.click(signin);

  // Click on sigin with phone number
  await page.click(signInWithPhone);

  // Enter the phone number
  await page.keyboard.type('8369777276');

  // Click continue
  await page.click(continueBtn);

  // Prompt the user for the code
  const prompt = require('prompt-sync')();
  const userCode = prompt('Enter the code: ');

  // Focus on the input code element
  await page.focus(inputCode);

  // Enter the code
  await page.keyboard.type(userCode);

  // Swipe
  try {
    await swipe(page);
  } catch {
    await swipe(page);
  }

})();
