const cdp = require('child_process');
const {resolve} = require('path');

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
        invoked = false;
        const err = code === 0 ? null : new Error('exit code ' + code);
        if (err) console.error(err);
    });

    subprocess.on('message', data => {
        const result = data.result;
        console.log(data);
    });
})();