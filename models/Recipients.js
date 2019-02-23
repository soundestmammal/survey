const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientSchema = new Schema({
    email: String,
    clicked: { type: String, default: 0 }
})

module.exports = recipientSchema;