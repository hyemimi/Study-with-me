var db = require('../lib/db');

/** 유저 로그인 */
const login = async (request, response) => {
    var email = request.body.email;
    var pwd = request.body.pwd;

try {
    if (email && pwd) {             // id와 pw가 입력되었는지 확인
        
        db.query('SELECT * FROM USER WHERE email = ? AND pwd = ? ', [email,pwd], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {  
                 // db에서의 반환값이 있으면 로그인 성공
                request.session.is_logined = true;      // 세션 정보 갱신
                request.session.email = email;
                request.session.save(function () {
                  console.log({
                    email: results[0].email,
                    route: results[0].route,
                    name: results[0].name,
                    user_id: results[0].user_id
                  })
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
}

catch (error) {
    response.status(400).send(error.message);
}

}
 

/** 유저 로그아웃 */
const logout = async (request, response) => {

  if(request.session.is_logined) {

    request.session.destroy(function(err) {
      response.status(200).send('logout');
    });
  }
  else {
    response.status(400).send('잘못된 접근입니다');
  }
 
};

/** 유저 프로필 이미지 업로드 */
const uploadProfile = async (req,res) => {
  try {
    db.query('UPDATE user set route=(?) where user_id = (?)',[req.file.filename,req.body.user_id], function(error,results,fields) {
       if (error) throw error;
      else {
            res.status(200).send("파일 업로드 완료")
               }
          })
  }
  catch {
    res.status(400).send(error.message);
  }
}



/** 유저 회원가입 */
const register = async (req, res) => {
  var email = req.body.email;
  var name = req.body.name;
  var pwd = req.body.pwd;
  //var route = req.body.route !== null ? `${baseUrl}/resources/${req.body.route}` : `${baseUrl}/resources/user.png`;

  db.query('select * from user where email=?',[email],(err,data)=>{
    if (data.length == 0){
        console.log('중복된 email 없음, 회원가입 성공');
        db.query('insert into user(email, name, pwd) values(?,?,?)',[
            email, name, pwd
        ],function(error, results, fields) {
          if (error) throw error;
          else {
            res.status(200).send((results.insertId).toString());
          }
        });
        
    }else{
        console.log('회원가입 실패');
        res.status(400).send('회원가입 실패')
    }
});
}

  module.exports = {login, logout, register, uploadProfile}