/*jshint esversion: 6 */
const express = require("express");
const advancedResults = require("../middleware/advancedresults");
const Bootcamp = require("../models/bootcamp");
const router = express.Router();
const path = require("path");
const {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");

// Include other resource router
const courseRouter = require("./courses");
const { protect, authorize } = require("../middleware/auth");

// re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .get(getBootcamp)
  .post(protect, authorize("publisher", "admin"), createBootcamps);
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);
router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);
// router.route("/test").get(uploadBootcampImage);

module.exports = router;
