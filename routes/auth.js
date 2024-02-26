const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");
const authController = require("../controllers/auth");

const router = express.Router();

const signupValidationRules = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email.")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("E-Mail address already exists!");
        }
      });
    })
    .normalizeEmail(),
  body("password").trim().isLength({ min: 5 }),
  body("userName").trim().not().isEmpty(),
];

const signinValidationRules = [
  body("email").isEmail().withMessage("Please enter a valid email."),
  body("password").trim().notEmpty().withMessage("Password cannot be empty."),
];

router.post("/api/signup", signupValidationRules, authController.signup);

router.post("/api/signin", signinValidationRules, authController.login);

module.exports = router;
