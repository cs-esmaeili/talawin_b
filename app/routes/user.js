const { Router } = require("express");

const user = require("../controllers/user");

const router = new Router();

router.post("/registerPure", user.registerPure);
router.post("/updateRegisterPure", user.updateRegisterPure);
router.post("/userList", user.userList);
router.post("/userPermissions", user.userPermissions);

module.exports = router;