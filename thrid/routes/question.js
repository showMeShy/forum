var express = require('express');
var router = express.Router();
const common = require('../modules/common');
const { ObjectId } = require("mongodb");

function getLabel(dbo, topicClassify) {
  var label = dbo.collection("label").find({
      _id: topicClassify,
  }).toArray()
  return label;
}


function getTopic(dbo, topicClassify) {
    var question = dbo.collection("question").find({
        topicClassify: topicClassify,
    }).toArray()
    return question;
}
// 获取帖子数据
// function getTopic(dbo, modId) {
//   return new Promise(function (resolve, reject) {
//       var topics=[];
//       dbo.collection("question").find({
//           topicClassify: modId
//       }).toArray(function (err, popResult) {
    
//           for(var i=0;i<popResult.length;i++){
//             topics[i]=popResult[i]
//             // console.log(popResult[i])
//           }
//           resolve(topics);
//       })
//   })
// }




// 定义首页路由

  router.get('/', function(req, res, next){
    var labelTipic = [];
    var labelModulesName = [];
  common.getMongoClient().then((client) => {
    var dbo = client.db("forum"); // dbo就是指定的数据库对象
    // 先查询所有的模块
    dbo.collection("label").find({}).toArray(async function (err, result) {
        var classesModsArr = result;
        // console.log(result.length)
          // 根据每个模块的_id去populars中查询对应的文档
          for (var i = 0; i < classesModsArr.length; i++) {
            var modId = classesModsArr[i]._id.toString();
            var a=classesModsArr[i]._id;
            var popData = await getTopic(dbo, modId); // popData是数组
            // console.log(popData[0]._id)
            var labelData = await getLabel(dbo, a); // popData是数组
            // console.log(labelData)
            var obj = {
                modules: classesModsArr[i].modules,
                labelId:classesModsArr[i]._id.toString(),
                allData:popData,
                topicId:popData[0]._id.toString()
            }
            
            var labelModu={
                labelName:labelData[0].modules,
                labelId:labelData[0]._id.toString(),
             
            }
            labelModulesName.push(labelModu)
            labelTipic.push(obj);
          }
        
          res.render('question.art', {
            labelTipic: labelTipic,
            labelModulesName:labelModulesName
          });
          client.close();
    })
})
  });
// 跳转类型
router.get('/:labelId', function(req, res, next){
  var labelModulesName = [];
  var labelTipic = [];

  common.getMongoClient().then((client) => {
    
    var dbo = client.db("forum"); // dbo就是指定的数据库对象
    // 先查询所有的模块
    dbo.collection("label").find({}).toArray(async function (err, result) {
        var classesModsArr = result;
    
          // 根据每个模块的_id去populars中查询对应的文档
          for (var i = 0; i < classesModsArr.length; i++) {
            var modId = classesModsArr[i]._id.toString();
            // var modules = classesModsArr[i].modules;
            var a=classesModsArr[i]._id;
            var popData = await getTopic(dbo, modId); // popData是数组
            var labelData = await getLabel(dbo, a); // popData是数组
            if(popData[0].topicClassify==req.params.labelId){
                var obj = {
                  allData:popData
              }
         
              labelTipic.push(obj);
          }
         
          var labelModu={
            labelName:labelData[0].modules,
            labelId:labelData[0]._id.toString()
        }
         
        labelModulesName.push(labelModu);
          }
        
          res.render('question.art', {
            labelModulesName:labelModulesName,
            labelTipic:labelTipic
          });
       
          client.close();
    })

 
    
  })
})

// 帖子详情

router.get('/askDetail', function(req, res, next) {
  // var classesModules = [];
  // common.getMongoClient().then((client) => {
  //   var dbo = client.db("forum"); // dbo就是指定的数据库对象
  //   // 先查询所有的模块
  //   dbo.collection("label").find({}).toArray(async function (err, result) {
  //       var labelArr = result;
  //       for(var i=0;i<labelArr.length;i++){
            
  //       }
      
  //     })
  // })
  console.log(req.params)
  res.send(req.params)
  // res.render('askDetail.art', {
    
  //   });
  client.close();
});

  
  module.exports = router;
  
  
  