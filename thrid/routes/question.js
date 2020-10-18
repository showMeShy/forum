var express = require("express");

const { ObjectId } = require("mongodb");
// 定义路由模块
var router = express.Router();
// 引入common模块
const common = require("../modules/common");


function getTopicCount(dbo, topicClassify) {
    var topicCount = dbo.collection("question").find({
      questionClassify: topicClassify,
    }).count();
    return topicCount;
}

function getAllQuestionCount(dbo) {
  var topicCount = dbo.collection("question").find({

  }).count();
  return topicCount;
}


function getQuestionData(dbo,skipValue,pageSize) {
  return new Promise(function (resolve, reject) {
    dbo.collection("question").find({
        
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
    dbo.collection("question").find({
      questionClassify: topicClassify,
    }).skip(skipValue).limit(pageSize).toArray(function(err,result){
    var topicResult=result;
    for (var i = 0; i < topicResult.length; i++) {
      topicResult[i]._id = topicResult[i]._id.toString();
    }
    resolve(topicResult);
  })
  });
}
//问题状态
//获取不同标签的不同帖子并分页
function getQuestionSolve(dbo, queSolve,skipValue,pageSize,topicClassify) {
  return new Promise(function (resolve, reject) {
    dbo.collection("question").find({
      solve: queSolve,
      questionClassify: topicClassify,
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
//查询所有的标签
router.get("/", function (req, res) {
    
      // console.log(req.query)
      var pageNum = req.query.pageNum?Number(req.query.pageNum):1;
      var pageSize = req.query.pageSize?Number(req.query.pageSize):10;
      var skipValue = (pageNum - 1) * pageSize;
      // 当我们去渲染index.art的时候,这里面的data数据其实就是从数据库里面查询得到的数据
      var quetionLabels = [];
      var questions = [];
  common.getMongoClient().then((client) => {
    var dbo = client.db("forum"); // dbo就是指定的数据库对象
    // 先查询所有的模块
    dbo.collection("questionLabels").find({}).toArray(async function (err, result) {
        var labelsArr = result;
       
        // console.log("所有的模块", result);
        // 根据每个模块的_id去populars中查询对应的文档
        for (var i = 0; i < labelsArr.length; i++) {
          if(labelsArr[i].labelStatus=="0"){
               // var topicClassify = labelsArr[i].quetionLabelsName;
          // 每个模块的id
          var labelId = labelsArr[i]._id.toString();
          // 模块的ID和模块名
          var quetionLabelsObj = {
            labelName: labelsArr[i].quetionLabelsName,
            labelId: labelId,
          };
         
          quetionLabels.push(quetionLabelsObj);
          }
          
        }
        var topicCount = await getAllQuestionCount(dbo);//获得全部问题的数量
        // console.log("topicCount",topicCount)
        var topicData = await getQuestionData(dbo,skipValue,pageSize);// 获得每一个帖子的信息
        // console.log("topicData",topicData)
        for(var j=0;j<topicData.length;j++){
          topicData[j].replayCount =topicData[j].questionReply.length;
         
        }
        
        var questionObj = {
          question: topicData,
        };
   
        questions.push(questionObj);

        // console.log("*-------------", labels);
      

        res.render("question.art", {
          quetionLabels: quetionLabels,
          questions: questions,
          pageNum: pageNum,
          pageCount: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
        });

        client.close();
      });
  });
});



//根据不同的标签显示不同的帖子
router.get("/questionList/:preLabelId", function (req, res) {


      // 先拿到标签的ID值
      var preLabelId = req.params.preLabelId;
      // 获取得到页码和每页显示的条目数
      var pageNum = Number(req.query.pageNum);
      var pageSize = Number(req.query.pageSize);
      var skipValue = (pageNum - 1) * pageSize;
 
  //根据标签id查询标签的标签名
  var quetionLabels = [];
  var questions = [];
  common.getMongoClient().then((client) => {
    var dbo = client.db("forum"); // dbo就是指定的数据库对象
    // 先查询所有的模块
    dbo.collection("questionLabels").find({}).toArray(async function (err, result) {
        var labelsArr = result;
        // 根据每个模块的_id去populars中查询对应的文档
        for (var i = 0; i < labelsArr.length; i++) {
          if(labelsArr[i].labelStatus=="0"){
            // 每个模块的模块名
            var questionClassify = labelsArr[i].quetionLabelsName;
            // console.log("questionClassify",questionClassify)
            // 每个模块的ID
            var questionlabelId = labelsArr[i]._id.toString();
                // console.log("questionlabelId",questionlabelId)
            if (questionlabelId == preLabelId) {
              // await 等待,等待异步执行完成
            
              // 查询总条目数
              var questionCount = await getTopicCount(dbo, questionClassify);
              // console.log(questionCount)
              var question = await getTopic(dbo, questionClassify,skipValue,pageSize);
              for(var j=0;j<question.length;j++){
                question[j].replayCount =question[j].questionReply.length;
              }
              // console.log(question)
              // popData是数组
              var questionObj = {
                question: question,
              };
              questions.push(questionObj);
              // console.log("questions",questions[0])
            }

            var questionLabelsObj = {
              labelName: labelsArr[i].quetionLabelsName,
              class: labelsArr[i].class,
              questionlabelId: questionlabelId,
              labelId: questionlabelId
            };

            quetionLabels.push(questionLabelsObj);
            // console.log("quetionLabels",quetionLabels)
          }
        
        }
        res.render("question.art", {
          quetionLabels: quetionLabels,
          questions: questions,
          preLabelId:preLabelId,
          pageNum: pageNum,
          pageCount: questionCount % pageSize == 0 ? questionCount / pageSize : parseInt(questionCount / pageSize) + 1
          // cssClass:cssClass
        });

        client.close();
      });
  });
});

router.get("/questionList/:preLabelId/:solve", function (req, res) {
    // 获取solve
    var solve=req.params.solve;
    console.log(solve)
    var preLabelId = req.params.preLabelId;
    console.log("preLabelId",preLabelId)
    // 获取得到页码和每页显示的条目数
    var pageNum = req.query.pageNum?Number(req.query.pageNum):1;
    var pageSize = req.query.pageSize?Number(req.query.pageSize):10;
    var skipValue = (pageNum - 1) * pageSize;

//根据标签id查询标签的标签名
var quetionLabels = [];
var questions = [];
common.getMongoClient().then((client) => {
  var dbo = client.db("forum"); // dbo就是指定的数据库对象
  // 先查询所有的模块
  dbo.collection("questionLabels").find({}).toArray(async function (err, result) {
      var labelsArr = result;
      // 根据每个模块的_id去populars中查询对应的文档
      for (var i = 0; i < labelsArr.length; i++) {
    
    
        if(labelsArr[i].labelStatus=="0"){
      
          // 每个模块的模块名
          var questionClassify = labelsArr[i].quetionLabelsName;
          // console.log("questionClassify",questionClassify)
          // 每个模块的ID
          var questionlabelId = labelsArr[i]._id.toString();
              // console.log("questionlabelId",questionlabelId)
          // var questionSolve = await getQuestionSolve(dbo, solve,skipValue,pageSize);
          // console.log(questionSolve)
        
          if (questionlabelId == preLabelId) {
            // await 等待,等待异步执行完成
           
            // 查询总条目数
            var questionCount = await getTopicCount(dbo, questionClassify);
            // console.log(questionCount)
           
            var question = await getQuestionSolve(dbo, solve,skipValue,pageSize,questionClassify);
            // console.log(question)
            // popData是数组
            var questionObj = {
              question: question,
            };
            questions.push(questionObj);
            // console.log("questions",questions[0])
          }

          var questionLabelsObj = {
            labelName: labelsArr[i].quetionLabelsName,
            class: labelsArr[i].class,
            questionlabelId: questionlabelId,
            labelId: questionlabelId
          };

          quetionLabels.push(questionLabelsObj);
          // console.log("quetionLabels",quetionLabels)
        }
      
      }
      res.render("question.art", {
        quetionLabels: quetionLabels,
        questions: questions,
        preLabelId:preLabelId,
        pageNum: pageNum,
        pageCount: questionCount % pageSize == 0 ? questionCount / pageSize : parseInt(questionCount / pageSize) + 1
        // cssClass:cssClass
      });

      client.close();
    });
});

})


//渲染发帖页
router.get("/posted",function(req,res){
  var arr=[];
  common.getMongoClient().then(async function (client) {
      var dbo = client.db("forum");

      dbo.collection("questionLabels").find({}).toArray(function (err, result) {
          var resultArr=result;
          for(var i =0 ;i<resultArr.length;i++){
            if(resultArr[i].labelStatus=="0"){
              arr.push(resultArr[i])
            }
          }
         
          res.render('questionPosted.art', {
            quetionLabels:arr
          });
      })
  })
})


// 新增帖子
router.post("/addQuestionTopic", function (req, res) {
  // console.log("新增帖子");
  req.body.userInfo = JSON.parse(req.body.userInfo)
  common.getMongoClient().then(function (client) {
      var addData=req.body;
      // console.log("addData",addData)
      addData.visitedCount=Number(addData.visitedCount);
      addData.questionStatus=Number(addData.questionStatus);
      addData.questionReply=[];
      addData.SecondReplay=[];
      
      var dbo = client.db("forum");
      dbo.collection("question").insertOne(addData, function (err, resDb) {
          // console.log("7777777777777777777777777",addData)
          if (err) throw err;
          // 通过res.insertedCount可以获取插入的数量
          // console.log("文档插入成功", resDb);
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





module.exports = router;
