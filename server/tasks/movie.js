const cdp = require('child_process');
const {
    resolve
} = require('path');
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');

(async () => {
    const script = resolve(__dirname, '../crawler/trailer-list.js');
    const subprocess = cdp.fork(script, []);
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
        if (err) {
            console.error(err);
        }
    });

    subprocess.on('message', async data => {
        const result = data.result;
        await Promise.all(result.map(item => {
            return (async () => {
                let movie = await Movie.findOne({
                    doubanId: item.doubanId
                });
                if (!movie) {
                    movie = new Movie(item);
                    await movie.save();
                }
            })();
        }));
        return require('./api');
    });
})();