const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = Schema.Types;

const movieSchema = new Schema({
    doubanId: {
        unique: true,
        type: String,
    },
    category: [{
        type: ObjectId,
        ref: 'Category'
    }],
    rate: Number,
    title: String,
    rawTitle: String,
    summary: String,
    trailer: String,
    poster: String,
    cover: String,
    movieTypes: [String],
    year: Number,
    countries: [String],

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

movieSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createdAt = this.meta.updatedAt = Date.now();
    } else {
        this.meta.updatedAt = Date.now();
    }
    next();
});

mongoose.model('Movie', movieSchema);