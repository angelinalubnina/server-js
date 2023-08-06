const { Schema, model } = require('mongoose');

const TypeSchema = new Schema({
    name: { type: String, unique: true, required: true },
});

module.exports = model('Type', TypeSchema);
