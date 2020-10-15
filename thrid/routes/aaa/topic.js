// var express = require('express');
// const common = require("../modules/common");
// var router = express.Router();



// router.get('/:topicClassify', function(req, res, next) {

//   var classesModules = [];
//   common.getMongoClient().then((client) => {
//     var dbo = client.db("forum"); // dbo就是指定的数据库对象
//     // 先查询所有的模块
//     dbo.collection("qan").find({}).toArray(async function (err, result) {
//         var classesModsArr = result;
//         console.log(classesModsArr.length)
//        if(classesModsArr.length===0){
//          return
//        }else{
//           // 根据每个模块的_id去populars中查询对应的文档
//           for (var i = 0; i < classesModsArr.length; i++) {
        
                      
//             if(classesModsArr[i].topicClassify==req.params.topicClassify){
            
//               var obj = {
//                 topicTitle: classesModsArr[i].topicTitle,
//                 topicContent:classesModsArr[i].topicContent,
//                 topicClassify:classesModsArr[i].topicClassify
              
//             }
            
//               classesModules.push(obj);
//               console.log(classesModules[0])
//             }
            
//           }
//           res.render('topic.art', {
//             qan: classesModules
//           });
//           console.log(classesModules[0])
//           client.close();
//        }
       
//     })
// })
//   });
// module.exports = router