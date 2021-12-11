/*jshint esversion: 6 */
/*jshint esversion: 8 */
const express = require("express");
const advancedResults = require("../middleware/advancedresults");
const path = require("path");
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const User = require("../models/user");
const { protect, authorize } = require("../middleware/auth");
const router = express.Router({ mergeParams: true });
router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
