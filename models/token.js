const { Schema, model } = require('mongoose');

//сюда можно добавить IP с которого зашел пользователь
// фингерпритн браузера
const TokenSchema = new Schema({
    refreshToken: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
});

module.exports = model('Token', TokenSchema);
