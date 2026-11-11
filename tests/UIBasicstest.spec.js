const{test,expect}=require('@playwright/test');

test('Browser Context Playwright Test',async({browser})=>
{
    const context=await browser.newContext();
    const page=await context.newPage();
    await page.goto ('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    console.log(await page.title());
});

test('Page Title PLaywright Test',async({page})=>
{
        await page.goto ('https://www.google.com/');
        console.log(await page.title());
        await expect(page).toHaveTitle('Google');
});

