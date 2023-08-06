const Router = require('express');
const deviceController = require('../controllers/deviceController');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/AuthMiddleware');
const checkRole = require('../middleware/RoleMiddleware');

const router = new Router();
router.post(
    '/',
    authMiddleware,
    checkRole(['ADMIN']),
    check('name', 'Поле name не имеет значения').notEmpty(),
    check('typeName', 'Поле typeName не имеет значения').notEmpty(),
    check('brandName', 'Поле brandName не имеет значения').notEmpty(),
    check('price', 'Поле price не имеет значения').notEmpty(),
    check('price', 'Поле price должно иметь числовое значение').isNumeric(),
    deviceController.create,
);
router.get('/', deviceController.getAll);
router.get('/:name', deviceController.getOne);
router.delete(
    '/:name',
    authMiddleware,
    checkRole(['ADMIN']),
    deviceController.delete,
);

module.exports = router;
