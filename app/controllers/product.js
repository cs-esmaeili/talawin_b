const Product = require("../database/models/Product");

exports.productList = async (req, res, next) => {
    const products = await Product.find({});
    res.json(products);
}