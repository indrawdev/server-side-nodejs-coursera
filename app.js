const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);
const userRouter = require('./routes/userRouter');

var session = require('express-session');
var FileStore = require('session-file-store')(session);

const app = express();

app.use(passport.initialize());
app.use(passport.session());
app.use('/users', userRouter);

app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({
	name: 'session-id',
	secret: '12345-67890-09876-54321',
	saveUninitialized: false,
	resave: false,
	store: new FileStore()
}));

function auth(req, res, next) {
	console.log(req.user);

	if (!req.user) {
		var err = new Error('You are not authenticated!');
		err.status = 403;
		next(err);
	}
	else {
		next();
	}
}

connect.then((db) => {
	console.log("Connected correctly to server");

}, (err) => { console.log(err); });