var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//引入models
var Photo = require('../models/photo')
//连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/mongo', {
    useNewUrlParser: true
})
mongoose.connection.on('connected', function () {
    console.log('连接成功');
})
mongoose.connection.on('error', function () {
    console.log('出错了');
})
mongoose.connection.on('disconnected', function () {
    console.log('连接断开');
})

router.post('/uploadPhoto', (req, res) => {
    var filename = req.body.filename
    var filesize = req.body.filesize
    var base64 = req.body.base64
    Photo.insertMany({
        filename: filename,
        filesize: filesize,
        base64: base64
    }, (err, data) => {
        if (err) {
            console.log(err);
        }
        console.log('上传图片成功！');
    })
})

module.exports = router;