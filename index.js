const express = require('express')
const session = require('express-session');
const mySQLStore = require('express-mysql-session')(session);
//const FileStore = require('session-file-store');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
var db = require('./lib/db');


app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

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
app.get('/users', function (req, res) {
  db.query('select * from users', function(err,results,fields) {
    if (err) throw err;
    console.log(results);
    res.send(results);
  })
})


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
app.post('/login-process', function (request, response) {
  var email = request.body.email;
  var pwd = request.body.pwd;
  console.log(email, pwd);

  if (email && pwd) {             // id와 pw가 입력되었는지 확인
      
      db.query('SELECT * FROM USERS WHERE email = ? AND pwd = ? ', [email,pwd], function(error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {  
            console.log(results);     // db에서의 반환값이 있으면 로그인 성공
              request.session.is_logined = true;      // 세션 정보 갱신
              request.session.email = email;
              request.session.save(function () {
                  response.status(200).send({
                    email: request.session.email,
                    is_logined: request.session.is_logined
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

app.get('/signup', function(req,res) {
  res.send('회원가입');
})


app.listen(3000)

console.log("listening on port 3000")