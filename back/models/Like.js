const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    matchId: {
        type: Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    }
}, {
    collection: 'likes',
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
