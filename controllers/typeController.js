const TypeModel = require('../models/type'); // добавляем модель типов
const ApiError = require('../error/ApiError');

class TypeController {
    async create(req, res) {
        const { name } = req.body;
        const existType = await TypeModel.findOne({
            name,
        });
        if (existType) {
            return res.json('Тип уже существует в БД');
        }
        const type = await TypeModel.create({
            name,
        });
        return res.json(type);
    }

    async getAll(req, res) {
        const types = await TypeModel.find();
        return res.json(types);
    }

    async getOne(req, res, next) {
        const { name } = req.params;
        const type = await TypeModel.findOne({ name });
        if (!type) {
            return next(ApiError.BadRequest('Тип c таким именем не найден'));
        }
        return res.json(type);
    }

    async delete(req, res, next) {
        const { name } = req.params;
        const result = await TypeModel.findOneAndDelete({ name });
        if (!result) {
            return next(ApiError.BadRequest('Тип c таким именем не найден'));
        }
        return res.json(result);
    }
}

module.exports = new TypeController();
