const Router = require('express')
const colorController = require('../controllers/colorController')
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require('../middleware/RoleMiddleware');

const router = new Router()
router.post('/', authMiddleware, checkRole(['ADMIN']), colorController.create)
router.get('/', authMiddleware, checkRole(['ADMIN']), colorController.getAll)
router.post('/getMany', colorController.getManyByIds)

module.exports = router
