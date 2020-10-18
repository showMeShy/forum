var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// const topic = require('./routes/topic')

var usersRouter = require('./routes/user');
var askDetail = require('./routes/askDetail');
var question = require('./routes/question');
var amend = require('./routes/amend');
const userCenter = require('./routes/userCenter')
const backstage = require('./routes/backstage')
const index = require('./routes/index')
const topic = require('./routes/topic')
const multerUpload = require('./routes/upload');
const questionDetails = require('./routes/questionDetails');
const questionUpload = require('./routes/questionUpload');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'))
    // app.use(express.static('uploads'))


// 渲染引擎设置
app.engine('art', require('express-art-template'));
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production'
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'art');

// 用来解析 application/json
app.use(express.json())
    // 用来解析 application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: true
}))
app.use('/', index);
app.use('/user', usersRouter);
app.use("/index", index)
app.use("/question", question)
app.use("/askDetail", askDetail)
app.use("/amend", amend)
app.use("/userCenter", userCenter)
<<<<<<< HEAD
app.use('/backstage', backstage)

app.use('/questionDetails', questionDetails)
=======
app.use('/backstage', backstage) <<

    app.use('/questionDetails', questionDetails)
>>>>>>> 92b21530bf1ad66f518eda6c368a8f7b298ce44f
app.use('/questionUpload', questionUpload)
    // 首页
app.use('/topic', topic)
app.use('/upload', multerUpload);

module.exports = app;

<<<<<<< HEAD
    // 首页
=======
// 首页
>>>>>>> 92b21530bf1ad66f518eda6c368a8f7b298ce44f
app.use('/topic', topic)
app.use('/upload', multerUpload);


// app.use("/topic",topic)
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

<<<<<<< HEAD
module.exports = app;

=======
module.exports = app;
>>>>>>> 92b21530bf1ad66f518eda6c368a8f7b298ce44f
