
const{test,expect}=require('@playwright/test');

test('Ecom App Login', async ({browser})=>
{
    const context= await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await expect(page).toHaveTitle("Let's Shop");
    console.log(await page.title());
    await page.locator("#userEmail").fill("babithachrisjin@gmail.com");
    await page.locator("#userPassword").fill("Babitha@123");
    await page.locator("#login").click();
    await expect(page).toHaveURL("https://rahulshettyacademy.com/client/#/dashboard/dash");
    console.log(await page.url());

    await page.locator(".card-body b").first().waitFor();
    const productTitles = await page.locator(".card-body b").allTextContents();
    console.log(productTitles);
     const productTitle = await page.locator(".card-body b").nth(0).textContent();
    console.log(productTitle);

    await page.locator("text = Add To Cart").first().click();    
    await page.locator("[routerlink*= 'cart']").click();

    await page.locator("li h3").first().waitFor();
    const cartItemTitles = await page.locator("li h3").allTextContents();
    console.log(cartItemTitles);
  
    await page.locator("text = Checkout").click();

    await page.locator("[placeholder*='Country']").pressSequentially("tur",{delay:150});
    await page.locator("[type='button']").first().waitFor();
    await page.locator("[type='button']").first().click();
    console.log(await page.locator("[placeholder*='Country']").inputValue());

    await page.locator("text=Place Order ").click();

    await page.locator("[routerlink*='myorders']").last().click();

    const orders = await page.locator("[routerlink*='myorders']").first().waitFor();

    const ordersCount = await page.locator("[routerlink*='myorders']").count();
    console.log(ordersCount);
   
    await page.locator("td button").first().click();

    await page.locator(".btn-container").click();

    await page.pause();
});