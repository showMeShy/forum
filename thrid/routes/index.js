var express = require("express");

const { ObjectId } = require("mongodb");
// 定义路由模块
var router = express.Router();
// 引入common模块
const common = require("../modules/common");


function getTopicCount(dbo, topicClassify) {
    var topicCount = dbo.collection("topic").find({
        topicClassify: topicClassify,
        topicStatus:0
    }).count();
    return topicCount;
}

function getAllTopicCount(dbo) {
  var topicCount = dbo.collection("topic").find({
    topicStatus:0
  }).count();
  return topicCount;
}


function getTopicData(dbo,skipValue,pageSize) {
  return new Promise(function (resolve, reject) {
    dbo.collection("topic").find({
      topicStatus:0
      }).sort({
        count: -1,
      }).skip(skipValue).limit(pageSize).toArray(function (err, topicResult) {
        // console.log(popResult);
        for (var i = 0; i < topicResult.length; i++) {
          topicResult[i]._id = topicResult[i]._id.toString();
        }
        resolve(topicResult);
      });
  });
}
//获取不同标签的不同帖子并分页
function getTopic(dbo, topicClassify,skipValue,pageSize) {
  return new Promise(function (resolve, reject) {
    dbo.collection("topic").find({
      topicClassify: topicClassify,
      topicStatus:0
    }).skip(skipValue).limit(pageSize).toArray(function(err,result){
    var topicResult=result;
    for (var i = 0; i < topicResult.length; i++) {
      topicResult[i]._id = topicResult[i]._id.toString();
    }
    resolve(topicResult);
  })
  });
}




// 定义首页路由
router.get("/index", function (req, res) {
    
      // console.log(req.query)
      var pageNum = req.query.pageNum?Number(req.query.pageNum):1;
      var pageSize = req.query.pageSize?Number(req.query.pageSize):10;
      var skipValue = (pageNum - 1) * pageSize;
  // 当我们去渲染index.art的时候,这里面的data数据其实就是从数据库里面查询得到的数据
  var labels = [];
  var topics = [];
  common.getMongoClient().then((client) => {
    var dbo = client.db("forum"); // dbo就是指定的数据库对象
    // 先查询所有的模块
    dbo.collection("label").find({labelStatus:0}).toArray(async function (err, result) {
        var labelsArr = result;
        // console.log("所有的模块", result);
        // 根据每个模块的_id去populars中查询对应的文档
        for (var i = 0; i < labelsArr.length; i++) {
          // 每个模块的id
          var topicClassify = labelsArr[i].labelName;
          var labelId = labelsArr[i]._id.toString();

          // await 等待,等待异步执行完成
          // var topicData = await getTopicDataByLabelName(dbo, topicClassify); 

        
          var labelsObj = {
            labelName: labelsArr[i].labelName,
            labelId: labelId,
          };
          
          labels.push(labelsObj);
          
        }
        var topicCount = await getAllTopicCount(dbo);
        var topicData = await getTopicData(dbo,skipValue,pageSize);// popData是数组

      
          for(var j=0;j<topicData.length;j++){
            topicData[j].replayCount =topicData[j].topicReply.length+topicData[j].secondReplay.length;
          }
        var topicsObj = {
          topics: topicData,
        };
        topics.push(topicsObj);

        // console.log("*-------------", labels);
        // console.log(topics);

        // res.send(topicData)

        res.render("index.art", {
          labels: labels,
          topics: topics,
          pageNum: pageNum,
          pageCount: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
        });

        client.close();
      });
  });
});

//查询所有的标签

//根据不同的标签显示不同的帖子
router.get("/index/:preLabelId", function (req, res) {
  var preLabelId = req.params.preLabelId;
      // 获取得到页码和每页显示的条目数
      console.log("aaaaaaaaaaaaaaaaaa",preLabelId);
      var pageNum = Number(req.query.pageNum);
      var pageSize = Number(req.query.pageSize);
      var skipValue = (pageNum - 1) * pageSize;
 
  //根据标签id查询标签的标签名
  var labels = [];
  var topics = [];
  common.getMongoClient().then((client) => {
    var dbo = client.db("forum"); // dbo就是指定的数据库对象
    // 先查询所有的模块
    dbo.collection("label").find({labelStatus:0}).toArray(async function (err, result) {
        var labelsArr = result;
        // console.log("所有的模块", result);
        // console.log(preLabelId);
        // 根据每个模块的_id去populars中查询对应的文档
        for (var i = 0; i < labelsArr.length; i++) {
          // 每个模块的id
          var topicClassify = labelsArr[i].labelName;
          var labelId = labelsArr[i]._id.toString();

          if (labelId == preLabelId) {
            // await 等待,等待异步执行完成
            console.log("111111111",topicClassify)
            // 查询总条目数
            var topicCount = await getTopicCount(dbo, topicClassify);
            var Topics = await getTopic(dbo, topicClassify,skipValue,pageSize);
            console.log("++++++++++++++++++++++",Topics)

            var readNum=[];
            for(var j=0;j<Topics.length;j++){
              var eachNum=Topics[j].topicReply.length+Topics[j].secondReplay.length;
              readNum.push(eachNum)
            }
             // popData是数组
            var topicsObj = {
              topics: Topics,
            };
            topics.push(topicsObj);
            
          }

          var labelsObj = {
            labelName: labelsArr[i].labelName,
            labelId: labelId,
          };

          labels.push(labelsObj);
        }

        console.log("*-------------", labels);
        // console.log("++++++++++++",preLabelId);

        res.render("index.art", {
          labels: labels,
          topics: topics,
          preLabelId:preLabelId,
          pageNum: pageNum,
          readNum:readNum,
          pageCount: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1

        });
        // res.send(readNum)

        client.close();
      });
  });
});




module.exports = router;
