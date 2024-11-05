const Factor = require('../database/models/Factor');
const { currentTime } = require('../utils/TimeConverter');

exports.executeTrade = async (req, res, next) => {
    try {
        const { price, product_id, product_price, weight, purchase } = await req.body;

        const time = currentTime();

        const result = await Factor.create({
            title: (purchase) ? "خرید" : "فروش",
            type: (purchase) ? 1 : 2,
            user_id: req.user._id,
            price,
            time: time,
            targetTime: time,
            products: [{
                product_id,
                price: product_price,
                weight,
                count: 1
            }]
        });

        if (result) {
            res.status(201).json({
                message: 'Trade successful',
                data: result
            });
        } else {
            res.status(400).json({
                message: 'Trade failed, no result returned'
            });
        }

    } catch (err) {
        console.log(err);
        res.status(err.statusCode || 422).json(err);
    }
}
