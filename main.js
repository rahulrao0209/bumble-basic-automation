const { firefox } = require("playwright");
const prompt = require("prompt-sync")();

// Selectors
const signin =
  "#__next > main > header > div > div > div.header__actions > div.header__actions-item.header__actions-item--sign-in > a";
const signInWithPhone =
  "#main > div > div.page__layout > div.page__content > main > div > div.registration__form > form > div:nth-child(3) > div > span > span > span";
const inputCode =
  "#main > div > div.page__layout > div.page__content > main > div > div.registration__form > form > div.form__control.form__control--vertical > div.form__field > div";
const continueBtn =
  "#main > div > div.page__layout > div.page__content > main > div > div.registration__form > form > div:nth-child(4) > button";

// Generate a random delay value
const randomValueGenerator = (max) => {
  return Math.round(Math.random() * max) * 100;
};

// Generic Swipe Logic
const swipe = async (page) => {
  // Prompt the user for a swipe count.
  const swipeCount = +prompt("Enter the swipe count: ");

  if (typeof swipeCount !== "number") return;

  for (let count = 0; count < swipeCount; count++) {
    let delay = randomValueGenerator(8);
    if (count % 4 === 0 || count % 7 === 0 || count % 9 === 0) {
      await page.keyboard.press("ArrowRight", {
        delay: delay < 100 ? 500 : delay,
      });
    } else {
      await page.keyboard.press("ArrowLeft", {
        delay: delay < 100 ? 500 : delay,
      });
    }
  }
};

(async () => {
  /* Initialize Playwright to use chromium */
  const browser = await firefox.launch({ headless: false, slowMo: 200 });
  const page = await browser.newPage();

  // Go to page
  await page.goto(
    "https://bumble.com/en/the-buzz/bumble-web-the-same-experience-without-your-phone"
  );

  // Click on signup
  await page.click(signin);

  // Click on sigin with phone number
  await page.click(signInWithPhone);

  // Enter the phone number
  await page.keyboard.type("8369777276");

  // Click continue
  await page.click(continueBtn);

  // Prompt the user for the code
  const userCode = prompt("Enter the code: ");

  // Focus on the input code element
  await page.focus(inputCode);

  // Enter the code
  await page.keyboard.type(userCode);

  // Wait for the required page to load before swiping using keypress
  await page.waitForNavigation({ url: "https://bumble.com/app" });

  // Swipe
  try {
    await swipe(page);
  } catch {
    await swipe(page);
  }

  // Prompt the user to stop swiping or continue
  const shouldContinue = prompt("Continue swiping?(Enter Y or N): ");

  if (shouldContinue === "y" || shouldContinue === "Y") {
    try {
      await swipe(page);
    } catch {
      await swipe(page);
    }
  }

  // Close browser when done swiping
  browser.close();
})();
