const { getProductPrices } = require('../controllers/product');
const { getBoxPrices } = require('../controllers/apibox');
const { getUserFromToken } = require('../utils/general');
const User = require('../database/models/User');
const { userInformation } = require('../controllers/user');

let io = null;

exports.initSocketService = (socketIo) => {
    io = global.io;
    io.on('connection', async (socket) => {
        const token = socket.handshake.query.token;

        if (token) {
            try {
                const user = await getUserFromToken(token);

                const update = await User.updateOne({ _id: user._id }, { socket_id: socket.id });

                if (update.nModified === 0) {
                    throw new Error('Socket ID update failed, no document was modified.');
                }

                globalEmiters(socket.id);
                userInformationEmiter(user._id, socket.id);

                socket.on('information', async () => {
                    userInformationEmiter(user._id, socket.id);
                });

                socket.on('disconnect', async () => {
                    await User.updateOne({ _id: user._id }, { $unset: { socket_id: "" } });
                });

            } catch (error) {
                console.error('Authentication error:', error.message);
                socket.emit('authenticationError', { message: 'Authentication failed' });
                socket.disconnect();
            }
        } else {
            // Handle non-authenticated users
            console.log('Non-authenticated user connected:', socket.id);

            globalEmiters(socket.id);

            // If needed, limit the actions available to non-authenticated users
            socket.on('information', async () => {
                // Non-authenticated users won't have access to user-specific information
                socket.emit('information', { message: 'Guest users have limited access' });
            });

            socket.on('disconnect', () => {
                console.log('Non-authenticated user disconnected:', socket.id);
            });
        }
    });
};

const globalEmiters = async (socket_id) => {
    const productPrices = await getProductPrices();
    const boxPrices = await getBoxPrices();
    io.to(socket_id).emit("apiData", global.apiData);
    io.to(socket_id).emit("productPrices", productPrices);
    io.to(socket_id).emit("boxPrices", boxPrices);
};

const userInformationEmiter = async (user_id, socket_id) => {
    const information = await userInformation(user_id);
    io.to(socket_id).emit("information", information);
}
