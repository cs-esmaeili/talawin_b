const { Router } = require("express");

const product = require("../controllers/product");

const router = new Router();

router.get("/productList", product.productList);

module.exports = router;