const { extractBearer } = require('./../utils/bearer');
const { checkDelayTime } = require('../utils/checkTime');
const User = require('./../database/models/User');
const Token = require('./../database/models/Token');
const Role = require('./../database/models/Role');
const Permission = require('./../database/models/Permission');

const passRoutes = [
    '/logInStepOne',
    '/logInStepTwo',
    '/site/firstPage',
    '/category/categorys',
    '/category/getCategoryData',
    '/post/getPost',
];

exports.checkRoutePermission = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const currentRoute = req.path;
        // console.log(currentRoute);
        if (passRoutes.includes(currentRoute)) {
            next();
            return;
        }
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const bearerToken = extractBearer(authHeader);
            req.token = bearerToken;
            const tokenObject = await Token.findOne({ token: bearerToken });
            if (tokenObject == null) {
                throw { message: 'Bearer Token is wrong', statusCode: 403 };
            }
            const user = await User.findOne({ token_id: tokenObject._id }).populate("token_id");
            const timeCheck = await checkDelayTime(user.token_id.updatedAt, process.env.USERS_SESSIONS_TIME);
            if (!timeCheck) {
                throw { message: 'Session expired', statusCode: 403 };
            }

            const permissions = (await Role.findOne({ _id: user.role_id })).permissions;
            const permission = await Permission.find({ _id: { $in: permissions }, route: currentRoute });

            if (permission.length === 0) {
                throw { message: 'Access denied: Insufficient permissions', statusCode: 403 };
            }
            req.body.user = user;
            next();
        } else {
            throw { message: 'Bearer Token is missing', statusCode: 401 };
        }
    } catch (err) {
        res.status(err.statusCode || 500).json(err);
    }
}