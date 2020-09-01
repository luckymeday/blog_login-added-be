const utilsHelper = require("../helpers/utils.helper");
const { catchAsync, AppError, sendResponse } = utilsHelper;
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const authController = {};

authController.loginWithEmail = catchAsync(async (req, res, next) => {
  // try {
  const { email, password } = req.body;
  const user = await User.findOne({ email }, "+password");
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

module.exports = authController;
