/*jshint esversion: 6 */
/*jshint esversion: 8 */
const express = require("express");
const advancedResults = require("../middleware/advancedresults");
const path = require("path");
const Review = require("../models/reviews");
const {
  getReview,
  getReviews,
  updateReview,
  addReview,
  deleteReview,
} = require("../controllers/review");
const { protect, authorize } = require("../middleware/auth");
const router = express.Router({ mergeParams: true });

router.route("/").get(
  advancedResults(Review, {
    path: "bootcamp",
    select: " name description",
  }),
  getReviews
);
module.exports = router;
