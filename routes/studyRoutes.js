const express = require('express');
const router = express.Router();
const { getStudies, addStudies, getMembers } = require("../controllers/studyController");
const { uploadContent } = require("../controllers/boardController");

router.route("/getStudies").get(getStudies); // 유저의 스터디 목록들 조회
router.route("/add").post(addStudies); // 스터디 생성
router.route("/getMembers").get(getMembers); // 스터디의 구성원 조회
router.route("/uploadContent").post(uploadContent);
//router.route("/getStudy")

module.exports = router;




