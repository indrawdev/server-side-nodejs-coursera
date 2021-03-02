var https = require('https');
var fs = require('fs');

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

const index = require('./routes/index');
const users = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

var passport = require('passport');
var config = require('./config');

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
	console.log("Connected correctly to server");

}, (err) => { console.log(err); });

const app = express();

app.set('secPort',port+443);
app.use(morgan('dev'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
// app.use(passport.session());
app.use('/', index);
app.use('/users', users);
// app.use(cookieParser('12345-67890-09876-54321'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// app.use(session({
// 	name: 'session-id',
// 	secret: '12345-67890-09876-54321',
// 	saveUninitialized: false,
// 	resave: false,
// 	store: new FileStore()
// }));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

const server = http.createServer(app);

/**
 * Create HTTPS server.
 */ 
 
var options = {
  key: fs.readFileSync(__dirname+'/private.key'),
  cert: fs.readFileSync(__dirname+'/certificate.pem')
};

var secureServer = https.createServer(options,app);

/**
 * Listen on provided port, on all network interfaces.
 */

secureServer.listen(app.get('secPort'), () => {
   console.log('Server listening on port ',app.get('secPort'));
});
secureServer.on('error', onError);
secureServer.on('listening', onListening);

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
	connect.then((db) => {
		console.log('Connected correctly to server');
	});
});