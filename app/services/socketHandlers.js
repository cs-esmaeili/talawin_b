const { getProductPrices } = require('../controllers/product');
const { getBoxPrices } = require('../controllers/apibox');
const { getUserFromToken } = require('../utils/general');
const User = require('../database/models/User');

let io = null;

exports.initSocketService = (socketIo) => {
    io = global.io;
    io.on('connection', async (socket) => {
        const token = socket.handshake.query.token;

        try {
            if (!token) {
                throw new Error('Authentication token is required');
            }

            const user = await getUserFromToken(token);

            const update = await User.updateOne({ _id: user._id }, { socket_id: socket.id });

            if (update.nModified === 0) {
                throw new Error('Socket ID update failed, no document was modified.');
            }

            globalEmiters(socket.id);

            console.log('User connected with id: ' + socket.id);

            socket.on('disconnect', () => {
                console.log('User disconnected with id: ' + socket.id);
            });

        } catch (error) {
            console.error('Authentication error:', error.message);
            socket.emit('authenticationError', { message: 'Authentication failed' });
            socket.disconnect();
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