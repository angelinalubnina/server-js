const { Schema, model } = require('mongoose');

const RateSchema = new Schema({
    device: { type: Schema.Types.ObjectId, ref: 'Device' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, require: true },
});

module.exports = model('Rate', RateSchema);
