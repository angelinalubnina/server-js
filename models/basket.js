const { Schema, model } = require('mongoose');

const BasketSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    cost: { type: Number }, //общая стоимость только тут хранить или еще и у каждого basketDevice
});

module.exports = model('Basket', BasketSchema);
