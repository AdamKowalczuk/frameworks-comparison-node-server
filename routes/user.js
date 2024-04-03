const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const userController = require("../controllers/user");
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

const updateUserValidationRules = [body("userName").trim().not().isEmpty().withMessage("Username is required.")];

router.get("/api/users", isAuth, userController.getUsers);
router.get("/api/users/:userId", isAuth, userController.getUser);
router.put("/api/users/:userId", isAuth, upload.single("file"), updateUserValidationRules, userController.updateUser);
router.get("/api/users/:userId/posts", isAuth, userController.getUserPosts);

module.exports = router;
