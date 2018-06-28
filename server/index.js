const Koa = require('koa');
const views = require('koa-views');
const static = require('koa-static');
const mongoose = require('mongoose');
const {connect, initSchemas} = require('./database/init');

(async () => {
    try {
        await connect();
        initSchemas();
        const Movie = mongoose.model('Movie');
        const movies = await Movie.find({});
        console.log(movies);
    } catch (e) {
        console.error(e);
    }
})();

const {
    resolve
} = require('path');

const app = new Koa();

app.use(views(resolve(__dirname, './views'), {
    extension: 'pug',
}));

app.use(static(__dirname + '/public'));

app.use(async (ctx, next) => {
    await next();
    await ctx.render('index');
});

app.listen(1337);