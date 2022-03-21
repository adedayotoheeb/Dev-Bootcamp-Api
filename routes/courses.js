/*jshint esversion: 6 */
/*jshint esversion: 8 */
const express = require("express");
const advancedResults = require("../middleware/advancedresults");
const Course = require("../models/course");
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses.js");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name",
    }),
    getCourses
  )
  .post(protect, authorize("publisher", "admin"), createCourse);
router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
