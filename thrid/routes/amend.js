var express = require('express');
var router = express.Router();
const common = require('../modules/common');



router.get('/', function(req, res, next) {
  
  common.getMongoClient().then((client) => {
    var dbo = client.db("forum"); // dbo就是指定的数据库对象
     dbo.collection("user").find({}).toArray(async function (err, result) {
     
      var userArr=result;
      var loginId="5f87bc05aee83cf86d5641c2";
      for(var i=0;i<userArr.length;i++){
        var allUserId=userArr[i]._id.toString()
        if(allUserId==loginId){
          
          var obj=userArr[i]
          
          console.log(obj)
          // userAllInfo.push(obj)
        }
      }
      res.render('amend.art', {
        userAllInfo:obj
      });
     })


  })

  }); 
    
  module.exports = router;