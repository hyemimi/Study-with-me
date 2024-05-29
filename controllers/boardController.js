var db = require('./../lib/db');

/** 게시글 작성  */
const uploadContent = async (req, res) => {
    var {invite_code,title,content,user_id} = req.body;
    var time = new Date();
    
    try {
        db.query('insert into board(user_id,invite_code, title,content,time) values(?,?,?,?,?)',[user_id, invite_code,title,content,time], function(error,results,fields) {
            if (error) throw error;
            else {
                res.status(200).send("게시 성공");
            }
        })
    } catch (error) {
        res.status(400).send(error.message);
    }
}

/** 게시글 불러오기 */
const getBoard = async (req,res) => {
    var invite_code = req.query.invite_code;
    
    
    try {
        db.query('SELECT title,content,route,board_id,time,name FROM board b JOIN user u ON b.user_id=u.user_id WHERE invite_code= (?)',[invite_code],function(error,results,fields) {
            if (error) throw error;
            else {
                console.log(results);
                res.status(200).send(results);
                
            }
        })

    } catch (error) {

    }
}

module.exports = {uploadContent, getBoard}