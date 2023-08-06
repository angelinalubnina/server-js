const Router = require('express');
const typeController = require('../controllers/typeController');
const checkRole = require('../middleware/RoleMiddleware');
const authMiddleware = require('../middleware/AuthMiddleware');

const router = new Router();

router.post('/', authMiddleware, checkRole(['ADMIN']), typeController.create);
router.get('/', typeController.getAll);
router.get('/:name', typeController.getOne);
router.delete(
    '/:name',
    authMiddleware,
    checkRole(['ADMIN']),
    typeController.delete,
);

module.exports = router;
