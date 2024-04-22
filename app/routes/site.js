const { Router } = require("express");

const firstPage = require("../controllers/firstPage");

const router = new Router();

router.post("/firstPage", firstPage.firstPage);
router.post("/updateFirstPage", firstPage.updateFirstPage);

module.exports = router;