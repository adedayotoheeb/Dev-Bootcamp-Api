/*jshint esversion: 6 */
/*jshint esversion: 8 */
const ErrorResponse = require("../utilis/errorresponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/user");
const advancedResults = require("../middleware/advancedresults");

// Description Get all users by the admin
// Access private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// Description Get single user by the admin
// Access private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Description Create  user by the admin
// Access private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

// Description update user by the admin
// Access private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});

// Description delete user by the admin
// Access private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(201).json({
    success: true,
    data: "deleted",
  });
});
