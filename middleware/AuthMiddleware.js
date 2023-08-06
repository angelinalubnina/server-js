const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');
const tokenService = require('../services/token-service');

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();
    }
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }
        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            return next(ApiError.UnauthorizedError());
        }
        const userData = tokenService.validateAccessToken(token);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }
        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};
