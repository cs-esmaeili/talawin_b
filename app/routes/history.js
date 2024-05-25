const { Router } = require("express");

const history = require("../controllers/history");

const router = new Router();

router.post("/historyList", history.historyList);

module.exports = router;