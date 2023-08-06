const Router = require('express');
const userController = require('../controllers/userController');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/AuthMiddleware');
const checkRole = require('../middleware/RoleMiddleware');

const router = new Router();

router.post(
    '/registration',
    check('email', 'Введенная строка не является email').isEmail(),
    check(
        'password',
        'Пароль должен содержать хотя бы 1 заглавную букву, 1 строчную букву, 1 цифру и 1 специальный символ, а также иметь длину не менее 8 символов',
    ).isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    }),
    userController.registration,
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, checkRole(['ADMIN']), userController.getUsers);
router.delete('/:email', authMiddleware, checkRole(['ADMIN']), userController.deleteUser);
router.get('/auth', authMiddleware, userController.check);
// router.post('/password/:id', userController.changePassword)

module.exports = router;
