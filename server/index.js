const Koa = require('koa');
const app = new Koa();
const {
    normal
} = require('./tpl/index.js');

app.use(async (ctx, next) => {
    ctx.res.writeHead(200, "Content-Type:text/html; charset:utf-8");
    ctx.body = normal;
});

app.listen(1337);