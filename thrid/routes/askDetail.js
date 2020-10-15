var express = require('express');
var router = express.Router();
const common = require('../modules/common');



router.get('/:a', function(req, res, next) {
    var askModules = [];
    common.getMongoClient().then((client) => {
      var dbo = client.db("forum"); // dbo就是指定的数据库对象
      // 先查询所有的模块
      dbo.collection("question").find({}).toArray(async function (err, result) {
          var askModsArr = result;
         
            // 根据每个模块的_id去populars中查询对应的文档
            for (var i = 0; i < askModsArr.length; i++) {
              var modId = askModsArr[i]._id.toString();
              
              if(modId==req.params.a.toString()){
                  var obj = {
                    allData:askModsArr[i]
                }
           
                askModules.push(obj);
            }
            }
            // console.log(askModules)
            res.render('askDetail.art', {
                askModules:askModules[0],
              
            });
         
            client.close();
      })
  
   
      
    })
  });
    
  module.exports = router;