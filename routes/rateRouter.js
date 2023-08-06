const Router = require('express');
const rateController = require('../controllers/rateController');
const authMiddleware = require('../middleware/AuthMiddleware');

const router = new Router();
router.post('/:deviceName', authMiddleware, rateController.add);
router.get('/', authMiddleware, rateController.getAll);
router.get('/:deviceName', authMiddleware, rateController.getAllByDeviceName);
