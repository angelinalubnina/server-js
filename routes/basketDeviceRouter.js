const Router = require('express');
const basketDeviceController = require('../controllers/basketDeviceController');
const authMiddleware = require('../middleware/AuthMiddleware');

const router = new Router();
router.post('/:deviceName', authMiddleware, basketDeviceController.addOne);
router.delete('/:deviceName', authMiddleware, basketDeviceController.deleteOne);
router.get('/', authMiddleware, basketDeviceController.getAll);

module.exports = router;
