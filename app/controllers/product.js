const Product = require("../database/models/Product");
const { goldPrice } = require('../requests/goldPrice');
const { mCreateProduct } = require('../messages/response.json');

exports.getGoldPriceFromAPI = async (req, res, next) => {
    try {
        const { data } = await goldPrice();
        global.apiData = data.result;
        return true;
    } catch (error) {
        console.error("Failed to get GoldPrice");
        return false;
    }
};

exports.productList = async (req, res, next) => {
    try {
        const { page, perPage } = req.body;
        let products = await Product.find({}).skip((page - 1) * perPage).limit(perPage).lean();
        const productsCount = await Product.countDocuments({});
        res.send({ productsCount, products });
    } catch (err) {
        res.status(err.statusCode || 500).json(err);
    }
}

exports.createProduct = async (req, res, next) => {
    try {
        const { name, disc, image, discount, apiPath, formula, visible } = req.body;
        const result = await Product.create({ name, disc, image, price: 0, discount, apiPath, formula, visible });

        if (result) {
            res.send({ message: mCreateProduct.ok });
            return;
        }
        throw { message: mCreateProduct.fail_1, statusCode: 500 };
    } catch (err) {
        if (err.code == 11000) {
            res.status(406).json({ message: mCreateProduct.fail_2, statusCode: 406 });
        } else {
            res.status(err.statusCode || 500).json(err);
        }
    }
}