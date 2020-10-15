var express = require('express')
var router = express.Router()
const common = require("../modules/common");
router.get('/', function(req, res) {
    console.log("========", req.query)
    common.getMongoClient().then((client) => {
        var dbo = client.db("ruiseCloud"); // dbo就是指定的数据库对象
        dbo.collection("user").find({
            "phone": req.query.phone
        }).toArray(function(err, result) {
            if (err) throw err;
            console.log(result)
            res.render('userCenter.art', result[0]);
        })

    })


});

module.exports = router