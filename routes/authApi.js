const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const { body } = require("express-validator");
const authController = require("../controllers/authController");

/**
 * @route POST api/auth/login
 * @description Login
 * @access Public
 */
router.post(
  "/login",
  validators.validate([
    body("email", "Invalid email").exists().isEmail(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  authController.loginWithEmail
);

/**
 * @route POST api/auth/login/facebook/:token
 * @description Login
 * @access Public
 */
router.get("/login/facebook/:token", authController.loginWithFacebook);

/**
 * @route POST api/auth/login/google/:token
 * @description Login
 * @access Public
 */
router.get("/login/google/:token", authController.loginWithGoogle);

module.exports = router;
