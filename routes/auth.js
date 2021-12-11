/*jshint esversion: 6 */
/*jshint esversion: 8 */

const express = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  updateDetails,
} = require("../controllers/auth");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/forgotpassword", forgotPassword);
router.put("/forgotpassword", updateDetails);

module.exports = router;
