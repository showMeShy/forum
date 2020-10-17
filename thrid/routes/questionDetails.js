var express = require('express');
const {
    ObjectId
} = require('mongodb');
var router = express.Router()
// 引入common模块
const common = require("../modules/common");


//帖子详情
router.get("/:topicId",function(req,res){

    var topicId = req.params.topicId;

    common.getMongoClient().then((client) => {
        var dbo = client.db("forum"); // dbo就是指定的数据库对象

        dbo.collection("question").updateOne({
            _id: ObjectId(topicId)
        }, {
            $inc: {
                visitedCount: 1
            }
        }, function () {
            common.getMongoClient().then(async function (client) {
                var dbo = client.db("forum");
                dbo.collection("question").find({
                    _id:ObjectId(topicId)
                }).toArray(function (err, result) {

                    var questionDetails=result[0];
                    var replys=questionDetails.questionReply;
                    // console.log("cccccccccccccc",details)
        
                    res.render("questionDetails.art",{
                        questionDetails:questionDetails,
                        replys:replys,
                        topicId:topicId
                    })
                })
            })
            client.close();
        })
    })

    
})

//帖子第一次回复
router.post("/:topicId/addReply",function(req,res){
    var questionId = req.params.topicId;
    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        dbo.collection("question").update({
            _id:ObjectId(questionId)
        },{$push:{"questionReply":req.body}})
    })
})

module.exports = router