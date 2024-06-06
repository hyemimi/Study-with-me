const express = require('express');
const { uploadContent, getBoard } = require('../controllers/boardController');
const router = express.Router();

/**boardController*/
router.route("/uploadContent").post(uploadContent); // 게시글 업로드
router.route("/getBoard").get(getBoard);

module.exports = router;
