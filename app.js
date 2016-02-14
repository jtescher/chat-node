// Dependency imports
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const moment = require('moment');

// TODO: clean up redis config
var redis;
if (process.env.REDIS_URL) {
  let url = require("url").parse(process.env.REDIS_URL);
  redis = require("redis").createClient(url.port, url.hostname);
  redis.auth(url.auth.split(":")[1]);
} else {
  redis = require("redis").createClient();
}

// App imports
const chatHistory = require('./src/chat-history').ChatHistory(redis);
const clientConnectionHandler = require('./src/client-connection-handler');
const indexRoutes = require('./routes/index');
const channelRoutes = require('./routes/channels');

// Set up express and socket.io
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoutes);
app.use('/channels/', channelRoutes);

// Socket.io events
io.on('connection', socket => clientConnectionHandler(io, socket, chatHistory, moment));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = {
  app,
  server
};
