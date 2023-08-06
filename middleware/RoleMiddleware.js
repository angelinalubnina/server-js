const ApiError = require('../error/ApiError');

module.exports = function (roles) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next();
        }
        try {
            const user = req.user;
            if (!user){
                return next(ApiError.UnauthorizedError());
            }
            let hasRole = roles.includes(user.role);
            if (!hasRole) {
                return next(ApiError.NoAccessError());
            }
            next();
        } catch (e) {
            return next(ApiError.UnauthorizedError());
        }
    };
};
