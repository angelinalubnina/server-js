module.exports = class UserDto {
    email;
    _id;
    isActivated;
    role;

    constructor(model) {
        this.email = model.email;
        this._id = model._id;
        this.role = model.role;
        this.isActivated = model.isActivated;
    }
};
