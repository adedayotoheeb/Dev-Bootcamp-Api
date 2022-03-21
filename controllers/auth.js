/*jshint esversion: 6 */
/*jshint esversion: 8 */
const ErrorResponse = require("../utilis/errorresponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/user");
const auth = require("../middleware/auth");
const senEmail = require("../utilis/sendemail");
const crypto = require("crypto");

// Description : Register User
// access: Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //Create User
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  // Create token
  sendTokenResponse(user, 200, res);
});

// Description : Login User
// access: Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Validate  email password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  //check for password
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  // Check if Password Matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }
  // Creata token
  sendTokenResponse(user, 200, res);
});
// 1jwfacsacscs

// Get token from model and create Cookie and get response
// @Description  Get current logged in user
//@route          POST /api/v1/auth/me
//@access         private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Forgot password
// @Description  forgot password in user
//@route          POST /api/v1/auth/me
//@access         public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with this email", 404));
  }

  //Get reset token
  const resetToken = user.getResetPasswordToken();
  // console.log(resetToken);

  await user.save({ validateBeforeSave: false });

  //create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/resetpassword${resetToken}`;

  const message = `You are redeiving this email because you or someoneelse is requesting the rest of a password. please make a put request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordTOken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email couldnt be sent", 500));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

const sendTokenResponse = (user, statusCode, res) => {
  //create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

// Reset passord
//routr   PUT /api/v1/auth/resetpassword/:resettoken
//@access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //get Hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  //set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// Description   Update User details
//route PUT/api/v1/auth/updatedetails
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdatee = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findById(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});
