const { v4: uuidv4 } = require('uuid');
var db = require('./../lib/db');


/** 유저의 스터디 목록 조회  */
const getStudies = async (req, res) => {
    // 특정 user의 스터디 리스트들을 불러옵니다
    var user_id = req.body.user_id;

    try {
        db.query('SELECT * FROM STUDY s JOIN (SELECT * FROM MEMBER WHERE user_id = (?)) m ON s.invite_code = m.invite_code',[user_id], function(error,results,fields) {
            if (error) throw error;
            else {
                res.send(results);
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
    const {leader_id,description, title, banner,location,time} = request.body;

    
    try {
     db.query('INSERT INTO study (invite_code,leader_id,description, title, banner,location,time) VALUES (?,?,?,?,?,?,?)', [invite_code,leader_id,description, title, banner,location,time], function(error, results, fields) {
            if (error) throw error;
            else {              
              response.status(200).send(results.invite_code);
            }           
        });
    } catch (error) {
        response.status(400).send(error.message);
    }
}


/** 멤버 목록 조회 */
const getMembers = async (request, response) => {
    var invite_code = request.body.invite_code;

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


/** 유저에게 알람 송신 */


/** 알람 조회 */


/** 유저를 스터디에 등록 */
const addStudyUser = async (request, response) => {
    
    const {user_id,invite_code} = request.body;

    
    try {
        db.query('SELECT * FROM member WHERE invite_code = (?) and user_id = (?)', [invite_code,user_id],
        function(error, results, fields) {
            if (error) throw error;
            if (results.length === 0) {
                db.query('INSERT INTO member (invite_code,user_id) VALUES (?,?)', [invite_code,user_id], function(error, results, fields) {
                    if (error) throw error;
                    else {              
                      response.status(200).send("스터디 가입 성공");
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





module.exports= {getStudies, addStudies, getMembers, addStudyUser}