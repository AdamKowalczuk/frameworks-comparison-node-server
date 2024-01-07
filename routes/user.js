const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const userController = require("../controllers/user");

const router = express.Router();

router.get("/api/users", userController.getUsers);
router.get("/api/users/:userId", userController.getUser);
router.put("/api/users/:userId", userController.updateUser);

module.exports = router;
