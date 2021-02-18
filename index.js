const express = require('express');
const http = require('http');
const morgan = require('morgan');
const mongoose = require('mongoose');

const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');

const hostname = 'localhost';
const port = 3000;

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

const app = express();
app.use(morgan('dev'));

app.use('/dishes', dishRouter);
app.use('/promos', promoRouter);
app.use('/leaders', leaderRouter);

const server = http.createServer(app);

connect.then((db) => {

	console.log('Connected correctly to server');

});

server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});