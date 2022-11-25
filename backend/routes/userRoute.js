const express = require("express");

const {
  registerAdmin,
  loginAdmin,
  assignRole,
  loginCoordinator,
  logout,
  getUserProfile,
  getCoordinators,
  deleteCoordinator,
  getSingleCoordinator,
  updateCoordinator,
} = require("../controllers/userController");
const {
  isAutheticatedUser,
  authorisedRoles,
} = require("../middlewares/auth.js");

const router = express.Router();

// register a user
router.route("/register").post(registerAdmin);

router.route("/loginAdmin").post(loginAdmin);

// login coordinator with only email
router.route("/loginCoordinator").post(loginCoordinator);

//assign role to user
router.route("/assignRole").post(assignRole);

//logut
router.route("/logout").get(logout);

// get user profile
router.route("/profile").get(isAutheticatedUser, getUserProfile);

//get all coordinators
router.route("/getCoordinators").get(isAutheticatedUser, getCoordinators);

//delete coordinator
router.route("/coordinator/:id").delete(isAutheticatedUser, deleteCoordinator);

//get single coordinator
router.route("/coordinator/:id").get(isAutheticatedUser, getSingleCoordinator);

//update coordinator
router.route("/coordinator/:id").put(isAutheticatedUser, updateCoordinator);

module.exports = router;
