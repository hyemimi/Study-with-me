var express = require('express')
var app = express()

// 3000 포트로 서버 오픈
app.listen(3000, function() {
    console.log("start! express server on port 3000")
})

app.get('/', function(req,res) {
    res.send("<h1>hi This is server</h1>")
})