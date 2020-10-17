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

        dbo.collection("label").find({labelStatus:0}).toArray(function (err, result) {
            
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
    // console.log("新增帖子");
    req.body.userInfo = JSON.parse(req.body.userInfo)
    console.log(req.body)
    // console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv",addData.topicReply);
    common.getMongoClient().then(function (client) {
        var addData=req.body;
        addData.visitedCount=Number(addData.visitedCount);
        addData.topicStatus=Number(addData.topicStatus);
        addData.topicReply=[];
        addData.secondReplay=[];
        
        var dbo = client.db("forum");
        dbo.collection("topic").insertOne(addData, function (err, resDb) {
            console.log("7777777777777777777777777",addData)
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
    console.log("第一次回复")
    req.body.userInfo = JSON.parse(req.body.userInfo);
    // req.body.secondReplay = [];
    console.log("\\\\\\\\\\\\\\",req.body,topicId)
    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        dbo.collection("topic").update({
            _id:ObjectId(topicId)
        },{$push:{"topicReply":req.body}},function (err,result) {
            if(err) throw err;
            console.log("更新成功",result)
            client.close();
        })
    })
}) 

//帖子二次回复
router.post("/details/:topicId/addSecReply",function(req,res){
    
    var topicId = req.params.topicId;
    var replyUserName = req.body.replyUserName;
    var FirstReplyTime = req.body.FirstReplyTime;
    req.body.userInfo = JSON.parse(req.body.userInfo);
    console.log("//////////////////",replyUserName,FirstReplyTime)
    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        dbo.collection("topic").update({
            _id:ObjectId(topicId),
        },{$push:{"secondReplay":req.body}},function (err,result) {
            if(err) throw err;
            console.log("更新成功",result)
            client.close();
        })
    })
    
})

//帖子详情
router.get("/details/:topicId",function(req,res){
    var topicId = req.params.topicId;
    common.getMongoClient().then((client) => {
        var dbo = client.db("forum"); // dbo就是指定的数据库对象
        dbo.collection("topic").updateOne({
            _id: ObjectId(topicId)
        }, {
            $inc: {
                visitedCount: 1
            }
        }, function () {
            common.getMongoClient().then(async function (client) {
                var dbo = client.db("forum");
                dbo.collection("topic").find({
                    _id:ObjectId(topicId)
                }).toArray(function (err, result) {
                    var details=result[0];
                    var replys=details.topicReply;
                    var secondReplays=details.secondReplay;
                    //阅读数量
                    var readNum=replys.length+secondReplays.length;
                    var all=[];
                    for(var i=0;i<replys.length;i++){
                        var each=[];
                        var eachSecondReplays=[]
                        each.push(replys[i]);
                        var replyTime=replys[i].replyTime;
                        var userName=replys[i].userInfo.userName;
                        for(var j=0;j<secondReplays.length;j++){
                            if(secondReplays[j].replyUserName==userName&&secondReplays[j].FirstReplyTime==replyTime){
                                eachSecondReplays.push(secondReplays[j])
                            }
                        }
                        each.push(eachSecondReplays);
                        all.push(each)
                    }

                    console.log("all***********************",all)
                    console.log("details***********************",details)
                    console.log("replys***********************",replys)
                    res.render("details.art",{
                        details:details,
                        replys:replys,
                        all:all,
                        topicId:topicId,
                        readNum:readNum
                    })

                    // res.send(all)
                })
            })
            client.close();
        })
    })

    
})

module.exports = router