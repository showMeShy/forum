// 后台路由
var express = require('express')
// 定义路由模块
var router = express.Router()
// 引入common模块
const common = require("../modules/common");
const {
    ObjectId
} = require('mongodb');

function getTopicCount(dbo) {
    var topicCount = dbo.collection("topic").find({
        topicStatus: 0
    }).count();
    return topicCount;
}

function getLabelCount(dbo) {
    var topicCount = dbo.collection("label").find({
        labelStatus: {
            $gte: 0
        }
    }).count();
    return topicCount;
}

function getQuestionLabelCount(dbo) {
    var topicCount = dbo.collection("questionLabels").find({
        labelStatus: {
            $gte: 0
        }
    }).count();
    return topicCount;
}

function getRecycleCount(dbo) {
    var topicCount = dbo.collection("topic").find({
        topicStatus: 1
    }).count();

    return topicCount;
}

function getRecycleQuestionCount(dbo) {
    var topicCount = dbo.collection("question").find({
        questionStatus: 1
    }).count();

    return topicCount;
}

function getQuestionCount(dbo) {
    var topicCount = dbo.collection("question").find({
        questionStatus: 0
    }).count();
    return topicCount;
}

function getUserCount(dbo) {
    var topicCount = dbo.collection("user").find({
        userStatus: {
            $gte: 0
        }
    }).count();
    return topicCount;
}


