var express = require("express");
var router = express.Router();

// authApi
const authApi = require("./authApi");
router.use("/auth", authApi);

// userApi
const userApi = require("./userApi");
router.use("/users", userApi);

// blogApi
const blogApi = require("./blogApi");
router.use("/blogs", blogApi);

// reviewApi
const reviewApi = require("./reviewApi");
router.use("/reviews", reviewApi);

// reactionApi
const reactionApi = require("./reactionApi");
router.use("/reactions", reactionApi);

// friendshipApi
const friendshipApi = require("./friendshipApi");
router.use("/friends", friendshipApi);

module.exports = router;
