require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');


const options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: true,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}
const TWO_HOURS = 1000 * 60 * 60 * 2
app.use(session({
  name : 'sid',
  secret : 'anupam kumar jain',
  resave : false,
  saveUninitialized : false,
  cookie : { 
      secure : false ,
      maxAge: TWO_HOURS,
      sameSite : true,
  }
}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname,'views')));
app.use(express.static(path.join(__dirname,'data')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