// -------话题管理模块路由
router.get("/queryAllTopic", function (req, res) {
    console.log("管理员查询所有正常话题");
    // 获取得到页码和每页显示的条目数
    console.log(req.query);
    var pageNum = Number(req.query.pageNum);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        // 查询总条目数
        var topicCount = await getTopicCount(dbo);
        console.log("所有帖子" + topicCount);
        if (topicCount > 0) {
            dbo.collection("topic").find({
                topicStatus: 0
            }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
                // 处理帖子id
                for (var i = 0; i < result.length; i++) {
                    result[i]._id = result[i]._id.toString();
                }

                // 结合populars.art渲染数据
                res.render('topicList.art', {
                    topiclist: result,
                    pageNum: pageNum,
                    pageCount: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
                });
            })
        } else {
            // 结合populars.art渲染数据
            res.render('topicList.art', {
                topiclist: 0,
                pageNum: 0,
                pageCount: 0
            });
        }

    })
})
// 删除话题的路由
router.get("/deleteTopicById/:topicId", function (req, res) {
    var topicId = req.params.topicId;
    console.log("帖子ID:" + topicId);
    // 每访问一次,就记录一次
    common.getMongoClient().then((client) => {
        var dbo = client.db("forum"); // dbo就是指定的数据库对象

        dbo.collection("topic").updateOne({
            _id: ObjectId(topicId)
        }, {
            $set: {
                topicStatus: 1
            }
        }, function (err, dbRes) {
            if (err) throw err;
            console.log("帖子已禁用!", dbRes.result.nModified);
            client.close();
        })
    })


    var pageNum = Number(req.query.pageNum);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        // 查询总条目数
        var topicCount = await getTopicCount(dbo);
        console.log("所有帖子" + topicCount);

        dbo.collection("topic").find({
            topicStatus: 0
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }

            // 结合populars.art渲染数据
            res.render('topicList.art', {
                topiclist: result,
                pageNum: result.length == 0 ? pageNum - 1 : pageNum,
                pageCount: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })
})
// 查看单个话题详情
router.get("/queryOneById/:topicId", function (req, res) {
    var topicId = req.params.topicId;
    console.log("查询单个帖子的ID:" + topicId);
    common.getMongoClient().then(async (client) => {
        var dbo = client.db("forum"); // dbo就是指定的数据库对象

        dbo.collection("topic").find({
            _id: ObjectId(topicId)
        }).toArray(function (err, result) {
            // res.json(result);
            // 渲染数据
            res.render('backTopicDetail.art', {
                detail: result[0]
            });
        })
    })
})
// 新增话题
router.post("/addTopic", function (req, res) {
    console.log("新增帖子");
    req.body.topicStatus = Number(req.body.topicStatus);
    req.body.visitedCount = Number(req.body.visitedCount);
    req.body.topicReply = [];
    req.body.secondReplay = [];
    console.log(req.body);
    common.getMongoClient().then(function (client) {
        var dbo = client.db("forum");
        dbo.collection("topic").insertOne(req.body, function (err, resDb) {
            if (err) throw err;
            // 通过res.insertedCount可以获取插入的数量
            console.log("文档插入成功", resDb);
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
//查看标签列表
router.get("/queryAllLabel", function (req, res) {
    console.log("管理员查询标签列表");
    // 获取得到页码和每页显示的条目数
    console.log(req.query);
    var pageNum = Number(req.query.pageNumL);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        // 查询总条目数
        var topicCount = await getLabelCount(dbo);
        console.log("所有标签" + topicCount);
        if (topicCount > 0) {
            dbo.collection("label").find({
                labelStatus: {
                    $gte: 0
                }
            }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
                // 处理帖子id
                for (var i = 0; i < result.length; i++) {
                    result[i]._id = result[i]._id.toString();
                }

                // 结合populars.art渲染数据
                res.render('labelList.art', {
                    labellist: result,
                    pageNumL: pageNum,
                    pageCountL: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
                });
            })
        } else {
            // 结合populars.art渲染数据
            res.render('topicList.art', {
                labellist: null,
                pageNumL: null,
                pageCountL: null
            });
        }

    })
})
//禁用或者恢复标签
router.get("/deleteLabelById/:topicId/:status", function (req, res) {
    var labelId = req.params.topicId;
    var status = Number(req.params.status);
    console.log("标签ID:" + labelId, status);
    // 每访问一次,就记录一次
    common.getMongoClient().then((client) => {
        var dbo = client.db("forum"); // dbo就是指定的数据库对象
        dbo.collection("label").findOne({
            _id: ObjectId(labelId)
        }, function (err, dbRes) {
            if (err) throw err;
            if (dbRes.labelStatus == 0) {
                dbo.collection("label").updateOne({
                    _id: ObjectId(labelId)
                }, {
                    $set: {
                        labelStatus: status
                    }
                }, function (err1, updateResult) {
                    console.log("已禁用");
                    client.close();
                });
            } else if (dbRes.labelStatus == 1) {
                dbo.collection("label").updateOne({
                    _id: ObjectId(labelId)
                }, {
                    $set: {
                        labelStatus: status
                    }
                }, function (err1, updateResult) {
                    console.log("已解禁");
                    client.close();
                });
            }
        })
    })

    console.log("管理员查询标签列表");
    // 获取得到页码和每页显示的条目数
    console.log(req.query);
    var pageNum = Number(req.query.pageNumL);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        // 查询总条目数
        var topicCount = await getLabelCount(dbo);
        console.log("所有标签" + topicCount);
        if (topicCount > 0) {
            dbo.collection("label").find({
                labelStatus: {
                    $gte: 0
                }
            }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
                // 处理帖子id
                for (var i = 0; i < result.length; i++) {
                    result[i]._id = result[i]._id.toString();
                }

                // 结合populars.art渲染数据
                res.render('labelList.art', {
                    labellist: result,
                    pageNumL: pageNum,
                    pageCountL: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
                });
            })
        } else {
            // 结合populars.art渲染数据
            res.render('topicList.art', {
                labellist: null,
                pageNumL: null,
                pageCountL: null
            });
        }

    })
})
// 新增标签
router.post("/addLabel", function (req, res) {
    console.log("新增标签");
    req.body.labelStatus = Number(req.body.labelStatus);
    console.log(req.body);
    common.getMongoClient().then(function (client) {
        var dbo = client.db("forum");
        dbo.collection("label").insertOne(req.body, function (err, resDb) {
            if (err) throw err;
            // 通过res.insertedCount可以获取插入的数量
            console.log("插入成功", resDb);
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

// -------话题回收站
router.get("/queryRecycle", function (req, res) {
    console.log("管理员查询所有被禁用帖子");
    // 获取得到页码和每页显示的条目数
    console.log(req.query);
    var pageNum = Number(req.query.pageNumD);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        // 查询回收站总条目数
        var topicCount = await getRecycleCount(dbo);
        console.log("所有回收站帖子" + topicCount);

        dbo.collection("topic").find({
            topicStatus: 1
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }

            // 结合populars.art渲染数据
            res.render('recycle.art', {
                recylelist: result,
                pageNumD: pageNum,
                pageCountD: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })
})
// 恢复帖子
router.get("/recoverById/:topicId", function (req, res) {
    var topicId = req.params.topicId;
    console.log("帖子ID:" + topicId);
    // 每访问一次,就记录一次
    common.getMongoClient().then((client) => {
        var dbo = client.db("forum"); // dbo就是指定的数据库对象

        dbo.collection("topic").updateOne({
            _id: ObjectId(topicId)
        }, {
            $set: {
                topicStatus: 0
            }
        }, function (err, dbRes) {
            if (err) throw err;
            console.log("帖子已恢复!", dbRes.result.nModified);
            client.close();
        })
    })


    var pageNum = Number(req.query.pageNumD);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        // 查询总条目数
        var topicCount = await getRecycleCount(dbo);
        console.log("所有回收站帖子" + topicCount);

        dbo.collection("topic").find({
            topicStatus: 1
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }

            // 重新结合populars.art渲染数据
            res.render('recycle.art', {
                recylelist: result,
                pageNumD: result.length == 0 ? pageNum - 1 : pageNum,
                pageCountD: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })
})

// --------------------------------------问题模块路由
router.get("/queryAllQuestion", function (req, res) {
    console.log("管理员查询所有问题列表");
    // 获取得到页码和每页显示的条目数
    console.log(req.query);
    var pageNum = Number(req.query.pageNumQ);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        // 查询总条目数
        var topicCount = await getQuestionCount(dbo);
        console.log("所有问题" + topicCount);

        dbo.collection("question").find({
            questionStatus: 0
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }

            // 结合populars.art渲染数据
            res.render('questionList.art', {
                questionlist: result,
                pageNumQ: pageNum,
                pageCountQ: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })
})

// 删除问题路由
router.get("/deleteQuestionById/:topicId", function (req, res) {
    var topicId = req.params.topicId;
    console.log("帖子ID:" + topicId);
    // 每访问一次,就记录一次
    common.getMongoClient().then((client) => {
        var dbo = client.db("forum"); // dbo就是指定的数据库对象

        dbo.collection("question").updateOne({
            _id: ObjectId(topicId)
        }, {
            $set: {
                questionStatus: 1
            }
        }, function (err, dbRes) {
            if (err) throw err;
            console.log("帖子已禁用!", dbRes.result.nModified);
            client.close();
        })
    })


    var pageNum = Number(req.query.pageNumQ);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        // 查询总条目数
        var topicCount = await getQuestionCount(dbo);
        console.log("所有帖子" + topicCount);

        dbo.collection("question").find({
            questionStatus: 0
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }

            // 结合populars.art渲染数据
            res.render('questionList.art', {
                questionlist: result,
                pageNumQ: result.length == 0 ? pageNum - 1 : pageNum,
                pageCountQ: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })
})
//查看单个问题
router.get("/queryOneQusetionById/:topicId", function (req, res) {
    var questionId = req.params.topicId;
    console.log("查询单个帖子的ID:" + questionId);
    common.getMongoClient().then(async (client) => {
        var dbo = client.db("forum"); // dbo就是指定的数据库对象

        dbo.collection("question").find({
            _id: ObjectId(questionId)
        }).toArray(function (err, result) {
            // res.json(result);
            // 渲染数据
            res.render('backQuestionDetail.art', {
                detail: result[0]
            });
        })
    })
})
//=========问题回收站
router.get("/queryQuestionRecycle", function (req, res) {
    console.log("管理员查询所有被禁用问题");
    // 获取得到页码和每页显示的条目数
    console.log(req.query);
    var pageNum = Number(req.query.pageNumQR);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        // 查询回收站总条目数
        var topicCount = await getRecycleQuestionCount(dbo);
        console.log("所有回收站帖子" + topicCount);

        dbo.collection("question").find({
            questionStatus: 1
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }

            // 结合populars.art渲染数据
            res.render('questionRecycle.art', {
                questionRecycle: result,
                pageNumQR: pageNum,
                pageCountQR: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })
})
// 恢复问题
router.get("/recoverQuestionById/:topicId", function (req, res) {
    var topicId = req.params.topicId;
    console.log("帖子ID:" + topicId);
    // 每访问一次,就记录一次
    common.getMongoClient().then((client) => {
        var dbo = client.db("forum"); // dbo就是指定的数据库对象

        dbo.collection("question").updateOne({
            _id: ObjectId(topicId)
        }, {
            $set: {
                questionStatus: 0
            }
        }, function (err, dbRes) {
            if (err) throw err;
            console.log("问题已恢复!", dbRes.result.nModified);
            client.close();
        })
    })


    var pageNum = Number(req.query.pageNumQR);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        // 查询总条目数
        var topicCount = await getRecycleCount(dbo);
        console.log("所有回收站帖子" + topicCount);

        dbo.collection("question").find({
            questionStatus: 1
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }

            // 重新结合populars.art渲染数据
            res.render('questionRecycle.art', {
                questionRecycle: result,
                pageNumQR: result.length == 0 ? pageNum - 1 : pageNum,
                pageCountQR: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })
})
//查看问题标签列表
router.get("/queryAllQuestionLabel", function (req, res) {
    console.log("管理员查询问题标签列表");
    // 获取得到页码和每页显示的条目数
    console.log(req.query);
    var pageNum = Number(req.query.pageNumQL);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        // 查询总条目数
        var topicCount = await getQuestionLabelCount(dbo);
        console.log("所有标签" + topicCount);
        if (topicCount > 0) {
            dbo.collection("questionLabels").find({
                labelStatus: {
                    $gte: 0
                }
            }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
                // 处理帖子id
                for (var i = 0; i < result.length; i++) {
                    result[i]._id = result[i]._id.toString();
                }

                // 结合populars.art渲染数据
                res.render('questionLabelList.art', {
                    questionLabelList: result,
                    pageNumQL: pageNum,
                    pageCountQL: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
                });
            })
        } else {
            // 结合populars.art渲染数据
            res.render('questionLabelList.art', {
                questionLabelList: null,
                pageNumQL: null,
                pageCountQL: null
            });
        }
    })
})
//禁用或者恢复问题标签
router.get("/deleteQuestionLabelById/:topicId/:status", function (req, res) {
    var labelId = req.params.topicId;
    var status = Number(req.params.status);
    console.log("标签ID:" + labelId, status);
    // 每访问一次,就记录一次
    common.getMongoClient().then((client) => {
        var dbo = client.db("forum"); // dbo就是指定的数据库对象
        dbo.collection("questionLabels").findOne({
            _id: ObjectId(labelId)
        }, function (err, dbRes) {
            if (err) throw err;
            if (dbRes.labelStatus == 0) {
                dbo.collection("questionLabels").updateOne({
                    _id: ObjectId(labelId)
                }, {
                    $set: {
                        labelStatus: status
                    }
                }, function (err1, updateResult) {
                    console.log("已禁用");
                    client.close();
                });
            } else if (dbRes.labelStatus == 1) {
                dbo.collection("questionLabels").updateOne({
                    _id: ObjectId(labelId)
                }, {
                    $set: {
                        labelStatus: status
                    }
                }, function (err1, updateResult) {
                    console.log("已解禁");
                    client.close();
                });
            }
        })
    })

    console.log("管理员查询问题标签列表");
    // 获取得到页码和每页显示的条目数
    console.log(req.query);
    var pageNum = Number(req.query.pageNumQL);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        // 查询总条目数
        var topicCount = await getLabelCount(dbo);
        console.log("所有标签" + topicCount);
        if (topicCount > 0) {
            dbo.collection("questionLabels").find({
                labelStatus: {
                    $gte: 0
                }
            }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
                // 处理帖子id
                for (var i = 0; i < result.length; i++) {
                    result[i]._id = result[i]._id.toString();
                }

                // 结合populars.art渲染数据
                res.render('questionLabelList.art', {
                    questionLabelList: result,
                    pageNumQL: pageNum,
                    pageCountQL: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
                });
            })
        } else {
            // 结合populars.art渲染数据
            res.render('questionLabelList.art', {
                questionLabelList: null,
                pageNumQL: null,
                pageCountQL: null
            });
        }

    })
})
// 新增问题标签
router.post("/addQuestionLabel", function (req, res) {
    console.log("新增标签");
    req.body.labelStatus = Number(req.body.labelStatus);
    console.log(req.body);
    common.getMongoClient().then(function (client) {
        var dbo = client.db("forum");
        dbo.collection("questionLabels").insertOne(req.body, function (err, resDb) {
            if (err) throw err;
            // 通过res.insertedCount可以获取插入的数量
            console.log("插入成功", resDb);
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


// -------用户模块路由
router.get("/queryAllUser", function (req, res) {
    console.log("管理员查询所有用户");
    // 获取得到页码和每页显示的条目数
    console.log(req.query);
    var pageNum = Number(req.query.pageNumU);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        // 查询总条目数
        var topicCount = await getUserCount(dbo);
        console.log("查询到所有会员数量为" + topicCount);

        dbo.collection("user").find({
            userStatus: {
                $gte: 0
            }
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            // 处理帖子id
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }

            // 结合populars.art渲染数据
            res.render('userList.art', {
                userlist: result,
                pageNumU: pageNum,
                pageCountU: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })
})

router.get("/deleteUserById/:topicId", function (req, res) {
    var topicId = req.params.topicId;
    console.log("帖子ID:" + topicId);
    common.getMongoClient().then((client) => {
        var dbo = client.db("forum"); // dbo就是指定的数据库对象

        dbo.collection("user").updateOne({
            _id: ObjectId(topicId)
        }, {
            $set: {
                userStatus: 1
            }
        }, function (err, dbRes) {
            if (err) throw err;
            console.log("用户已禁用!", dbRes.result.nModified);
            client.close();
        })
    })


    var pageNum = Number(req.query.pageNumU);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        var topicCount = await getUserCount(dbo);
        console.log("所有用户" + topicCount);

        dbo.collection("user").find({
            userStatus: 0
        }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
            for (var i = 0; i < result.length; i++) {
                result[i]._id = result[i]._id.toString();
            }

            res.render('userList.art', {
                userlist: result,
                pageNumU: result.length == 0 ? pageNum - 1 : pageNum,
                pageCountU: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
            });
        })
    })
})

//禁用或者恢复标签
router.get("/deleteUserById/:topicId/:status", function (req, res) {
    var userId = req.params.topicId;
    var status = Number(req.params.status);
    console.log("用户ID:" + userId, status);
    // 每访问一次,就记录一次
    common.getMongoClient().then((client) => {
        var dbo = client.db("forum"); // dbo就是指定的数据库对象
        dbo.collection("user").findOne({
            _id: ObjectId(userId)
        }, function (err, dbRes) {
            if (err) throw err;
            if (dbRes.userStatus == 0) {
                dbo.collection("user").updateOne({
                    _id: ObjectId(userId)
                }, {
                    $set: {
                        userStatus: status
                    }
                }, function (err1, updateResult) {
                    console.log("已禁用");
                    client.close();
                });
            } else if (dbRes.userStatus == 1) {
                dbo.collection("user").updateOne({
                    _id: ObjectId(userId)
                }, {
                    $set: {
                        userStatus: status
                    }
                }, function (err1, updateResult) {
                    console.log("已解禁");
                    client.close();
                });
            }
        })
    })

    console.log("管理员查询用户列表");
    // 获取得到页码和每页显示的条目数
    console.log(req.query);
    var pageNum = Number(req.query.pageNumU);
    var pageSize = Number(req.query.pageSize);
    var skipValue = (pageNum - 1) * pageSize;

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        // 查询总条目数
        var topicCount = await getUserCount(dbo);
        console.log("所有用户" + topicCount);
        if (topicCount > 0) {
            dbo.collection("user").find({
                userStatus: {
                    $gte: 0
                }
            }).skip(skipValue).limit(pageSize).toArray(function (err, result) {
                // 处理帖子id
                for (var i = 0; i < result.length; i++) {
                    result[i]._id = result[i]._id.toString();
                }

                // 结合populars.art渲染数据
                res.render('userList.art', {
                    userlist: result,
                    pageNumU: pageNum,
                    pageCountU: topicCount % pageSize == 0 ? topicCount / pageSize : parseInt(topicCount / pageSize) + 1
                });
            })
        } else {
            // 结合populars.art渲染数据
            res.render('topicList.art', {
                userList: null,
                pageNumU: null,
                pageCountU: null
            });
        }

    })
})
// ---------首页渲染统计数据
router.get("/statisticsdata", function (req, res) {
    console.log("管理员查询统计数据");
    // 获取得到页码和每页显示的条目数
    console.log(req.query);

    common.getMongoClient().then(async function (client) {
        var dbo = client.db("forum");
        // 查询总条目数
        var topicCount = await getTopicCount(dbo);
        console.log("所有帖子" + topicCount);
        var questionCount = await getQuestionCount(dbo);
        console.log("所有问题" + questionCount);
        var userCount = await getUserCount(dbo);
        console.log("所有用户" + userCount);

        res.render('welcome.art', {
            tNum: topicCount,
            qNum: questionCount,
            uNum: userCount,
        })
    })
})

module.exports = router