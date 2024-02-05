const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/api/users", isAuth, userController.getUsers);
router.get("/api/users/:userId", isAuth, userController.getUser);
router.put("/api/users/:userId", isAuth, userController.updateUser);

module.exports = router;
