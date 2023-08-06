const ColorModel = require('../models/color')

class ColorController {
    async create(req, res) {
        const { name, code } = req.body
        const existColor = await ColorModel.findOne({
            name, code
        })
        if(existColor) {
            return res.json('Цвет уже существует')
        }
        const color = await ColorModel.create({
            name, code
        })
        return res.json(color)
    }

    async getAll(req, res) {
        const colors = await ColorModel.find()
        return res.json(colors)
    }
}
module.exports = new ColorController();