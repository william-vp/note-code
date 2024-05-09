const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    code: {
        type: String,
        trim: true,
        required: true,
    },
    key: {
        type: String,
        trim: true,
        required: true,
    },
    theme: {
        type: String,
        default: 'light',
        enumValues: ["light", "dark"],
        required: true
    },
    language: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now(),
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now(),
        required: false
    },
    deleted_at: {
        type: Date,
        default: Date.now(),
        required: false
    }
});
module.exports = mongoose.model('Note', noteSchema);