const express = require('express')
const session = require('express-session');
const mySQLStore = require('express-mysql-session')(session);
const router = express.Router();
//const FileStore = require('session-file-store');
const bodyParser = require('body-parser');
const baseUrl = 'http://localhost:3000';
const cors = require('cors');
const app = express();
var db = require('./lib/db');


const multer = require('multer');
const fs = require('fs');
const path = require('path');







app.use(cors({
  origin: baseUrl,
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use('/resources', express.static('resources')) // 서버 내 이미지 저장을 위함 및 업로드 위함

var sessionStore = new mySQLStore({
  host: '127.0.0.1',
  user: 'root',
  password: '7375',
  database: 'studydb'
});
/** session 정보 생성 */
app.use(session({
  secret: 'study-with-me',
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}))


app.use('/auth', require("./routes/authRoutes"));
app.use('/study', require("./routes/studyRoutes"));
app.use('/board', require("./routes/boardRoutes"));
app.use('/calendar', require("./routes/calendarRoutes"));

app.listen(3000)

console.log("listening on port 3000")