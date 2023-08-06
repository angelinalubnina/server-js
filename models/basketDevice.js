const { Schema, model } = require('mongoose');

const BasketDeviceSchema = new Schema({
    basket: { type: Schema.Types.ObjectId, ref: 'Basket' },
    device: { type: Schema.Types.ObjectId, ref: 'Device' },
    amount: { type: Number, default: 1 },
    cost: { type: Number }, //общая стоимость или лучше прямо у корзины добавить этот атрибут
});

module.exports = model('BasketDevice', BasketDeviceSchema);
