const puppeteer = require('puppeteer');

// Selectors 
const signup = '#__next > main > header > div > div > div.header__actions > div.header__actions-item.header__actions-item--sign-in > a';
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

    console.log("Page: ", page);
    
    await page.waitForNavigation(); 
    const pass = await page.$(passBtn);
    console.log("PASS: ", pass);

    // if(pass) {
    //   console.log("PASS BUTTON: ",  page.$(passBtn));
    //   // await page.click(passBtn);
    // }

  //   for(let count = 0; count < 10; count++) {
  //     console.log("Count: " + count);

  //     try {
        
  //         if(count % 4 === 0 || count % 7 === 0 || count % 9 === 0) {
  //           await page.waitForTimeout(delay);
  //           await page.click(passBtn);
  //         } else {
  //           await page.waitForTimeout(delay);
  //           await page.click(smashBtn);
  //         }
  //     } catch(e) {
  //       console.log("Smash Pass Error: ", e);
  //     }
  // }
}


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
  if(await page.$(signup)) {
    await page.click(signup);
  }

  // New page opens, click on signin in with phone number
  try {
    let pages = await browser.pages();
    let latestPage = pages[pages.length - 1];

    await latestPage.waitForNavigation();
    await latestPage.waitForSelector(signInWithPhone);
    await latestPage.click(signInWithPhone);

    // Enter the phone number
    await latestPage.keyboard.type('8369777276');

    // Click to continue button to login
    await latestPage.waitForSelector(continueBtn);
    await latestPage.click(continueBtn);

    // Prompt the user for the code
    const prompt = require('prompt-sync')();
    const userCode = prompt('Enter the code: ');

    // Focus on the input element and enter the userCode
    await latestPage.waitForSelector(inputCode);
    await latestPage.focus(inputCode);
    await latestPage.keyboard.type(userCode);
    
    pages = await browser.pages();
    console.log("PAGES: ". pages.length);
    latestPage = pages[pages.length - 1];

    console.log("PAGE: - ", latestPage);
    // await latestPage.waitForNavigation();
  

    // Swipe
    try {
      swipe(latestPage);
    } catch (e) {
      console.log("Exception", e);
    }
    
  } catch (e) {
    console.log("Signup error", e);
  }
})();
