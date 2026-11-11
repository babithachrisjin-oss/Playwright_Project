
import { test, expect } from '@playwright/test';


const BASE_URL = 'https://www.testmuai.com/selenium-playground/';

//Test Scenario 1

test('Simple Form Demo', async ({ page }) => {

  // 1. Open Selenium Playground
  await page.goto(BASE_URL);

  await page.waitForLoadState('networkidle');

  // 2. Click Simple Form Demo
  await page.getByText('Simple Form Demo').click();

  // 3. Validate URL
  await expect(page).toHaveURL(/simple-form-demo/);

  // 4. Create a variable for the message
  const message = "Welcome to TestMu AI";

  // 5. Enter message in the text box
  const enterMessage = page.getByPlaceholder('Please enter your Message');
  await enterMessage.fill(message);

  console.log('Enter Message:', await enterMessage.inputValue());

  // 6. Click Get Checked Value
  await page.getByRole('button', { name: 'Get Checked Value' }).click();

  // 7. Validate the message in the right-hand panel
  const yourMessage = page.locator('p#message.mt-20');

  await expect(yourMessage).toHaveText(message);

  console.log('Your Message:', await yourMessage.textContent());


});

//Test Scenario 2

test('Drag and Drop Slider from 15 to 95', async ({ page }) => {

  // 1. Open Selenium Playground
  await page.goto(BASE_URL);

  // 2. Click Drag & Drop Sliders
  await page.getByText('Drag & Drop Sliders').click();

  // 3. Select the slider with default value 15
  const targetSlider = page.locator('input[type="range"]').nth(2);

  // 4. Drag slider to 95 using keyboard
  await targetSlider.focus();

  console.log('Current Slider Value:', await targetSlider.inputValue());

  // Move slider using keyboard
  for (let i = 15; i < 95; i++) {
    await targetSlider.press('ArrowRight');
  }

  // 5. Validate displayed range value
  await expect(page.locator('#rangeSuccess')).toHaveText('95');

  console.log('Final Slider Value:', await targetSlider.inputValue());
});

//Test Scenario 3

test('Input Form Submit', async ({ page }) => {

  // Navigate to Selenium Playground
  await page.goto(BASE_URL);

  // Click Input Form Submit
  await page.getByText('Input Form Submit').click();

  // Click Submit without entering data
  await page.getByRole('button', { name: 'Submit' }).click();

  // Verify validation error message
  await expect(page.getByText('Please fill out this field.')).toHaveCount(0);

  await page.waitForLoadState('load');

  // Fill form fields
  await page.locator('#name').fill('Babitha Merlin');
  await page.locator('#inputEmail4').fill('babitha@test.com');
  await page.getByPlaceholder('Password').fill('Password@123');
  await page.locator('#company').fill('ABC Technologies');
  await page.getByPlaceholder('Website').fill('https://example.com');

  // Select Country using visible text
  await page.locator('select[name="country"]').selectOption({ label: 'United States' });

  await page.locator('input[name="city"]').fill('New York');
  await page.locator('input[name="address_line1"]').fill('123 Main Street');
  await page.locator('input[name="address_line2"]').fill('Suite 100');
  await page.getByPlaceholder('State').fill('New York');
  await page.locator('input[name="zip"]').fill('10001');

  // Submit form
  await page.getByRole('button', { name: 'Submit' }).click();

  // Verify success message
  const displayedMessage = page.getByText('Thanks for contacting us, we will get back to you shortly.');
  await expect(displayedMessage).toBeVisible();

  console.log('Success Message:', await displayedMessage.textContent());
});

