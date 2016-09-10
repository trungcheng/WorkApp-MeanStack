var express = require('express');
var Router = express.Router();
var multer  = require('multer');
var UserController = require('./controller/users.controller');
var TeamController = require('./controller/teams.controller');
var Middleware = require('./middleware/users');

// user
Router.get('/user', UserController.index);
Router.get('/user/userdetail', Middleware.handle, UserController.show);
Router.get('/user/checkEmail/:email', UserController.checkEmail);
Router.get('/user/checkPhone/:phone', UserController.checkPhone);
Router.get('/user/verify/confirm_email/:timeId', UserController.verify);																																																																																																														
Router.post('/user/register', UserController.register);
Router.post('/user/authenticate', UserController.authenticate);
Router.post('/user/password_reset', UserController.resetpass);
Router.get('/user/password_reset/:id', UserController.verify_resetpass)
Router.put('/user/password_reset', UserController.changepass);
Router.put('/user/updatepass/:id', UserController.updatepass);
Router.put('/user/userdetail/:id', UserController.update);
Router.delete('/user/:id', UserController.destroy);

var storage = multer.diskStorage({
  	destination: function (req, file, cb) {
    	cb(null, 'public/uploads/' + req.user._id);
  	},
  	filename: function (req, file, cb) {
    	cb(null, Date.now() + "-" + file.originalname);
  	}
});
var upload = multer({ storage : storage });

Router.post('/user/upload',Middleware.handle, upload.any(), UserController.upload);

// team
Router.get('/team', TeamController.index);
Router.get('/team_processing/verify/confirm_join/:teamId', TeamController.verify);
Router.get('/teamdetail_processing/verify/confirm_join/:teamId', TeamController.verify_DetailTeam);
Router.post('/team', Middleware.handle, TeamController.add);
Router.post('/thisteam/:id', Middleware.handle, TeamController.addmem);
Router.delete('/team/:id', TeamController.destroy);

module.exports = Router;

