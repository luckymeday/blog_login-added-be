const utilsHelper = require("../helpers/utils.helper");
const Review = require("../models/review");
const { catchAsync, AppError, sendResponse } = utilsHelper;
const reviewController = {};

reviewController.createNewReview = catchAsync(async (req, res, next) => {
  // try {
  const userId = req.userId;
  const blogId = req.params.id;
  const { content } = req.body;

  const review = await Review.create({
    user: userId,
    blog: blogId,
    content,
  });

  return sendResponse(
    res,
    200,
    true,
    review,
    null,
    "Create new review successful"
  );
  // } catch (error) {
  //   next(error);
  // }
});

reviewController.getReviewsOfBlog = catchAsync(async (req, res, next) => {
  // try {
  const blogId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const totalReviews = await Review.countDocuments();
  const totalPages = Math.ceil(totalReviews / limit);
  const offset = limit * (page - 1);

  const reviews = await Review.find({ blog: blogId })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit);

  return sendResponse(res, 200, true, { reviews, totalPages }, null, "");
  // } catch (error) {
  //   next(error);
  // }
});

reviewController.updateSingleReview = catchAsync(async (req, res, next) => {
  // try {
  const userId = req.userId;
  const reviewId = req.params.id;
  const { content } = req.body;

  const review = await Review.findOneAndUpdate(
    { _id: reviewId, user: userId },
    { content },
    { new: true }
  );
  if (!review)
    return next(new AppError(401, "Review not found or User not authorized"));
  return sendResponse(res, 200, true, review, null, "Update successful");
  // } catch (error) {
  //   next(error);
  // }
});

reviewController.deleteSingleReview = catchAsync(async (req, res, next) => {
  // try {
  const userId = req.userId;
  const reviewId = req.params.id;

  const review = await Review.findOneAndDelete({
    _id: reviewId,
    user: userId,
  });
  if (!review)
    return next(new AppError(401, "Review not found or User not authorized"));
  return sendResponse(res, 200, true, null, null, "Delete successful");
  // } catch (error) {
  //   next(error);
  // }
});

module.exports = reviewController;
