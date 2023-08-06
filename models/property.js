const { Schema, model } = require('mongoose')

const PropertySchema = new Schema({
    name: { type: String, unique: true, required: true },
    typeId: { type: Schema.Types.ObjectId, required: true }
})

module.exports = model('Property', PropertySchema)