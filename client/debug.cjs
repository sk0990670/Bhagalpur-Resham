const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  await page.goto('http://localhost:5173/login');
  
  // Wait for login form
  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', 'sk0990670@gmail.com');
  await page.type('input[type="password"]', '91Saymyname');
  await page.click('button[type="submit"]');
  
  // Wait for navigation or a bit of time
  await new Promise(r => setTimeout(r, 2000));
  
  // Go to inventory page
  await page.goto('http://localhost:5173/admin/inventory');
  await new Promise(r => setTimeout(r, 3000));
  
  await browser.close();
})();
