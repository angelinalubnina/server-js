const BrandModel = require('../models/brand');
const ApiError = require('../error/ApiError');

class BrandController {
    async create(req, res) {
        const { name } = req.body;
        const existBrand = await BrandModel.findOne({ name });
        if (existBrand) {
            return res.json('Бренд уже существует в БД');
        }
        const brand = await BrandModel.create({ name });
        return res.json(brand);
    }
    async getAll(req, res) {
        const brands = await BrandModel.find();
        return res.json(brands);
    }
    async getOne(req, res, next) {
        const { name } = req.params;
        const brand = await BrandModel.findOne({ name });
        if (!brand) {
            return next(ApiError.BadRequest('Бренд c таким именем не найден'));
        }
        return res.json(brand);
    }

    async delete(req, res, next) {
        const { name } = req.params;
        const result = await BrandModel.findOneAndDelete({ name });
        if (!result) {
            return next(ApiError.BadRequest('Бренд c таким именем не найден'));
        }
        return res.json(result);
    }
}

module.exports = new BrandController();
