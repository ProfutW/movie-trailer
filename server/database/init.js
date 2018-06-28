const mongoose = require('mongoose');
const db = 'mongodb://localhost/trailer';
const glob = require('glob');
const {resolve} = require('path');

mongoose.Promise = global.Promise;

exports.initSchemas = () => {
    glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require);
};

exports.connect = () => {
    let MAX_CONNECT = 0;

    return new Promise((resolve, reject) => {        
        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
    
        mongoose.connect(db);
        mongoose.connection.on('disconnect', () => {
            if (MAX_CONNECT++ < 5) {
                mongoose.connect(db);
            } else {
                reject(new Error('Reconnected times more than 5!'));
            }
        });
        mongoose.connection.on('error', err => {
            if (MAX_CONNECT++ < 5) {
                mongoose.connect(db);
            } else {
                console.error(new Error('Reconnected times more than 5!'));
            }
            reject(err);
        });
        mongoose.connection.once('open', () => {
            resolve();
            console.log('MongoDB Connected Successfully!');
        });
    });
};