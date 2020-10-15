const express = require('express');
const router = express.Router();
// multer插件是用来实现文件上传的
const multer = require('multer');

// 文件上传的相关配置
let upload = multer({
    storage: multer.diskStorage({
        // 配置上传文件夹
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        // 配置上传文件的文件名
        filename: function (req, file, cb) {
            var changedName = (new Date().getTime()) + '-' + file.originalname;
            cb(null, changedName);
        }
    })
});


//单个文件上传
router.post('/single', upload.single('singleFile'), (req, res) => {
    console.log(req.file);
    res.json({
        code: '0000',
        type: 'single',
        originalname: req.file.originalname,
        path: req.file.filename
    })
});

//多个文件上传
router.post('/multer', upload.array('multerFile'), (req, res) => {
    console.log(req.files);
    let fileList = [];
    req.files.map((elem) => {
        fileList.push({
            originalname: elem.originalname
        })
    });
    res.json({
        code: '0000',
        type: 'multer',
        fileList: fileList
    });
});

module.exports = router;