const { Router } = require("express");

const post = require("../controllers/post");

const router = new Router();

router.post("/postList", post.postList);
router.post("/postSerach", post.postSerach);
router.post("/createPost", post.createPost);
router.post("/updatePost", post.updatePost);
router.post("/deletePost", post.deletePost);

router.post("/getPost", post.getPost);

module.exports = router;