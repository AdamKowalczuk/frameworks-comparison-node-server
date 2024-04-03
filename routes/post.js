const express = require("express");
const multer = require("multer");
const postController = require("../controllers/post");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/api/posts", isAuth, postController.getPosts);
router.get("/api/posts/:postId", isAuth, postController.getPost);
router.get("/api/posts/search/:query", isAuth, postController.searchPosts);
router.post("/api/posts", isAuth, upload.single("file"), postController.createPost);
router.put("/api/posts/:postId", isAuth, postController.updatePost);
router.delete("/api/posts/:postId", isAuth, postController.deletePost);
router.post("/api/posts/:postId/like", isAuth, postController.likePost);
router.post("/api/posts/:postId/unlike", isAuth, postController.unlikePost);
router.get("/api/posts/liked/:userId", isAuth, postController.getLikedPosts);

module.exports = router;
