const Factor = require('../database/models/Factor');

exports.historyList = async (req, res, next) => {
    try {
        const { page, perPage } = req.body;
        let historys = await Factor.find({ type: [0, 1], user_id: req.body.user._id }).populate({
            path: 'products.product_id',
            model: 'Product'
        }).skip((page - 1) * perPage).limit(perPage).lean();

        const historysCount = await Factor.countDocuments({});
        res.send({ historysCount, historys });
    } catch (err) {
        res.status(err.statusCode || 500).json(err);
    }
}