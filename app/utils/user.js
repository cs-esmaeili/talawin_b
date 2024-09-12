const { verifyToken, refreshTokenTime, getToken } = require('./token');
const Permission = require('./../database/models/Permission');
const Token = require('./../database/models/Token');
const User = require('./../database/models/User');
const Role = require('./../database/models/Role');
const passRoutes = require('./../static/PassRouts.json');

exports.getUserFromToken = async (token) => {
    const tokenObject = await Token.findOne({ token });

    if (tokenObject == null) {
        throw { message: 'Invalid token', statusCode: 403 };
    }
    const user = await User.findOne({ token_id: tokenObject._id }).populate("token_id").populate("role_id");

    if (user == null) {
        throw { message: 'Invalid token', statusCode: 403 };
    }

    return user;
}

exports.checkUserAccess = async (token, route) => {

    if (passRoutes.includes(route)) {
        return true;
    }

    const checkToken = await verifyToken(token);
    const user = await this.getUserFromToken(token);

    const permissions = (await Role.findOne({ _id: user.role_id })).permissions;
    const permission = await Permission.find({ _id: { $in: permissions }, route });

    if (permission.length === 0) {
        throw { message: 'Access denied: Insufficient permissions', statusCode: 403 };
    }

    return true;
}