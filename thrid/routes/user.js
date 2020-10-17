var express = require('express')
var router = express.Router()
    // 引入common模块
const common = require("../modules/common");

// 定义用户登录
router.post("/login", function(req, res) {
    console.log(req.body);
    // 根据手机号和密码去数据库里面查询,查询得到表示登录成功;没有查到表示登录失败
    common.getMongoClient().then((client) => {
        var dbo = client.db("forum"); // dbo就是指定的数据库对象

        dbo.collection("user").find(req.body).toArray(function(err, result) {
            console.log(result)

            if (err) throw err;
            if (result.length > 0) {
                res.json({
                    code: 3,
                    msg: "1",
                    userInfo: result[0]
                });
            } else {
                res.json({
                    code: 3,
                    msg: "0"
                });
            }
        })
    })
})




// 定义判断手机号唯一
router.post("/checkPhoneUnique", function(req, res) {

    // 根据手机号去数据库里面查询
    common.getMongoClient().then((client) => {
        // 通过client对象链接到指定的数据库
        var dbo = client.db("forum"); // dbo就是指定的数据库对象

        dbo.collection("user").find(req.body).toArray(function(err, result) {
            if (err) throw err;
            if (result.length > 0) {
                res.json({
                    code: 2,
                    msg: "1"
                });
            } else {
                res.json({
                    code: 2,
                    msg: "0"
                });
            }
        })
    })

})

// 定义用户修改
router.post("/amend", function(req, res) {
    console.log("222");
    console.log(req.body);
    // 把手机号和密码存储到数据库里面去
    common.getMongoClient().then((client) => {
        // 通过client对象链接到指定的数据库
        var dbo = client.db("forum"); // dbo就是指定的数据库对象
        dbo.collection("user").updateOne({ "phone": req.body.phone }, {
            $set: {
                "userName": req.body.userName,
                "pwd": req.body.newPassword
            }
        }, function(err, dbRes) {
            if (err) throw err;
            // dbRes是数据库给予我们的响应,dbRes对象的insertedCount属性表示插入了几条数据

            if (dbRes.insertedCount > 0) {
                console.log("更新数据成功")
                res.json({
                    code: 1,
                    msg: "regOk"
                });
            } else {
                res.json({
                    code: 1,
                    msg: "regError"
                });
            }

            // 关闭客户端
            client.close();

        });
    })

})


// 定义用户注册
router.post("/reg", function(req, res) {
    console.log("222");
    console.log(req.body);
    req.body.userStatus = Number(req.body.userStatus);
    // 把手机号和密码存储到数据库里面去
    common.getMongoClient().then((client) => {
        // 通过client对象链接到指定的数据库
        var dbo = client.db("forum"); // dbo就是指定的数据库对象
        dbo.collection("user").insertOne(req.body, function(err, dbRes) {
            if (err) throw err;
            // dbRes是数据库给予我们的响应,dbRes对象的insertedCount属性表示插入了几条数据
            console.log(req.body)
            if (dbRes.insertedCount > 0) {
                res.json({
                    code: 1,
                    msg: "regOk"
                });
            } else {
                res.json({
                    code: 1,
                    msg: "regError"
                });
            }

            // 关闭客户端
            client.close();

        });
    })

})


module.exports = router