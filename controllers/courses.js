/*jshint esversion: 6 */
/*jshint esversion: 8 */
/*jshint esversion: 9 */
const ErrorResponse = require("../utilis/errorresponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/course");
const Bootcamp = require("../models/bootcamp");
const advancedResults = require("../middleware/advancedresults");

// Description: Get all courses
//Access: public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status.json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// Description: Get SIngle courses
//Access: public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name",
  });
  if (!course) {
    return next(
      new ErrorResponse(` No course with this id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

// Description: Add courses
//Access: public
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        ` No course with this id of ${req.params.bootcampId}`,
        404
      )
    );
  }
  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return new ErrorResponse(
      `User ${req.user.id} is not authorized to add a course to this bootcamp ${bootcamp._id}`,
      404
    );
  }

  const course = await Course.create(req.body);
  res.status(200).json({
    success: true,
    data: course,
  });
});

// Description: Update courses
//Access: public
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(
        ` No course with this id of ${req.params.bootcamp.Id}`,
        404
      )
    );
  }
  // Make sure user is bootcamp owner
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return new ErrorResponse(
      `User ${req.user.id} is not authorized to update a course to this bootcamp ${bootcamp._id}`,
      404
    );
  }
  course = await Course.findByIdAndUpdate(req.params.id, req, body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(
        ` No course with this id of ${req.params.bootcamp.Id}`,
        404
      )
    );
  }
  // Make sure user is bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return new ErrorResponse(
      `User ${req.user.id} is not authorized to delete   a course to this bootcamp ${bootcamp._id}`,
      404
    );
  }
  await course.remove();
  res.status(200).json({
    successs: true,
    data: "deleted",
  });
});
