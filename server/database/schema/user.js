const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

const userSchema = new Schema({
    username: {
        unique: true,
        type: String,
    },
    email: {
        unique: true,
        type: String,
    },
    password: {
        unique: true,
        type: String,
    },
    meta: {
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        updatedAt: {
            type: Date,
            default: Date.now(),
        }
    }
});

userSchema.pre('save', next => {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    } else {
        this.meta.updatedAt = Date.now();
    }
    next();
});

userSchema.pre('save', next => {
    if (!this.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(this.password, salt, (error, hash) => {
            if (err) return next(error);
            this.password = hash;
            next();
        });
    });
    next();
});

mongoose.model('User', userSchema);