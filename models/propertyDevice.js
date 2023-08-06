const { Schema, model } = require('mongoose')

const PropertyDeviceSchema = new Schema({
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    value: { type: 'String', required: true },
    deviceId: { type: Schema.Types.ObjectId, ref: 'Device', required: true },
})

module.exports = model('PropertyDevice', PropertyDeviceSchema )