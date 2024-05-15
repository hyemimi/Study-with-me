const express = require('express');
const router = express.Router();
const { getUserStudies, addStudies } = require("../controllers/studyController");


router.route("/getStudies").get(getUserStudies);
router.route("/add").post(addStudies);


module.exports = router;




