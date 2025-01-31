const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    age: { type: String, required: true },
    gender: { type: String, required: true},
    point: { type: Number, required: true },
    url_img: { type: String, require: true},
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Match', MatchSchema);
