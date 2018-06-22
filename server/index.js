const Koa = require('koa');
const app = new Koa();
//const ejs = require('ejs');
const pug = require('pug');
const {
    htmlTpl,
    //ejsTpl,
    pugTpl,
} = require('./tpl/index');

app.use(async (ctx, next) => {
    ctx.res.writeHead(200, "Content-Type:text/html; charset:utf-8");
    ctx.body = pug.render(pugTpl, {
        you: 'Zhen',
        me: 'Wei',
    });
});

app.listen(1337);