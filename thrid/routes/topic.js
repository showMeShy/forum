var express = require('express');
const {
    ObjectId
} = require('mongodb');
var router = express.Router()
// 引入common模块
const common = require("../modules/common");



//渲染发帖页
router.get("/posted",function(req,res){
    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");

        dbo.collection("label").find({}).toArray(function (err, result) {
            
            console.log(result)
            // 结合populars.art渲染数据
            res.render('posted.art', {
                labels:result
            });
        })
    })
})



// 新增帖子
router.post("/addTopic", function (req, res) {
    console.log("新增帖子");
    console.log(req.body);
    common.getMongoClient().then(function (client) {
        var dbo = client.db("forum");
        dbo.collection("topic").insertOne(req.body, function (err, resDb) {
            if (err) throw err;
            // 通过res.insertedCount可以获取插入的数量
            console.log("文档插入成功", resDb);
            if (resDb.insertedCount > 0) {
                res.json({
                    code: 1,
                    msg: "addOk"
                });
            } else {
                res.json({
                    code: 1,
                    msg: "addError"
                });
            }
            client.close();
        });
    })
})


//帖子第一次回复
router.post("/details/:topicId/addReply",function(req,res){
    var topicId = req.params.topicId;
    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        dbo.collection("topic").update({
            _id:ObjectId(topicId)
        },{$push:{"topicReply":req.body}})
    })
})

//帖子二次回复
router.post("/details/:topicId/addSecReply",function(req,res){
    var topicId = req.params.topicId;
    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        dbo.collection("topic").update({
            _id:ObjectId(topicId),
            topicReply:"123"
        },{$push:{"topicReply":req.body}},function () {

            window.onload();
            client.close();
        })
    })
    
})

//帖子详情
router.get("/details/:topicId",function(req,res){
    var topicId = req.params.topicId;
    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        dbo.collection("topic").find({
            _id:ObjectId(topicId)
        }).toArray(function (err, result) {
            var details=result[0];
            var replys=details.topicReply;
            console.log("cccccccccccccc",replys)

            res.render("details.art",{
                details:details,
                replys:replys,
                topicId:topicId
            })
        })
    })
    
})

module.exports = router