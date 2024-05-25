const express = require('express');
const router = express.Router();
const { getStudies, addStudies, getMembers, addStudyUser, getNotification, sendNotification, postBanner } = require("../controllers/studyController");
const { uploadContent, getBoard } = require("../controllers/boardController");
const { registerSchedule, voteSchedule, getSchedule } = require('../controllers/calanderController');
const multer = require('multer');
const path = require('path');


const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'resources/banner');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
})


/** studyController */
router.route("/getStudies").get(getStudies); // 유저의 스터디 목록들 조회
router.route("/addStudies").post(addStudies); // 스터디 생성
router.route("/postBanner").post(upload.single('image'),postBanner); // 스터디 생성
router.route("/getMembers").get(getMembers); // 스터디의 구성원 조회
router.route("/addStudyUser").post(addStudyUser); // 스터디 유저 등록
router.route("/sendNotification").post(sendNotification); // 스터디 초대 알람 전송
router.route("/getNotification").get(getNotification); // 알람 조회
/** boardController */
router.route("/uploadContent").post(uploadContent); // 게시글 업로드
router.route("/getBoard").get(getBoard); // 게시글 조회
/** calanderController */
router.route("/registerSchedule").post(registerSchedule);
router.route("/voteSchedule").post(voteSchedule);
router.route("/getSchedule").get(getSchedule);

module.exports = router;




