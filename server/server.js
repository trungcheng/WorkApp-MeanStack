var express = require('express');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var apiRoute = require('./routes');

mongoose.connect('mongodb://localhost:27017/meanpro1', function(err){
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

app.get('/', function(req, res){
	// res.setHeader("Access-Control-Allow-Origin", "*");
	res.sendFile('index.html', {root: '../client/'});
});

app.listen(3002, function(){
	console.log('App listening to http://localhost:3002');
});



