const { extractBearer } = require('./../utils/bearer');
const { verifyToken, refreshTokenTime, getToken } = require('../utils/token');
const { getUserFromToken } = require('../utils/general');
const Role = require('./../database/models/Role');
const Permission = require('./../database/models/Permission');
const passRoutes = require('./../static/PassRouts.json');

exports.checkRoutePermission = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const currentRoute = req.path;
        
        if (passRoutes.includes(currentRoute)) {
            next();
            return;
        }

        
        if (!authHeader && !authHeader.startsWith('Bearer ')) {
            throw { message: 'Bearer Token is missing', statusCode: 401 };
        }
        
        const bearerToken = extractBearer(authHeader);
        req.token = bearerToken;
        
        const checkToken = await verifyToken(bearerToken);
        const user = await getUserFromToken(bearerToken);

        const permissions = (await Role.findOne({ _id: user.role_id })).permissions;
        const permission = await Permission.find({ _id: { $in: permissions }, route: currentRoute });

        if (permission.length === 0) {
            throw { message: 'Access denied: Insufficient permissions', statusCode: 403 };
        }

        
        const token_id = (await getToken(bearerToken))._id;
        const refresh = await refreshTokenTime(token_id);

        req.body.user = user;
        next();
    } catch (err) {
        res.status(err.statusCode || 500).json(err);
    }
}