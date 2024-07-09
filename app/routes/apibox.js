const { Router } = require("express");

const apibox = require("../controllers/apibox");

const router = new Router();

router.post("/apiBoxList", apibox.apiBoxList);

module.exports = router;