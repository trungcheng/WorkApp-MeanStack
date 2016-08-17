var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

var UserController = require('./controller/users.controller');

mongoose.connect('mongodb://localhost:27017/meanpro1', function(err){
	if(err) throw err;
	console.log('Connect to db success');
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// user
app.get('/user', UserController.index);
app.get('/user/check/:email', UserController.checkEmail);
app.get('/user/verify/confirm_email', UserController.verify);																																																																																																														
app.post('/user', UserController.register);
app.post('/authenticate', UserController.authenticate);
app.delete('/user/:id', UserController.destroy);

app.use('/client', express.static('../client'));
app.use('/node_modules', express.static('../node_modules'));

app.get('/', function(req, res){
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.sendFile('index.html', {root: '../client/'});
});

app.listen(3002, function(){
	console.log('App listening to http://localhost:3002');
});



