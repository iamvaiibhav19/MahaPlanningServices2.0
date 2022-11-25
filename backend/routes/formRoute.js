const express = require("express");
const router = express.Router();
const {
  createForm,
  deleteForm,
  getAllForms,
  deleteAllForms,
  getUserForms,
  updateForm,
  searchForm,
  getSingleForm,
  getFormsByServiceType,
  uploadFile,
  getFormById,
  createFormWithoutDoc,
} = require("../controllers/formController");

const {
  isAutheticatedUser,
  authorisedRoles,
} = require("../middlewares/auth.js");

// create a new form -- ADMIN
router.route("/lead/new").post(isAutheticatedUser, createFormWithoutDoc);

router.route("/lead/doc/new").post(isAutheticatedUser, createForm);

// delete a form -- ADMIN
router.route("/lead/:id").delete(deleteForm);

//get single form -- ADMIN
router.route("/lead/:id").get(isAutheticatedUser, getSingleForm);

// get all forms -- ADMIN
router.route("/allLeads").get(getAllForms);

// delete all forms -- ADMIN
router.route("/lead/delete/all").delete(deleteAllForms);

//get user specific forms -- USER
router.route("/leads/coordinator").get(isAutheticatedUser, getUserForms);

//update a form -- ADMIN
router.route("/lead/:id").put(isAutheticatedUser, updateForm);

router.route("/lead/search").post(searchForm);

router.route("/lead/newLeads").get(getFormsByServiceType);

router.route("/lead/upload/:id").post(uploadFile);

//get single form
router.route("/lead/:id").get(getFormById);

module.exports = router;
