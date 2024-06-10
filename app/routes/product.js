const { Router } = require("express");

const product = require("../controllers/product");

const router = new Router();

router.post("/productList", product.productList);
router.post("/createProduct", product.createProduct);

module.exports = router;