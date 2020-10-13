var express = require('express');
var router = express.Router();
const common = require('../modules/common');


function getPopDataById(dbo, modId) {
  return new Promise(function (resolve, reject) {
      dbo.collection("topic").find({
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
    var dbo = client.db("newcapec"); // dbo就是指定的数据库对象
    // 先查询所有的模块
    dbo.collection("modules").find({}).toArray(async function (err, result) {
        var classesModsArr = result;
       
        // 根据每个模块的_id去populars中查询对应的文档
        for (var i = 0; i < classesModsArr.length; i++) {
            // 每个模块的id
            var modId = classesModsArr[i]._id.toString();
            
            // await 等待,等待异步执行完成
            var popData = await getPopDataById(dbo, modId); // popData是数组
            var obj = {
                moduleName: classesModsArr[i].moduleName,
                moduleId: modId,
                populars: popData
            }
            console.log("所有的模块", obj.populars);
            classesModules.push(obj);
        }
        res.render('index.art', {
            classesModules: classesModules
        });

        client.close();
    })
})
});

module.exports = router;
