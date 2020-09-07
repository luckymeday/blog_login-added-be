const utilsHelper = require("../helpers/utils.helper");
const { catchAsync, AppError, sendResponse } = utilsHelper;
const Blog = require("../models/blog");
const blogController = {};

blogController.getBlogs = catchAsync(async (req, res, next) => {
  // try {

  // begin filter query
  let filter = { ...req.query };
  delete filter.limit;
  delete filter.page;
  delete filter.sortBy;
  // end

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const totalBlogs = await Blog.find(filter).countDocuments();
  const totalPages = Math.ceil(totalBlogs / limit);
  const offset = limit * (page - 1);

  // begin  sorting query
  const sortBy = req.query.sortBy || {};
  if (!sortBy.createdAt) {
    sortBy.createdAt = "desc";
  }
  console.log(sortBy);
  // end
  console.log("filter:", filter);

  const blogs = await Blog.find(filter)
    .sort(sortBy)
    .skip(offset)
    .limit(limit)
    .populate("author");

  return sendResponse(
    res,
    200,
    true,
    { blogs, totalPages },
    null,
    ""
  );
  // } catch (error) {
  //   next(error);
  // }
});

blogController.getSingleBlog = catchAsync(async (req, res, next) => {
  // try {
  const blog = await Blog.findById(req.params.id).populate("author");
  if (!blog) return next(new AppError(401, "Blog not found"));

  return sendResponse(res, 200, true, blog, null, null);
  // } catch (error) {
  //   next(error);
  // }
});

blogController.createNewBlog = catchAsync(async (req, res, next) => {
  // try {
  const author = req.userId;

  // remove unallowed fields from body
  const allows = ["title", "content", "tags"];
  for (let key in req.body) {
    if (!allows.includes(key)) {
      delete req.body[key];
    }
  }
  const blog = await Blog.create({
    ...req.body,
    author,
  });

  return sendResponse(res, 200, true, blog, null, "Create new blog successful");
  // } catch (error) {
  //   next(error);
  // }
});

blogController.updateSingleBlog = catchAsync(async (req, res, next) => {
  // try {
  const author = req.userId;
  const blogId = req.params.id;
  const { title, content } = req.body;

  const blog = await Blog.findOneAndUpdate(
    { _id: blogId, author: author },
    { title, content },
    { new: true }
  );
  if (!blog)
    return next(new AppError(401, "Blog not found or User not authorized"));
  return sendResponse(res, 200, true, blog, null, "Update successful");
  // } catch (error) {
  //   next(error);
  // }
});

blogController.deleteSingleBlog = catchAsync(async (req, res, next) => {
  // try {
  const author = req.userId;
  const blogId = req.params.id;

  const blog = await Blog.findOneAndUpdate(
    { _id: blogId, author: author },
    { isDeleted: true },
    { new: true }
  );
  if (!blog)
    return next(new AppError(401, "Blog not found or User not authorized"));
  return sendResponse(res, 200, true, null, null, "Delete successful");
  // } catch (error) {
  //   next(error);
  // }
});

blogController.getSelfBlog = catchAsync(async (req, res, nesxt) => {
  // begin filter query
  let filter = { ...req.query };
  delete filter.limit;
  delete filter.page;
  delete filter.sortBy;
  filter.author = req.userId;
  // end

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const totalBlogs = await Blog.find(filter).countDocuments();
  const totalPages = Math.ceil(totalBlogs / limit);
  const offset = limit * (page - 1);

  // begin  sorting query
  const sortBy = req.query.sortBy || {};
  if (!sortBy.createdAt) {
    sortBy.createdAt = "desc";
  }
  console.log(sortBy);
  // end
  console.log("filter:", filter);

  const blogs = await Blog.find(filter)
    .sort(sortBy)
    .skip(offset)
    .limit(limit)
    .populate("author");

  return utilsHelper.sendResponse(
    res,
    200,
    true,
    { blogs, totalPages },
    null,
    ""
  );
});

module.exports = blogController;
