var express = require('express');
var router = express.Router();
const common = require('../modules/common');


function getPopDataById(dbo, modId) {
  return new Promise(function (resolve, reject) {
      dbo.collection("forum").find({
          classesId: modId
      }).sort({
          count: -1
      }).limit(4).toArray(function (err, popResult) {
          // console.log(popResult);
          for (var i = 0; i < popResult.length; i++) {
              popResult[i]._id = popResult[i]._id.toString();
          }
          resolve(popResult);
      })
  })
}
// 定义首页路由
router.get('/', function(req, res, next) {
  var classesModules = [];
  common.getMongoClient().then((client) => {
    var dbo = client.db("forum"); // dbo就是指定的数据库对象
    // 先查询所有的模块
    dbo.collection("qan").find({}).toArray(async function (err, result) {
        var classesModsArr = result;
       
        // 根据每个模块的_id去populars中查询对应的文档
        for (var i = 0; i < classesModsArr.length; i++) {
            // 每个模块的id
            // var modId = classesModsArr[i]._id.toString();
            
            // await 等待,等待异步执行完成
            // var popData = await getPopDataById(dbo, modId); // popData是数组
            var obj = {
                topicTitle: classesModsArr[i].topicTitle,
                topicContent:classesModsArr[i].topicContent,
                topicClassify:classesModsArr[i].topicClassify
                // moduleId: modId,
                // populars: popData
            }
           
            classesModules.push(obj);
        }
        res.render('index.art', {
            qan: classesModules
        });

        client.close();
    })
})
});
router.get('/queryAll/:topicClassify', function(req, res, next) {

    var classesModules = [];
    common.getMongoClient().then((client) => {
      var dbo = client.db("forum"); // dbo就是指定的数据库对象
      // 先查询所有的模块
      dbo.collection("qan").find({}).toArray(async function (err, result) {
          var classesModsArr = result;
          console.log(classesModsArr.length)
         if(classesModsArr.length===0){
           return
         }else{
            // 根据每个模块的_id去populars中查询对应的文档
            for (var i = 0; i < classesModsArr.length; i++) {
          
                        
              if(classesModsArr[i].topicClassify==req.params.topicClassify){
              
                var obj = {
                  topicTitle: classesModsArr[i].topicTitle,
                  topicContent:classesModsArr[i].topicContent,
                  topicClassify:classesModsArr[i].topicClassify
                
              }
              
                classesModules.push(obj);
                console.log(classesModules[0])
              }
              
            }
            res.render('index.art', {
              qan: classesModules
            });
            console.log(classesModules[0])
            client.close();
         }
         
      })
  })
    });

module.exports = router;


