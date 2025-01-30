const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    matchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    type: {
        type: Number,
        enum: [1, 2, 3],
        required: true
    }
}, {
    collection: 'likes',
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
