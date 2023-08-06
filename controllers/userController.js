const userService = require('../services/user-service');
const UserModel = require('../models/user');
const { validationResult } = require('express-validator');
const ApiError = require('../error/ApiError');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');

const generateJwt = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
        expiresIn: '24h',
    });
};

//почитать про хеширование паролей и токены как хранятся пароли на сервере
//посмотреть ролик про валидацию на nodejs
//почитать про коды ошибок и чем internal отличается от badrequest
class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest('Ошибка при валидации', errors.array()),
                );
            }
            const { email, password } = req.body;
            console.log({ email, password });
            const userData = await userService.registration(email, password);
            //в куки можно еще записать флаг secure если мы используем https
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: false,
            });
            console.log(userData);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: false,
            });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }
    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
    async deleteUser(req, res, next) {
        const { email } = req.params;
        const result = await UserModel.findOneAndDelete({ email });
        if (!result) {
            return next(
                ApiError.BadRequest('Пользователь c таким email не найден'),
            );
        }
        return res.json(result);
    }
    async changePassword(req, res, next) {}
    async check(req, res, next) {
        const userDto = new UserDto(req.user);
        const tokens = tokenService.generateTokens({ ...userDto });
        return res.json({ ...tokens });
    }
}

module.exports = new UserController();
