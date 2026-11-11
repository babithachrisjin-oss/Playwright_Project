//Create a brand new event from the admin panel, then complete a booking for that event, and finally verify the seat count drops by exactly 1.
const {test, expect} = require('@playwright/test');

//BASE_URL = https://eventhub.rahulshettyacademy.com
const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
//Credentials: < Create your own credentials>
const email = 'babithachrisjin@gmail.com';
const password = 'Babitha@123';

//1 Login
////Write a reusable login(page) helper function — you will call it at the start of the test
async function login({page, email, password}) 
{
  //Navigate to /login
  await page.goto(`${BASE_URL}/login`);

  //Fill email field (locate by placeholder you@email.com)
  await page.getByPlaceholder('you@email.com').fill(email);

  //Fill password field (locate by label Password)
  await page.getByLabel('Password').fill(password);

  //Click the login button (locate by id #login-btn)
  await page.locator('#login-btn').click();

  //Assert: link with text Browse Events → is visible (confirms login success)
  await expect(page.getByRole('link', {name: 'Browse Events →'})).toBeVisible();
}

//2 Create a new event
test('Create New Event', async ({page}) =>
{
  //Navigate to /admin/events
  await login({page, email, password});
  await page.goto(`${BASE_URL}/admin/events`);    

  //Generate a unique event title using Test Event ${Date.now()} — store this in a variable, you will need it throughout the test
 const eventTitle = `Test Event ${Date.now()}`;

  //Fill Title field (locate by id #event-title-input)
  await page.locator('#event-title-input').fill('eventTitle');

  //Fill Description textarea (locate using #admin-event-form textarea)
  await page.locator('#admin-event-form textarea').fill('Music Mela will leave you mesmerized');

  //Fill City field (locate by label City)
  await page.getByLabel('City').fill('Chennai');

  //Fill Venue field (locate by label Venue)
  await page.getByLabel('Venue').fill('Chennai Trade Center');

  //Fill Event Date & Time field (locate by label Event Date & Time) — use your futureDateValue() helper
  await page.getByLabel('Event Date & Time').fill('2026-10-02T17:00');

  //Fill Price ($) field (locate by label Price ($)) — use any number e.g. 100
  await page.getByLabel('Price ($)').fill('100');

  //Fill Total Seats field (locate by label Total Seats) — use 50
  await page.getByLabel('Total Seats').fill('50');

  //Click the submit button (locate by id #add-event-btn)
  await page.locator('#add-event-btn').click();

  //Assert: toast message Event created! is visible
  await expect(page.getByText('Event created!')).toBeVisible();
  
});

//3 Find the event card and capture seats
 test('Events', async ({page}) =>
{
  //Navigate to /events
  await login({page, email, password});
  await page.goto(`${BASE_URL}/events`); 

  //Get all event cards (locate by data-testid="event-card")
  const eventCards = page.locator('#event-card');

  //Assert the first card is visible (confirms page loaded)
  await expect(eventCards.first()).toBeVisible();

  //From all cards, filter for the one that contains your event title text
  const newCard = eventCards.filter({hasText: 'eventTitle'});

  //Assert the matched card is visible (timeout 5 seconds)
  await expect(newCard).toBeVisible({timeout: 5000});

  //Read the seat count text from that card (locate element containing text seat, parse integer from its inner text) — 
  // store this as seatsBeforeBooking
   const seatsText = await newCard.getByText('seats').innerText();   
   const seatsBeforeBooking= parseInt(seatsText, 10);
   console.log(seatsText);
   console.log(seatsBeforeBooking);

  //4 Start booking
  //On the matched event card, click the Book Now button (locate by data-testid="book-now-btn" inside the card)
  await newCard.getByTestId('book-now-btn').click();

  //5 Fill booking form
  //Assert: element with id #ticket-count has text 1 (default quantity)
  await expect(page.locator('#ticket-count')).toHaveText('1');

  //Fill Full Name (locate by label Full Name)
  await page.getByLabel('Full Name').fill('Varun');

  //Fill Email (locate by id #customer-email)
  await page.getByTestId('customer-email').fill('varun@gmail.com');

  //Fill Phone (locate by placeholder +91 98765 43210)
  await page.getByPlaceholder('+91 98765 43210').fill('9876543210');

  //Click the confirm button (locate by CSS class .confirm-booking-btn)
  await page.locator('.confirm-booking-btn').click();

  //6 Verify booking confirmation  
  //Locate the booking reference element (locate by CSS class .booking-ref, take .first())
  const bookingRefElement = page.locator('.booking-ref').first();

  //Assert it is visible
  await expect(bookingRefElement).toBeVisible();

  //Read its inner text, trim it — store as bookingRef
  const bookingRef = await bookingRefElement.innerText();
  console.log(bookingRef.trim());

  //7 Verify in My Bookings
  //Click the link View My Bookings
  await page.getByRole('button', {name: 'View My Bookings'}).click();

  //Assert: URL is BASE_URL/bookings
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);

  //Get all booking cards (locate by id #booking-card)
  await page.locator('#booking-card').first().waitFor();
  
  //Assert the first booking card is visible
  await page.locator('#booking-card').first().isVisible();
  console.log(await page.locator('#booking-card').first().textContent());

  //Filter booking cards for the one that contains an element with class .booking-ref matching your bookingRef text
  const matchedCard = page.locator('#booking-card').filter({has: page.locator('.booking-ref'), hasText: bookingRef});

  //Assert that matched card is visible
  await expect (matchedCard).toBeVisible(); 

  //Assert that matched card contains your eventTitle text
  await expect(matchedCard).toContainText('eventTitle');
  
  //8. Verify seat reduction
  //Navigate back to /events
  await page.goto(`${BASE_URL}/events`); 

  //Assert the first event card is visible
  await expect(eventCards.first()).toBeVisible();

  //Filter cards again using hasText: eventTitle
  eventCards.filter({hasText: 'eventTitle'});

  //Assert the card is visible
  await expect(eventCards.filter({hasText: 'eventTitle'})).toBeVisible({timeout: 5000});

  //Read the seat count text again (same as Step 3) — store as seatsAfterBooking
  await newCard.getByText('seats').innerText();  
  const seatsAftereBooking = parseInt(await newCard.getByText('seats').innerText(), 10);
  console.log(seatsAftereBooking);

  //Assert: seatsAfterBooking === seatsBeforeBooking - 1
  expect(seatsAftereBooking === seatsBeforeBooking - 1);

});

