const Router = require('express');
const brandController = require('../controllers/brandController');
const checkRole = require('../middleware/RoleMiddleware');
const authMiddleware = require('../middleware/AuthMiddleware');

const router = new Router();
router.post('/', authMiddleware, checkRole(['ADMIN']), brandController.create);
router.get('/', brandController.getAll);
router.get('/:name', brandController.getOne);
router.delete(
    '/:name',
    authMiddleware,
    checkRole(['ADMIN']),
    brandController.delete,
);

module.exports = router;
