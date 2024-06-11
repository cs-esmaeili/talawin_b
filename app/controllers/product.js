const Product = require("../database/models/Product");
const { goldPrice } = require('../requests/goldPrice');

exports.getGoldPriceFromAPI = async (req, res, next) => {
    try {
        const { data } = await goldPrice();
        global.apiData = data.result;
        return true;
    } catch (error) {
        console.error(error);
        console.error(red("Failed to get GoldPrice"));
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
        const { name, disc, image, price, discount, apiPath, formula, visible } = req.body;
        console.log(name, disc, image, price, discount, apiPath, formula, visible);
        res.send("ad");
    } catch (err) {
        res.status(err.statusCode || 500).json(err);
    }
}