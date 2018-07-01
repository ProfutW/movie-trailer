const puppeteer = require('puppeteer');

const url = 'https://movie.douban.com/tag/#/?sort=R&range=0,10&tags=';

const sleep = ms => new Promise(resolve => {
    setTimeout(resolve, ms);
});

(async () => {
    console.log('Start crawl the trailer-list.');

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false,
    });

    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle2'
    });

    for (let i = 0; i < 3; i++) {
        await page.waitForSelector('.more');
        await page.click('.more');
    }

    const result = await page.evaluate(() => {
        var $ = window.$;
        var items = $('.list-wp a');
        var links = [];

        if (items.length > 0) {
            items.each((index, item) => {
                let it = $(item);
                let doubanId = it.find('div').data('id');
                let title = it.find('.title').text();
                let rate = Number(it.find('.rate').text());
                let poster = it.find('img').attr('src').replace('s_ratio', 'l_ratio');

                links.push({
                    doubanId,
                    title,
                    rate,
                    poster,
                });
            });
        }

        return links;
    });

    browser.close();

    process.send({result});
    process.exit(0);
})();