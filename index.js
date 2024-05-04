const express = require('express')
const session = require('express-session');
const mySQLStore = require('express-mysql-session')(session);
const FileStore = require('session-file-store');
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


app.get('/',function (req,res) {
  res.send('hello');
})


/** 로그인 */
app.post('/login', function (request, response) {
  var email = request.body.email;
  var password = request.body.pwd;
  console.log(email, password);
  if (email && password) {             // id와 pw가 입력되었는지 확인
      
      db.query('SELECT pwd FROM USERS WHERE email = ?', [email], function(error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
              request.session.is_logined = true;      // 세션 정보 갱신
              request.session.email = email;
              request.session.save(function () {
                  response.redirect('/');
              });
          } else {              
            response.send('일치하는 회원 정보가 존재하지 않는다');
          }            
      });

  } 
  else {
      response.send('계정이 없습니다'); 
  }
});

app.get('/logout', function (request, response) {
  request.session.destroy(function (err) {
      response.redirect('/');
  });
});

app.get('/signup', function(req,res) {
  res.send('회원가입');
})


app.listen(3000)

console.log("listening on port 3000")