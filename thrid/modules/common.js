const MongoClient = require('mongodb').MongoClient;
module.exports.getMongoClient = function (extname) {
    return new Promise(function (resolve, reject) {
        // 连接数据库
        MongoClient.connect("mongodb://127.0.0.1:27017/", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function (err, client) {
            if (err) throw err;
            // client是一个MongoClient客户端对象
            resolve(client);
        })
    })

}