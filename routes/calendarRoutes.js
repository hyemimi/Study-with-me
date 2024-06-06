const express = require('express');
const router = express.Router();
const { registerSchedule, voteSchedule, getSchedule, getCompletedMembers, terminateVote, getAllSchedule } = require('../controllers/calendarController');

router.route("/registerSchedule").post(registerSchedule);
router.route("/voteSchedule").post(voteSchedule);
router.route("/getSchedule").get(getSchedule);
router.route("/getCompletedMembers").get(getCompletedMembers);
router.route("/terminateVote").post(terminateVote); // 투표 종료
router.route("/getAllSchedule").get(getAllSchedule); // 모든 일정 조회


module.exports = router;
