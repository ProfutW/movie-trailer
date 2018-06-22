module.exports = `
doctype html
html
    head
        meta(charset='utf-8')
        meta(name='viewport', content='width=device-width, initial-scale=1')
        title Koa Server Pug
        link(rel='stylesheet', href='https://cdn.bootcss.com/bootstrap/4.1.1/css/bootstrap.min.css')
        script(src='https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js')
        script(src='https://cdn.bootcss.com/bootstrap/4.1.1/js/bootstrap.min.js')
    body
        .container
            .row
                .col-md-8
                    h1 Hello #{you}
                    p This is #{me}
                .col-md-4
                    p active pug html
`;