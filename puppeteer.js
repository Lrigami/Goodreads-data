require ('dotenv').config();
const puppeteer = require ('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.goodreads.com/ap/signin?language=en_US&openid.assoc_handle=amzn_goodreads_web_na&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.goodreads.com%2Fap-handler%2Fsign-in&siteState=eyJyZXR1cm5fdXJsIjoiaHR0cHM6Ly93d3cuZ29vZHJlYWRzLmNvbS8ifQ%3D%3D');

    await page.type('#ap_email', process.env.GOODREADS_EMAIL);
    await page.type('#ap_password', process.env.GOODREADS_MDP);

    const connectionBtn = '#signInSubmit';
    await page.click(connectionBtn);

    await page.goto('https://www.goodreads.com/review/import');
    
    const exportBtn = '.js-LibraryExport';
    await page.click(exportBtn);

    const exportedData = '#exportFile a';
    await page.waitForSelector(exportedData);
    await page.click(exportedData);
})();