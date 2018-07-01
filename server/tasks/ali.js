//This task is designed for uploading static resources that are crawled from other websites to cloud so that you can enjoy the cloud service and cdn.
const OSS = require('ali-oss');
const nanoid = require('nanoid');
const aliConfig = require('../config/default').ali;
const client = new OSS.Wrapper(aliConfig);

const uploadToAli = async (url, key) => {
    return new Promise((resolve, reject) => {
        const request = url.startsWith('https') ? 'https' : (url.startsWith('http') ? 'http' : null);
        if (!request) return reject(new TypeError('url must use http or https protocal'));
        require(request).get(url, async res => {
            if (res.statusCode === 200) {
                const info = await client.putStream(key, res);
                if (info.res.status === 200) {
                    resolve(info.name);
                } else {
                    reject(info);
                }
            }
        });
    });
};

(async () => {
    const movies = [{
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2521479463.jpg',
        video: 'http://vt1.doubanio.com/201806262009/434548b3d36ecb294c9280a4240d1720/view/movie/M/402320336.mp4',
        doubanId: '26933677',
        cover: 'https://img3.doubanio.com/img/trailer/medium/2524749842.jpg?'
    }];

    movies.forEach(async movie => {
        if (movie.video && !movie.key) {
            try {
                console.log('Start upload resources...');
                const [videoKey, coverKey, posterKey] = await Promise.all([
                    uploadToAli(movie.video, nanoid() + '.mp4'),
                    uploadToAli(movie.cover, nanoid() + '.jpg'),
                    uploadToAli(movie.poster, nanoid() + '.jpg'),
                ]);

                if (videoKey) {
                    movie.videoKey = videoKey;
                }
                if (coverKey) {
                    movie.coverKey = coverKey;
                }
                if (posterKey) {
                    movie.posterKey = posterKey;
                }

                console.log(movie);
            } catch(err) {
                console.error(err);
            }
        }
    });
})();