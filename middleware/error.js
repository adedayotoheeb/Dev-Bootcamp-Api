/*jshint esversion: 6 */
/*jshint esversion: 8*/
/*jshint esversion: 9 */

const ErrorResponse = require("../utilis/errorresponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  //Log to console for devloper
  console.log(err);
  //Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Bootcamp not found with the Id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  // Mongoose Duplicate Key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  //Mongoose validation error
  if (err.name === "validationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
