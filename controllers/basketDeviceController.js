const BasketDeviceModel = require('../models/basketDevice');
const DeviceModel = require('../models/device');
const BasketModel = require('../models/basket');
const UserModel = require('../models/user');
const ApiError = require('../error/ApiError');

class BasketDeviceController {
    async getAll(req, res, next) {
        const email = req.user.email;
        const userId = (await UserModel.findOne({ email }))._id;
        const basketId = (await BasketModel.findOne({ user: userId }))._id;
        const basketDevices = await BasketDeviceModel.find({
            basket: basketId,
        });
        return res.json(basketDevices);
    }
    async deleteOne(req, res, next) {
        const { deviceName } = req.params;
        const device = await DeviceModel.findOne({ name: deviceName });
        if (!device) {
            return next(ApiError.BadRequest('В БД нет девайса с таким именем'));
        }
        const deviceId = device._id;

        const email = req.user.email;
        const userId = (await UserModel.findOne({ email }))._id;
        const basketId = (await BasketModel.findOne({ user: userId }))._id;
        const basketDevice = await BasketDeviceModel.findOne({
            basket: basketId,
            device: deviceId,
        });
        if (basketDevice.amount === 1) {
            await BasketDeviceModel.deleteOne({ _id: basketDevice._id });
            return res.json({ message: 'Девайс удален из корзины' });
        } else {
            basketDevice.amount -= 1;
            await basketDevice.save()
            return res.json(basketDevice)
        }
    }
    async addOne(req, res, next) {
        const { deviceName } = req.params;
        const device = await DeviceModel.findOne({ name: deviceName });
        if (!device) {
            return next(ApiError.BadRequest('В БД нет девайса с таким именем'));
        }
        const deviceId = device._id;

        const userId = (await UserModel.findOne({ email : req.user.email }))._id;
        const basketId = (await BasketModel.findOne({ user: userId }))._id;
        const existBasketDevice = await BasketDeviceModel.findOne({
            device: deviceId,
            basket: basketId,
        });
        if (existBasketDevice) {
            existBasketDevice.amount = existBasketDevice.amount + 1;
            await existBasketDevice.save();
            return res.json(existBasketDevice);
        } else {
            const basketDevice = await BasketDeviceModel.create({
                basket: basketId,
                device: deviceId,
            });
            return res.json(basketDevice);
        }
    }
}

module.exports = new BasketDeviceController();
