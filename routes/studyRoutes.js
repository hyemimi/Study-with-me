const express = require('express');
const router = express.Router();
const { getUserStudies, addStudies } = require("../controllers/studyController");


router.route("/getStudies").post(addStudies);
router.route("/add").post(addStudies);




