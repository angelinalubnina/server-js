const Router = require('express')
const propertyController = require('../controllers/propertyController')
const checkRole = require('../middleware/RoleMiddleware')
const authMiddleware = require('../middleware/AuthMiddleware')


const router = new Router()

router.post('/', authMiddleware, checkRole(['ADMIN']), propertyController.create )
router.get('/', propertyController.getAll)

module.exports = router
