const ColorModel = require('../models/color')
const DeviceModel = require('../models/device')

class ColorController {
    // async create(req, res) {
    //     const { name, code } = req.body
    //     const existColor = await ColorModel.findOne({
    //         name, code
    //     })
    //     if(existColor) {
    //         return res.json('Цвет уже существует')
    //     }
    //     const color = await ColorModel.create({
    //         name, code
    //     })
    //     return res.json(color)
    // }

    async create(req, res) {
        const { colors } = req.body
        // [{name:'', code:''},{name:'', code:''}]
        console.log(colors)
        for (const color of colors) {
            const { name, code } = color;
            const existColor = await ColorModel.findOne({
                name, code
            })
            if(existColor) {
                return res.json('Цвет уже существует')
            } else {
                const color = await ColorModel.create({
                    name, code
                })
            }
        }
        // return res.json(color)
    }

    async getAll(req, res) {
        const colors = await ColorModel.find()
        return res.json(colors)
    }

    async getManyByIds(req, res) {
        const { deviceColors } = req.body
        const deviceColorCodes = []

        for (const colorId of deviceColors) {
            const color = await ColorModel.findById(colorId)
            deviceColorCodes.push(color)
            console.log(deviceColorCodes)
        }
        return res.json(deviceColorCodes)
    }
}
module.exports = new ColorController();