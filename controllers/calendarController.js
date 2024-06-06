var db = require('../lib/db');


/** 스터디 장이 스터디 일정 및 장소를 등록합니다 */
const registerSchedule = async (request, response) => {
    
    const {invite_code, during, location} = request.body; // invite_code, time, during, location 들어가 있음
    var selectedDateTimes = request.body.selectedDateTimes; // 배열로 받기.

    try {
         // 반복문으로 insert query
     selectedDateTimes.forEach(ele => {
        db.query('INSERT INTO schedule (invite_code,time, during, location) VALUES (?,?,?,?)', [invite_code,ele,during,location], function(error, results, fields) {
            if (error) throw error;
            else {           
                console.log('스케줄 등록 registerSchedule',ele);
            }           
        });
     }
    )
     response.status(200).send("스케줄 등록 성공");   
    } catch (error) {
        response.status(400).send(error.message);
    }
}

/** 스터디 장이 일정 투표를 종료합니다 (장소, 시간 픽스), study table의 time, location update */
const terminateVote = async (request, response) => {
    
    const {invite_code} = request.body; 
    try {
        db.query('SELECT invite_code, location, count(time) as max, time, during FROM schedule GROUP BY time  having invite_code = (?) ORDER BY max desc limit 1 ', [invite_code], function(error, results, fields) {
            if (error) throw error;
            else {
                db.query('Update study SET location=?, during =?, time =? WHERE invite_code=?',[results[0].location,results[0].during,results[0].time,results[0].invite_code],function(err, result, fields) {
                    if (err) throw err;
                    else {
                        db.query('DELETE FROM schedule WHERE invite_code = (?)',[results[0].invite_code], function(e,res,fields) {
                            if (e) throw e;
                            response.status(200).send(results);
                        })
                    }
                })              
              
            }           
        });
    } catch (error) {
        response.status(400).send(error.message);
    }
}



/** 투표한 유저를 조회합니다*/
const getCompletedMembers = async (request, response) => {
    var invite_code = request.query.invite_code;

    try {
        db.query('SELECT count(distinct u.user_id) as "cnt" FROM (SELECT * FROM schedule WHERE invite_code = ?) s JOIN user u ON s.user_id = u.user_id', [invite_code], function(error, results, fields) {
               if (error) throw error;
               if (results.length > 0) {
                // 투표한 사람들 존재
                response.status(200).send(results);
               }
               else {      
                // 투표한 사람 없음     
                 response.status(401).send("투표한 사람이 없습니다");
               }           
           });
       } catch (error) {
           response.status(400).send(error.message);
       }
}


/** 일정 투표 리스트를 조회합니다 */
const getSchedule = async (request, response) => {
    var invite_code = request.query.invite_code;

    try {
        db.query('SELECT * FROM schedule WHERE invite_code = (?) and user_id is NULL', [invite_code], function(error, results, fields) {
               
            if (error) throw error;
               if (results.length > 0) {
                // 스케줄 존재
                console.log("getSchedule",results)
                response.status(200).send(results);
               }
               else {      
                // 등록된 스케줄 없음        
                 response.status(401).send("등록된 일정이 없습니다.");
               }           
           });
       } catch (error) {
           response.status(400).send(error.message);
       }
}

/** 유저가 희망하는 스터디 일정을 등록합니다  */
const voteSchedule = async (request, response) => {
    
    const {user_id,invite_code,during, location} = request.body;
    const checkedSchedule = request.body.checkedSchedule;


    try {
        db.query('SELECT * FROM schedule WHERE user_id=(?)',[user_id], function(error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {
                // 이미 투표 완료함
                response.status(401).send("투표 완료된 상태입니다");
            }
            else {
                checkedSchedule.forEach((schedule_id) => {
                    db.query(`INSERT INTO schedule (user_id,invite_code,time, during, location) 
                    SELECT (?),invite_code,time,during,location FROM schedule WHERE schedule_id = (?)
                    `, [user_id,schedule_id], function(error, results, fields) {
                        if (error) throw error;
                    
                        }  )         
                    })             
                    response.status(200).send("스케줄 투표 성공");
            }
        })
    }
     catch (error) {
        response.status(400).send(error.message);
    }
}

/** 유저의 스터디 일정들을 조회합니다 */
const getAllSchedule = async (request, response) => {
    var {user_id} = request.query;

    try {
        db.query('SELECT s.time, s.during, s.location, s.title FROM (SELECT * FROM studydb.member WHERE user_id = ?) m JOIN studydb.study s ON s.invite_code = m.invite_code where s.time IS NOT NULL', [user_id], function(error, results, fields) {
               if (error) throw error;
               if (results.length > 0) {
                // 스케줄 존재
                console.log("getAllSchedule",results);
                response.status(200).send(results);
        
               }
               else {      
                // 등록된 스케줄 없음        
                 response.status(401).send("등록된 일정이 없습니다.");
               }           
           });
       } catch (error) {
           response.status(400).send(error.message);
       }
}


module.exports = {registerSchedule,voteSchedule, getSchedule, getCompletedMembers, terminateVote, getAllSchedule}

