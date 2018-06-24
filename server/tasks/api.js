const rp = require('request-promise-native');

async function fetchMovie(item) {
    const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`;
    const res = await rp(url);
    return res;
}

(async () => {
    const movies = [
        { doubanId: 2393060,
            title: '火线 第五季',
            rate: 9.7,
            poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2177042077.jpg' },
        { doubanId: 1296141,
            title: '控方证人',
            rate: 9.6,
            poster: 'https://img1.doubanio.com/view/photo/l_ratio_poster/public/p1505392928.jpg' },
        { doubanId: 26603847,
            title: '毛骗 终结篇',
            rate: 9.6,
            poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2480805230.jpg' },
    ];

    movies.map(async movie => {
        let movieDate = await fetchMovie(movie);
        
        try {
            movieDate = JSON.parse(movieDate);
            console.log(movieDate.summary);
        } catch(err) {
            console.error(err);
        }
    });
})();