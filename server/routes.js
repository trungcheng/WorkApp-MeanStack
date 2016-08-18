var express = require('express');
var Router = express.Router();
var UserController = require('./controller/users.controller');
// user
Router.get('/user', UserController.index);
Router.get('/user/checkEmail/:email', UserController.checkEmail);
Router.get('/user/checkPhone/:phone', UserController.checkPhone);
Router.get('/user/verify/confirm_email/:timeId', UserController.verify);																																																																																																														
Router.post('/user', UserController.register);
Router.post('/authenticate', UserController.authenticate);
Router.delete('/user/:id', UserController.destroy);



module.exports = Router;
