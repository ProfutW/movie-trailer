const cdp = require('child_process');
const {resolve} = require('path');
const Movie = require('mongoose').model('Movie');

(async () => {
    const movies = await Movie.find({
        trailer: null
    });
    if (!movies || movies.length === 0) return;
    const script = resolve(__dirname, '../crawler/video.js');
    const subprocess = cdp.fork(script);
    let doubanId = movies.map(movie => {
        return movie.doubanId;
    });
    subprocess.send(doubanId);
    let invoked = false;

    subprocess.on('error', err => {
        if (invoked) return;
        invoked = true;
        console.error(err);
    });

    subprocess.on('exit', code => {
        if (invoked) return;
        invoked = true;
        const err = code === 0 ? null : new Error('exit code ' + code);
        if (err) console.error(err);
    });

    subprocess.on('message', data => {
        movies.forEach(async movie => {
            movie.trailer = data[movie.doubanId].trailer;
            movie.cover = data[movie.doubanId].cover;
            movie.save();
        });
    });
})();