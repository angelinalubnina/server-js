const uuid = require('uuid');
const path = require('path');
const DeviceModel = require('../models/device');
const ColorModel = require('../models/color');
const TypeModel = require('../models/type');
const BrandModel = require('../models/brand');
const PropertyDeviceModel = require('../models/propertyDevice');
const { validationResult } = require('express-validator');
const ApiError = require('../error/ApiError');
const fs = require('fs');

function getTypeName(deviceExt, allTypes, device) {
    deviceExt.typeName = allTypes.find(
        (type) => type._id.toString() === String(device.type),
    )?.name;
}

function getBrandName(deviceExt, allBrands, device) {
    deviceExt.brandName = allBrands.find(
        (brand) => brand._id.toString() === String(device.brand),
    )?.name;
}

// async function getAvailableColors(device, deviceExt) {
//     deviceExt.availableColors = [];
//     for (const colorIdObj of device.availableColors) {
//         let a = colorIdObj._id.toString();
//         const color = await ColorModel.findById(colorIdObj._id.toString());
//         deviceExt.availableColors.push(color);
//     }
// }

class DeviceController {
    async create(req, res, next) {
        try {
            let {
                name,
                price,
                brandName,
                typeName,
                propsStr,
                description,
                colorsStr,
            } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest('Ошибка при валидации', errors.array()),
                );
            }
            const brand = await BrandModel.findOne({ name: brandName });
            if (!brand) {
                return next(
                    ApiError.BadRequest('Не найден бренд с таким именем'),
                );
            }
            const type = await TypeModel.findOne({ name: typeName });
            if (!type) {
                return next(
                    ApiError.BadRequest(
                        'Не найден тип устройства с таким именем',
                    ),
                );
            }
            const candidate = await DeviceModel.findOne({ name });
            if (candidate) {
                return next(
                    ApiError.BadRequest('Девайс с таким именем уже существует'),
                );
            }

            let images = req.files?.images;
            if (images !== undefined && !Array.isArray(images)) {
                images = [images];
            }

            let fileNames = [];
            if (images) {
                const dirName = path.resolve(
                    __dirname,
                    '..',
                    'static',
                    'devices',
                    name,
                );
                fs.mkdir(dirName, (err) => {
                    if (err) throw err;
                });
                for (const img of images) {
                    const fileName = uuid.v4() + '.jpg'; // не всегда загружается jpg!!!
                    fileNames.push(fileName);
                    img.mv(
                        path.resolve(
                            __dirname,
                            '..',
                            'static',
                            'devices',
                            name,
                            fileName,
                        ),
                    );
                }
            }

            const device = await DeviceModel.create({
                name,
                price,
                brand: brand._id,
                type: type._id,
                images: fileNames,
                description,
                availableColors: JSON.parse(colorsStr),
            });

            if (propsStr) {
                let props = JSON.parse(propsStr);
                for (const prop of props) {
                    PropertyDeviceModel.create({
                        propertyId: prop._id,
                        value: prop.value,
                        deviceId: device._id,
                    });
                }
            }

            return res.json(device);
        } catch (e) {
            next(ApiError.BadRequest(e.message));
        }
    }
    async getAll(req, res) {
        let { brandName, typeName, limit, page } = req.query; // чем отличается req.params

        const brand = await BrandModel.findOne({ name: brandName });
        const type = await TypeModel.findOne({ name: typeName });

        page = page || 1;
        limit = limit || 9;
        let offset = page * limit - limit;

        let devices;
        if (!brand && !type) {
            devices = await DeviceModel.find();
        }
        if (brand && !type) {
            devices = await DeviceModel.find({ brand: brand._id });
        }
        if (!brand && type) {
            devices = await DeviceModel.find({ type: type._id });
        }
        if (brand && type) {
            devices = await DeviceModel.find({
                brand: brand._id,
                type: type._id,
            });
        }

        const allBrands = await BrandModel.find();
        const allTypes = await TypeModel.find();
        const devicesExt = [];
        for (let device of devices) {
            let deviceExt = {
                _id: device._id,
                name: device.name,
                brand: device.brand,
                type: device.type,
                price: device.price,
                rating: device.rating,
                description: device.description,
                images: device.images,
            };
            // создаю 3 функции getTypeName... :
            // здесь вызываю две (цвета не надо)
            getTypeName(deviceExt, allTypes, device);
            getBrandName(deviceExt, allBrands, device);
            // getAvailableColors(device, deviceExt);

            devicesExt.push(deviceExt)
        }

        //найти аналогичный метод из mongoDB
        // if (!brandId && !typeId) {
        //     devices = await Device.findAndCountAll({limit, offset})
        // }
        // if (brandId && !typeId) {
        //     devices = await Device.findAndCountAll({where:{brandId}, limit, offset})
        // }
        // if (!brandId && typeId) {
        //     devices = await Device.findAndCountAll({where:{typeId}, limit, offset})
        // }
        // if (brandId && typeId) {
        //     devices = await Device.findAndCountAll({where:{typeId, brandId}, limit, offset})
        // }
        return res.json(devicesExt);
    }

    async getOne(req, res, next) {
        const { name } = req.params;
        const device = await DeviceModel.findOne({ name });

        if (!device) {
            return next(
                ApiError.BadRequest('Устройство c таким именем не найдено'),
            );
        }
        const allBrands = await BrandModel.find();
        const allTypes = await TypeModel.find();
        let deviceExt = {
            _id: device._id,
            name: device.name,
            brand: device.brand,
            type: device.type,
            price: device.price,
            rating: device.rating,
            description: device.description,
            images: device.images,
        }
        getTypeName(deviceExt, allTypes, device);
        getBrandName(deviceExt, allBrands, device);

        deviceExt.availableColors = [];
        for (const colorIdObj of device.availableColors) {
            let a = colorIdObj._id.toString();
            const color = await ColorModel.findById(colorIdObj._id.toString())
            deviceExt.availableColors.push(color);
        }

        console.log(deviceExt);
        
        return res.json(deviceExt);
    }
    async delete(req, res, next) {
        const { name } = req.params;
        const result = await DeviceModel.findOneAndDelete({ name });
        if (!result) {
            return next(
                ApiError.BadRequest('Устройство c таким именем не найдено'),
            );
        }
        return res.json(result);
    }
}

module.exports = new DeviceController();
