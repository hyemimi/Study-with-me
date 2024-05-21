const express = require('express');
const router = express.Router();
const { getStudies, addStudies, getMembers } = require("../controllers/studyController");


router.route("/getStudies").get(getStudies);
router.route("/add").post(addStudies);
router.route("/getMembers").get(getMembers);
//router.route("/getStudy")

module.exports = router;




