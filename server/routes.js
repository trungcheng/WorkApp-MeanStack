var express = require('express');
var Router = express.Router();
var multer  = require('multer');
var UserController = require('./controller/users.controller');
var TeamController = require('./controller/teams.controller');
var ProjectController = require('./controller/projects.controller');
var TaskController = require('./controller/tasks.controller');
var CheckListController = require('./controller/checklists.controller');
var FileController = require('./controller/file.controller');
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
Router.get('/team', Middleware.handle, TeamController.index);
Router.get('/team_processing/verify/confirm_join/:teamId', TeamController.verify);
Router.get('/teamdetail_processing/verify/confirm_join/:teamId', TeamController.verify_DetailTeam);
Router.post('/team', Middleware.handle, TeamController.add);
Router.post('/thisteam/:id', Middleware.handle, TeamController.addmem);
Router.put('/thisteam/name/:id', TeamController.updateTeamName);
Router.put('/thisteam/desc/:id', TeamController.updateTeamDesc);
Router.delete('/team/:id', TeamController.destroy);
Router.delete('/thisteam/remove/:teamId/:memId', TeamController.destroyMem);

//project
Router.get('/project', ProjectController.index);
Router.get('/project-detail/:project_id', ProjectController.showProject);
Router.post('/project', Middleware.handle, ProjectController.add);
Router.put('/project/:id', ProjectController.update);
Router.put('/thisproject/name/:id', ProjectController.updateProjectName);
Router.put('/thisproject/desc/:id', ProjectController.updateProjectDesc);
Router.delete('/project/:id', ProjectController.destroy);

//task
Router.get('/tasks/:project_id', Middleware.handle, TaskController.index);
Router.get('/task/:task_id', TaskController.showTask);
Router.get('/task/project-detail/:id', TaskController.showAllMember);
Router.get('/task/attachments/download', TaskController.downloadFileAttach);
Router.get('/task/comments/:task_id', TaskController.allComment);
Router.post('/task', Middleware.handle, TaskController.addTask);
Router.post('/task/addMem/:id', TaskController.addMem);
Router.post('/task/addcomment/:task_id', Middleware.handle, TaskController.addComment);

var storage_task = multer.diskStorage({
  	destination: function (req, file, cb) {
    	cb(null, 'public/attachments/' + req.params.task_id);
  	},
  	filename: function (req, file, cb) {
    	cb(null, Date.now() + "-" + file.originalname);
  	}
});
var upload_attachments = multer({ storage : storage_task });

Router.post('/task/attachments/:task_id', Middleware.handle, upload_attachments.any(), FileController.index);
Router.put('/task/priority-low/:id', TaskController.updatePriorityLow);
Router.put('/task/priority-normal/:id', TaskController.updatePriorityNormal);
Router.put('/task/priority-highest/:id', TaskController.updatePriorityHighest);
Router.put('/task/status-resolved/:id', TaskController.updateStatusResolved);
Router.put('/task/status-inprogress/:id', TaskController.updateStatusInprogress);
Router.put('/thistask/name/:id', TaskController.updateTaskName);
Router.put('/thistask/desc/:id', TaskController.updateTaskDesc);
Router.put('/thistask/startdate/:id', TaskController.updateStart);
Router.put('/thistask/duedate/:id', TaskController.updateDue);
Router.delete('/task/removeMem/:taskId/:memId', TaskController.removeMem);
Router.delete('/task/removecomment/:taskId', TaskController.removeComment);
Router.delete('/task/attachments/delete/:task_id/:file_id', TaskController.removeAttachFile);
Router.delete('/task/:id', TaskController.destroy);

//checklists
Router.get('/task/checklists/:task_id', CheckListController.index);
Router.post('/task/checklist/:task_id', Middleware.handle, CheckListController.addCheckList);
Router.post('/task/checklist/addTodo/:checklist_id', CheckListController.addTodo);
Router.put('/task/checklist/completeTodo/:task_id/:item_id', CheckListController.completeTodo);
Router.put('/task/checklist/unCompleteTodo/:task_id/:item_id', CheckListController.unCompleteTodo);
Router.delete('/task/checklist/removeTodo/:task_id/:checklist_id/:item_id', CheckListController.destroyTodo);
Router.delete('/task/removeCheckList/:checklist_id', CheckListController.destroy);

module.exports = Router;

