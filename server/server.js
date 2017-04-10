'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var path = require('path');
var expressValidator = require('express-validator');
var bodyParser = require('body-parser');
var apiRoute = require('./routes');
var config = require('./config/db');
var server = require('http').Server(app);
var chatSocket = require('./config/chat');
var io = require('socket.io')(server);

io.on('connection', function(socket) {
    chatSocket.respond(socket, io.sockets);
});

mongoose.connect(config.database, function (err) {
	if(err) throw err;
	console.log('Connect to db success');
});

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use(expressValidator());

app.use('/client', express.static('../client'));
app.use('/node_modules', express.static('../node_modules'));
app.use('/server', express.static('../server'));

app.use('/api', apiRoute);

app.get('/', function(req, res) {
	res.sendFile('index.html', {root: '../client/'});
});

server.listen(1337, function() {
	console.log('App listening to http://localhost:1337');
});



