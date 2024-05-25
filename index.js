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


// 
/* app.get('/users', function (req, res) {
  db.query('select * from users', function(err,results,fields) {
    if (err) throw err;
    console.log(results);
    res.send(results);
  })
}) */


// 메인페이지
/* app.get('/',(req,res)=>{

  if (req.session.is_logined == true){
    res.send("이미 로그인 되어 있습니다");
    res.status(200).send({
      is_logined : req.session.is_logined,
      email : req.session.email
  });
  } else {
      res.redirect('/login-process');
  }
}); */


/** 로그인 */
app.post('/login', function (request, response) {
  var email = request.body.email;
  var pwd = request.body.pwd;
  console.log(email, pwd);

  if (email && pwd) {             // id와 pw가 입력되었는지 확인
      
      db.query('SELECT * FROM USER WHERE email = ? AND pwd = ? ', [email,pwd], function(error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {  
               // db에서의 반환값이 있으면 로그인 성공
              request.session.is_logined = true;      // 세션 정보 갱신
              request.session.email = email;
              request.session.save(function () {
                  response.status(200).send({
                    email: results[0].email,
                    route: results[0].route,
                    name: results[0].name,
                    user_id: results[0].user_id
                  })
              });
          } else {              
            response.status(400).send("일치하는 계정 정보가 없습니다");
          }            
      });

  } 
  else {
      response.status(400).send("No data");
  }
});

/** 로그아웃 */
app.get('/logout', function (request, response) {

  if(request.session.is_logined) {
    request.session.destroy(function(err) {
      response.status(200).send('logout');
    });
  }
  else {
    response.status(400).send('잘못된 접근입니다');
  }
 
});

/** 회원가입 */
app.post('/register', function(req,res) {
  var email = req.body.email;
  var name = req.body.name;
  var pwd = req.body.pwd;
  var route = req.body.route !== null ? `${baseUrl}/resources/${req.body.route}` : `${baseUrl}/resources/user.png`;

  db.query('select * from user where email=?',[email],(err,data)=>{
    if(data.length == 0){
        console.log('중복된 email 없음, 회원가입 성공');
        multer({})
        db.query('insert into user(email, name, pwd, route) values(?,?,?,?)',[
            email, name, pwd, route
        ]);
        res.status(200).send(`${email} 회원가입 성공`)
    }else{
        console.log('회원가입 실패');
        res.status(400).send('회원가입 실패')
    }
});


})



/** Study with me service */
app.use('/study', require("./routes/studyRoutes"));


/** 이미지 업로드 (db, server) */
// app.post('/banner', upload.single('image'), (req, res, next) => {

//   try {
//     db.query('UPDATE study set banner=(?) where invite_code = (?)',[req.file.filename,req.body.invite_code], function(error,results,fields) {
//         if (error) throw error;
//         else {

//             res.status(200).send("파일 업로드 완료")
//         }
//     })
// } catch (error) {
//     res.status(400).send(error.message);
// }
  
// });


app.listen(3000)

console.log("listening on port 3000")