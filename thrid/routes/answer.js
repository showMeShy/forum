var express = require('express')
var router = express.Router()
const common = require("../modules/common");
// response.setHeader("Access-Control-Allow-Origin", "true")


function getTopicCount(dbo) {
    var topicCount = dbo.collection("answer").find({}).count();
    return topicCount;
}
router.get('/', function(req, res) {
    var pageNum = Number(req.query.pageNum);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;
    // res.setHeader("Access-Control-Allow-Origin", "true")
    common.getMongoClient().then(async function(client) {

        var dbo = client.db("ruiseCloud"); // dbo就是指定的数据库对象

        var topicCount = await getTopicCount(dbo);
        dbo.collection("answer").find().skip(skipValue).limit(pageSize).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result) 
            res.render('answer.art', {
                result: result,
                pageNum: pageNum,
                pageCount: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })

    })

});

module.exports = router