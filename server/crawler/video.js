const puppeteer = require('puppeteer');

const base = 'https://movie.douban.com/subject/';

const crawl = async ids => {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false,
    });

    const page = await browser.newPage();
    let movies = {};
    for (let i = 0, len = ids.length; i < len; i++) {
        let id = ids[i];
        console.log(`Start crawl trailer and cover of ${id}`);
        await page.goto(base + id, {
            waitUntil: 'networkidle2'
        });
        const result = await page.evaluate(() => {
            var $ = window.$;
            var it = $('.related-pic-video');

            if (it && it.length > 0) {
                var link = it.attr('href');
                var cover = it.css('backgroundImage').replace('url("', '').replace('")', '');

                return {
                    link,
                    cover,
                };
            }
            return {};
        });

        let trailer;
        if (result.link) {
            await page.goto(result.link, {
                waitUntil: 'networkidle2'
            });

            trailer = await page.evaluate(() => {
                var $ = window.$;
                var it = $('source');

                if (it && it.length > 0) {
                    return it.attr('src');
                }
                return '';
            });
        }
        movies[id] = {};
        movies[id].trailer = trailer || '';
        movies[id].cover = result.cover || '';
    }

    browser.close();
    process.send(movies);
    process.exit(0);
};


(async () => {
    console.log('Start crawl the trailer and cover.');
    process.on('message', ids => {
        crawl(ids);
    });
})();