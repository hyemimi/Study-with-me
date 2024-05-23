var db = require('./../lib/db');


/** 스터디 장이 스터디 일정 및 장소를 등록합니다 */
const registerSchedule = async (request, response) => {
    
    const {user_id,invite_code, during, location} = request.body;
    var time = request.body.time; // 배열로 받기.

    try {
         // 그리고 반복문으로 insert query
     db.query('INSERT INTO schedule (user_id,invite_code,time, during, location) VALUES (?,?,?,?,?)', [user_id,invite_code,time, during,location], function(error, results, fields) {
            if (error) throw error;
            else {              
              response.status(200).send("스케줄 등록 성공");
            }           
        });
    } catch (error) {
        response.status(400).send(error.message);
    }
}

/** 스터디 장이 일정 투표를 종료합니다 (장소, 시간 픽스), study table의 time, location update */


/** 일정 투표 리스트를 조회합니다 */
const getSchedule = async (request, response) => {
    var invite_code = request.body.invite_code;

    try {
        db.query('SELECT * FROM schedule WHERE invite_code = (?) and user_id is NULL', [invite_code], function(error, results, fields) {
               if (error) throw error;
               if (results.length > 0) {
                // 스케줄 존재
                response.status(200).send(results);
               }
               else {      
                // 등록된 스케줄 없음        
                 response.status(200).send("등록된 일정이 없습니다.");
               }           
           });
       } catch (error) {
           response.status(400).send(error.message);
       }
}

/** 유저가 희망하는 스터디 일정을 등록합니다  */
const voteSchedule = async (request, response) => {
    
    const {user_id, invite_code,time, during, location} = request.body;


    try {
     db.query('INSERT INTO schedule (user_id,invite_code,time, during, location) VALUES (?,?,?,?,?)', [user_id,invite_code,time, during,location], function(error, results, fields) {
            if (error) throw error;
            else {              
              response.status(200).send("스케줄 투표 성공");
            }           
        });
    } catch (error) {
        response.status(400).send(error.message);
    }
}



module.exports = {registerSchedule,voteSchedule, getSchedule}

