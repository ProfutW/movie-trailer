const Koa = require('koa');
const views = require('koa-views');
const static = require('koa-static');
const {
    connect,
    initSchemas
} = require('./database/init');
const router = require('./router/index');

(async () => {
    await connect();
    initSchemas();
    require('./tasks/movie');
})();

const {
    resolve
} = require('path');

const app = new Koa();

app.use(views(resolve(__dirname, './views'), {
    extension: 'pug',
}));

app.use(static(__dirname + '/public'));

app
    .use(router.routes())
    .use(router.allowedMethods());

app.use(async (ctx, next) => {
    await next();
    await ctx.render('index');
});

app.listen(1337);