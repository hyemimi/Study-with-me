const { v4: uuidv4 } = require('uuid');
var db = require('./../lib/db');


/** 유저 조회 */ 
const getUser = async (req, res) => {
    var email = req.query.email;

    try {
        db.query('SELECT user_id FROM user WHERE email = (?)',[email], function(error,results,fields) {
            if (error) throw error;
            if (results.length > 0) {
                // 유저 정보 있음
                res.status(200).send(results);
             }
            else {
                res.status(401).send("정보 없음");
            }
        })
    } catch (error) {
        res.status(400).send(error.message);
    }

}





/** 유저의 스터디 목록 조회  */
const getStudies = async (req, res) => {
    // 특정 user의 스터디 리스트들을 불러옵니다
    var user_id = req.query.user_id;
    console.log(req.query.user_id);

    //console.log(req.param["user_id"]);

    try {
        db.query('SELECT * FROM STUDY s JOIN (SELECT * FROM MEMBER WHERE user_id = (?)) m ON s.invite_code = m.invite_code',[user_id], function(error,results,fields) {
            if (error) throw error;
            else {
                res.status(200).send(results);
                console.log(results);
            }
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

/** 새로운 스터디 생성 */
const addStudies = async (request, response) => {
    // 새로운 스터디를 생성합니다
    var invite_code = uuidv4();
    const {leader_id,description, title} = request.body;
    
    try {
    //resources.single(banner);
    //upload.single(banner); // 서버에 이미지 업로드
     db.query('INSERT INTO study (invite_code,leader_id,description, title) VALUES (?,?,?,?)', [invite_code,leader_id,description, title], function(error, results, fields) {
            if (error) throw error;
            else {              
              response.status(200).send(invite_code);
              db.query('INSERT INTO member (invite_code,user_id) VALUES (?,?)', [invite_code,leader_id], function(error, results, fields) {
                if (error) throw error;
              })
            }           
        });
    } catch (error) {
        response.status(400).send(error.message);
    }
}

/** 이미지 업로드 (db, server) */
//app.post('/banner', upload.single('image'), (req, res, next) => {});

const postBanner = async (req, res) => {
    console.log(req);
    try {
        db.query('UPDATE study set banner=(?) where invite_code = (?)',[req.file.filename,req.body.invite_code], function(error,results,fields) {
            if (error) throw error;
            else {
                res.status(200).send("파일 업로드 완료")
            }
        })
    } catch (error) {
        res.status(400).send(error.message);
    }

}


/** 멤버 목록 조회 */
const getMembers = async (request, response) => {
    var invite_code = request.query.invite_code;
    console.log(invite_code);

    try {
        db.query('SELECT user_id, email, name, route FROM (member m JOIN study s ON m.invite_code = s.invite_code) NATURAL JOIN user u WHERE s.invite_code= (?)', [invite_code], function(error, results, fields) {
               if (error) throw error;
               else {              
                 response.status(200).send(results);
               }           
           });
       } catch (error) {
           response.status(400).send(error.message);
       }
}

/** 스터디 유저 추가 요청 (알람 보내기) */
const sendNotification = async (request, response) => {
    
    const {content,invite_code} = request.body;
    const emailList = request.body.emailList;
    
    try {
        emailList.forEach((element,index) => {
            db.query('SELECT user_id FROM user WHERE email=(?)',[element], function(err,results,fields) {
                console.log(results[index]);
                if (err) throw err;
                else {
                    db.query('INSERT INTO notify (user_id, content, isChecked,invite_code) VALUES (?,?,?,?)', [results[index].user_id,content,false,invite_code], function(error, results, fields) {
                        if (error) throw error;
                        else {              
                          response.status(200).send("알람 송신 완료");
                        }           
                    });
                }
            })
        });
        
     
    } catch (error) {
        response.status(400).send(error.message);
    }
}

/** 스터디 가입 요청 수락 */
/* const joinStudy = async (request, response) => {
    const {user_id, notify_id, content} = request.body;
     
    try {
        db.query('UPDATE notify SET isChecked=(?) WHERE notify_id = (?)', [true, notify_id], function(error, results, fields) {
               if (error) throw error;
               else {              
                 response.status(200).send("알람 송신");
               }           
           });
       } catch (error) {
           response.status(400).send(error.message);
       }

} */



/** 알람 조회 */
const getNotification = async (request, response) => {
    var user_id = request.query.user_id;

    try {
        db.query('SELECT notify_id,content,isChecked,invite_code FROM notify WHERE user_id = (?) and isChecked = (?)', [user_id,false], function(error, results, fields) {
               if (error) throw error;
               if (results.length > 0) {
                // 알람 존재
                console.log(results);
                response.status(200).send(results);
               }
               else {      
                // 알람 없음        
                 response.status(200).send("알람 없음");
               }           
           });
       } catch (error) {
           response.status(400).send(error.message);
       }
}

/** 알람 확인 시 유저를 스터디에 등록 */
const addStudyUser = async (request, response) => {
    
    const {user_id, invite_code, notify_id} = request.body;

    
    try {
        db.query('SELECT * FROM member WHERE invite_code = (?) and user_id = (?)', [invite_code,user_id],
        function(error, results, fields) {
            if (error) throw error;
            if (results.length === 0) {
              
                db.query('INSERT INTO member (invite_code,user_id) VALUES (?,?)', [invite_code,user_id], function(error, results, fields) {
                    if (error) throw error;
                    else {      
                        db.query('UPDATE notify SET isChecked=(?) WHERE notify_id = (?)', [true, notify_id], function(error, results,fields) {
                            if (error) throw error;
                        })        
                      response.status(200).send("스터디 가입 성공, 알림 확인 처리");
                    }           
                });
            }
            if (results.length === 1) {
                response.status(400).send("이미 가입된 유저입니다");
            }
        })
   
    } catch (error) {
        response.status(400).send(error.message);
    }
}





module.exports= {getUser, getStudies, addStudies, getMembers, addStudyUser, getNotification, sendNotification, postBanner}