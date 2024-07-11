const { Router } = require("express");

const apibox = require("../controllers/apibox");

const router = new Router();

router.post("/apiBoxList", apibox.apiBoxList);
router.post("/addApiBox", apibox.addApiBox);

module.exports = router;