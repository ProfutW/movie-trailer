const cdp = require('child_process');
const {resolve} = require('path');

(async () => {
    const script = resolve(__dirname, '../crawler/video.js');
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
        if (err) console.error(err);
    });

    subprocess.on('message', data => {
        console.log(data);
    });
})();