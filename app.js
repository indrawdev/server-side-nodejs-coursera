const express = require('express');
const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

const app = express();

function auth(req, res, next) {

	console.log(req.headers);
	var authHeader = req.headers.authorization;
	if (!authHeader) {
		var err = new Error('You are not authenticated!');
		res.setHeader('WWW-Authenticate', 'Basic');
		err.status = 401;
		next(err);
		return;
	}

	var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
	var user = auth[0];
	var pass = auth[1];
	if (user == 'admin' && pass == 'password') {
		next(); // authorized
	} else {
		var err = new Error('You are not authenticated!');
		res.setHeader('WWW-Authenticate', 'Basic');
		err.status = 401;
		next(err);
	}
}

connect.then((db) => {
	console.log("Connected correctly to server");
	app.use(auth);
}, (err) => { console.log(err); });