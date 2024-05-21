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

module.exports = {uploadContent}