const Koa = require('koa');
const views = require('koa-views');
const static = require('koa-static');
const mongodb = require('./database/init');

(async () => {
    await mongodb.connect();
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