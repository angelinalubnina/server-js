const Router = require('express');
const woodController = require('../controllers/woodController');

const router = new Router();
router.post('/', woodController.get);

module.exports = router;
