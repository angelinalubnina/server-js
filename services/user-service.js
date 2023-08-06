const UserModel = require('../models/user');
const BasketModel = require('../models/basket');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail.service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../error/ApiError');

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest(
                `Пользователь с почтовым адресом ${email} уже существует`,
            );
        }
        //зачем тут await нужен это же не работа с БД?
        const hashPassword = await bcrypt.hash(password, 7);
        const activationLink = uuid.v4();

        const user = await UserModel.create({
            email,
            password: hashPassword,
            activationLink,
        });
        // await mailService.sendActivationEmail(
        //     email,
        //     `${process.env.API_URL}/api/user/activate/${activationLink}`,
        // );

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await BasketModel.create({ user: user._id });
        await tokenService.saveToken(user._id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }
    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink });
        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка для активации');
        }
        user.isActivated = true;
        await user.save();
    }
    async login(email, password) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest(
                `Пользователь с почтовым адресом ${email} не был найден`,
            );
        }
        const isPassEquals = bcrypt.compareSync(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest(`Неверный пароль`);
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(user._id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(user._id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }
    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
}

module.exports = new UserService();
