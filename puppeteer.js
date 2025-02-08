require ('dotenv').config();
const puppeteer = require ('puppeteer');
const fs = require('fs');
const path = require('path');

// script to download automatically my goodreads books data
(async () => {
    // config of the folder for downloading the file
    const downloadPath = path.resolve(__dirname, 'downloads');

    if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath);
    }

    const browser = await puppeteer.launch({headless: false}); // to see the navigator
    const page = await browser.newPage();

    // go to authentification page and connect
    await page.goto('https://www.goodreads.com/ap/signin?language=en_US&openid.assoc_handle=amzn_goodreads_web_na&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.pape.max_auth_age=0&openid.return_to=https%3A%2F%2Fwww.goodreads.com%2Fap-handler%2Fsign-in&siteState=eyJyZXR1cm5fdXJsIjoiaHR0cHM6Ly93d3cuZ29vZHJlYWRzLmNvbS8ifQ%3D%3D');

    await page.type('#ap_email', process.env.GOODREADS_EMAIL, { delay: 100 });
    await page.type('#ap_password', process.env.GOODREADS_MDP, { delay: 100 });

    const connectionBtn = '#signInSubmit';
    await page.click(connectionBtn);
    await page.waitForNavigation();

    // go to the export page and export
    await page.goto('https://www.goodreads.com/review/import');

    const exportBtn = '.js-LibraryExport';
    await page.waitForSelector(exportBtn);
    await page.click(exportBtn);

    const exportedData = '#exportFile a';
    await page.waitForSelector(exportedData);
    
    const fileUrl = await page.$eval(exportedData, el => el.href);
    console.log("📥 File link:", fileUrl);

    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', { // avoid dowloading box 
        behavior: 'allow',
        downloadPath: downloadPath
    });

    const viewSource = await page.goto(fileUrl);
    const filePath = path.join(downloadPath, 'goodreads_export.csv');
    fs.writeFileSync(filePath, await viewSource.buffer());
    
    // Un buffer binaire est une structure de données qui contient des données brutes (bytes).
    // En JavaScript, un Buffer est utilisé pour stocker et manipuler des fichiers ou des données binaires, comme des images, des vidéos ou des fichiers CSV.

    await browser.close();
})();