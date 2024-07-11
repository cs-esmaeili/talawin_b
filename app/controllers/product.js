const Product = require("../database/models/Product");
const ApiBox = require("../database/models/ApiBox");
const { goldPrice } = require('../requests/goldPrice');
const { performCalculations } = require('../utils/price');
const { mCreateProduct, mUpdateProduct, mSearchProduct } = require('../static/response.json');

exports.getGoldPriceFromAPI = async (req, res, next) => {
    try {
        const { data } = await goldPrice();
        global.apiData = data.result;
    } catch (error) {
        console.error("Failed to get GoldPrice");
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
        const result = await Product.create({ name, disc, image, discount, apiPath, formula, visible });

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

exports.updateProduct = async (req, res, next) => {
    try {
        const { id, name, disc, image, discount, apiPath, formula, visible } = req.body;
        const result = await Product.updateOne({ _id: id }, { name, disc, image, discount, apiPath, formula, visible });

        if (result.modifiedCount == 1) {
            res.send({ message: mUpdateProduct.ok });
            return;
        }
        throw { message: mUpdateProduct.fail_2, statusCode: 500 };
    } catch (err) {
        console.log(err);
        res.status(406).json({ message: mUpdateProduct.fail_1, statusCode: 406 });
    }
}


exports.updateAllProductPrices = async () => {
    const products = await Product.find({});
    const updatedProducts = [];

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        if (product.apiPath == null || product.apiPath == "") {
            continue;
        }

        const apiBox = await ApiBox.findOne({ _id: product.apiBox_id });
        const apiPrice = apiBox.price;

        const price = performCalculations(product, apiPrice);

        product.price = price;
        updatedProducts.push(product);
    }
    try {
        if (updatedProducts.length > 0) {
            await Promise.all(updatedProducts.map(updatedPrice => Product.findByIdAndUpdate(updatedPrice._id, { price: updatedPrice.price })));
        }
    } catch (error) {
        console.error("Error updating products:", error);
    }
}


exports.getProductPrices = async () => {
    const products = await Product.find({}).select(["_id", "price", "discount", "visible"]).lean();
    return products;
}


exports.searchProduct = async (req, res, next) => {
    try {
        const { name } = await req.body;
        const result = await Product.find({ "name": { $regex: `.*${name}.*`, $options: "i" } });

        if (result.length <= 0) {
            throw { message: mSearchProduct.fail, statusCode: 422 };
        }
        res.send(result);
    } catch (err) {
        res.status(err.statusCode || 422).json(err);
    }
}