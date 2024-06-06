const express = require('express');
const router = express.Router();
const { login, logout, register, uploadProfile, authCheck } = require('../controllers/authController');
const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'resources/profileImage');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
})


/**userController*/
router.route("/login").post(login);
router.route("/authCheck").get(authCheck);
router.route("/logout").post(logout);
router.route("/register").post(register);
router.route("/uploadProfile").post(upload.single('image'),uploadProfile);

module.exports = router;
