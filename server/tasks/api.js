const rp = require('request-promise-native');
const mongoose = require('mongoose');
const Movie = mongoose.model('Movie');
const Category = mongoose.model('Category');

async function fetchMovie(item) {
    const url = `http://api.douban.com/v2/movie/subject/${item.doubanId}`;
    const res = await rp(url);
    let body;
    try {
        body = JSON.parse(res);
    } catch (err) {
        console.error(err);
    }
    return body;
}

(async () => {
    const movies = await Movie.find({
        $or: [
            { summary: { $exists: false } },
            { summary: null },
            { summary: '' },
            { title: '' }
        ]
    });

    for(let i = 0, len = movies.length; i < len; i++) {
        let movie = movies[i];
        let movieDate = await fetchMovie(movie);
        movie.summary = movieDate.summary || '';
        movie.title = movieDate.title || '';
        movie.rawTitle = movieDate.original_title || '';
        movie.countries = movieDate.countries || [];
        movie.year = movieDate.year;

        if (movieDate.genres) {
            movie.movieTypes = movieDate.genres || [];

            for (let j = 0, len = movie.movieTypes.length; j < len; j++) {
                let item = movie.movieTypes[j];
                
                let cate = await Category.findOne({
                    name: item
                });

                if (!cate) {
                    cate = new Category({
                        name: item,
                        movies: [movie._id]
                    });
                } else {
                    if (!cate.movies.includes(movie._id)) {
                        cate.movies.push(movie._id);
                    } else {
                        return;
                    }
                }
                await cate.save();

                if (!movie.category) {
                    movie.category.push(cate._id);
                } else {
                    if (movie.category.includes(cate._id)) {
                        movie.category.push(cate._id);
                    }
                }
            }
        }
        await movie.save();
    }
})();