const Product = require("../database/models/Product");
const { calculateProductPrice } = require('../utils/price');
const { mCreateProduct, mUpdateProduct, mSearchProduct } = require('../static/response.json');



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
    try {
        const products = await Product.find({}).populate("apiBox_id").lean();
        const updatedProducts = [];

        for (let i = 0; i < products.length; i++) {

            const { buyPrice, sellPrice } = calculateProductPrice(products[i], products[i].apiBox_id);

            products[i].buyPrice = buyPrice;
            products[i].sellPrice = sellPrice;
            updatedProducts.push(products[i]);
        }

        if (updatedProducts.length > 0) {
            await Promise.all(updatedBoxs.map(updatedPrice => Product.findByIdAndUpdate(updatedPrice._id, { buyPrice: updatedPrice.buyPrice, sellPrice: updatedPrice.sellPrice })));
        }
    } catch (error) {
        console.error("Error updating products:", error);
    }
}


exports.getProductPrices = async () => {
    const products = await Product.find({}).lean();
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