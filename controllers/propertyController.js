const PropertyModel = require('../models/property')

class PropertyController {
    async create(req, res) {
        const { name, typeId } = req.body
        const existProperty = await PropertyModel.findOne({
            name, typeId
        })
        if(existProperty) {
            return res.json('Такое свойство уже существует')
        }
        const property = await PropertyModel.create({
            name, typeId
        })
        return res.json(property)
    }
    async getAll(req, res){
        const properties = await PropertyModel.find()
        return res.json(properties) 
    }
}
module.exports = new PropertyController()
