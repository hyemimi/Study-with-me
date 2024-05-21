const express = require('express');
const router = express.Router();
const { getStudies, addStudies } = require("../controllers/studyController");


router.route("/getStudies").get(getStudies);
router.route("/add").post(addStudies);
//router.route("/getStudy")

module.exports = router;




