const { v4: uuidv4 } = require('uuid');
var db = require('./../lib/db');


const getUserStudies = async (req, res) => {
    // 특정 user의 스터디 리스트들을 불러옵니다
    try {
        
    } catch (error) {
        res.send(error.message);
    }
}

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
        response.send(error.message);
    }
}

module.exports= {getUserStudies, addStudies}