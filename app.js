const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

const index = require('./routes/index');
const users = require('./routes/users');
const streams = require('./routes/streams');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: '12345', saveUninitialized: true, resave: false }));
app.use(express.static(path.join(__dirname, 'public')));

// public 
app.use("/jquery", express.static(path.join(__dirname, "node_modules/jquery/dist")));
app.use("/bootstrap/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css/")));
app.use("/bootstrap/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js/")));

// routes
app.use('/', index);
app.use('/users', users);
app.use('/streams', streams);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
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
