const utilsHelper = require("../helpers/utils.helper");
const { catchAsync, AppError, sendResponse } = utilsHelper;
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middlewares/authentication");
const { response } = require("../app");
const authController = {};
const axios = require("axios");

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  // try
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new AppError(401, "Invalid credentials"));

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return next(new AppError(401, "Wrong password"));

  accessToken = await user.generateToken();
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login successful"
  );
  // } catch (error) {
  //   next(error);
  // }
});

authController.loginWithFacebook = catchAsync(async (req, res, next) => {
  const facebookToken = req.params.token;
  console.log("facebookToken:", facebookToken);
  const response = await axios.get(
    `https://graph.facebook.com/me?fields=id,name,email&access_token=${facebookToken}`
  );

  const { name, email } = response.data;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email });
  }
  const accessToken = await user.generateToken();
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login successful"
  );
});

authController.loginWithGoogle = catchAsync(async (req, res, next) => {
  const googleToken = req.params.token;
  console.log("googleToken:", googleToken);
  const response = await axios.get(
    `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${googleToken}`
  );

  const { name, email } = response.data;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name, email });
  }
  const accessToken = await user.generateToken();
  return sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Login successful"
  );
});

module.exports = authController;
