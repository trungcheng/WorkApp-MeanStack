var Task = require('../model/tasks.model');
var Project = require('../model/projects.model');
var Team = require('../model/teams.model');
var User = require('../model/users.model');
var mongoose = require('mongoose');
var events = require('events');
var fs = require('fs');
var path = require('path');
var uploadPath = './public/attachments/';

// var eventEmiter = new events.EventEmitter();

// eventEmiter.on('upload_success', function(file) {
// 	TaskController.saveFileAttach(file);
// });

var TaskController = {

	index: function(req, res){
		Task.find({
			project_id: req.params.project_id,
			$or: [
				{assign_to: {$in:[req.user._id]}},
				{created_by: req.user._id}
			]
		}).populate('project_id assign_to').sort({created_at:-1}).exec(function(err, result){
				if(err){
					res.json({status:false, message:err});
				}else{
					res.json({status:true,data: result,message:'Get all task success'});
				}
			})
	},

	showTask: function(req, res){
		Task.findOne({_id:req.params.task_id}, function(err, result){
			if(err) throw err;
			res.json({status:true, data:result, message:'Get this task success'})
		})
	},

	showAllMember: function(req, res){
		var proId = req.params.id;
		var members = [];
		Project.findOne({_id:proId}, function(err, result){
			if(err){
				res.json({status:false, message:err});
			}else{
				Team.findOne({_id: result.team_id}, function(err, team){
					team.members.forEach(function(item){
						User.findOne({_id:item}, function(err, user){
							members.push(user);
							if(members.length == team.members.length){
								res.json({status:true, data: members, message:'Get all members success'});
							};
						});
					});
				});
			}
		})
	},

	addTask: function(req, res){
		var selectedMember = [];
		var name = req.body.name;
		var description = req.body.description || '';
		var project_id = new mongoose.Types.ObjectId(req.body.project_id);

		if(name != ''){
			req.body.selectedMember.forEach(function(item){
				selectedMember.push(new mongoose.Types.ObjectId(item._id));
			});
			var data = {
				name: name,
				description: description,
				assign_to: selectedMember,
				project_id: project_id,
				created_by: new mongoose.Types.ObjectId(req.user._id),
				updated_by: new mongoose.Types.ObjectId(req.user._id)
			};
			var task = new Task(data);
			task.save(function(err, result){
				if(err){
					res.json({status: false, message:err});
				}else{
					if(!fs.existsSync(uploadPath + result._id)) {
					    fs.mkdirSync(uploadPath + result._id, 0777, function(err){
					    	if(err) throw err;
					    	console.log('create dir success');
					    });
					}else{
						console.log('Dir already exists');
					}
					res.json({status: true, data:result, message:'Add task success'});
				}
			})
		}else{
			res.json({status: false, data: [], message: 'Validate failed'});
		}
	},

	addMem: function(req, res){
		var id = req.params.id;
		Task.findOne({_id:id}, function(err, result){
			if(req.body.selectedMember){
				req.body.selectedMember.forEach(function(item){
					result.assign_to.push(new mongoose.Types.ObjectId(item._id));
				});
				result.save(function(err, finalResult){
					if(err) throw err;
					res.json({status: true, data: finalResult, message:'Add member success'});
				})
			}else{
				res.json({status: false, data: [], message:'Please select to member'});
			}
		})
	},

	allComment: function(req, res){
		req.checkParams('task_id', 'PARAMS_IS_NOT_EMPTY').notEmpty();
        req.checkParams('task_id', 'MONGO_ID_FORMAT_INVALID').isMongoId();
        var errors = req.validationErrors();
        if (errors){
            res.json({status: false, message:'Validate failed'});
        }else{
        	var comments = [];
        	Task.aggregate([
	            { $match: { _id: new mongoose.Types.ObjectId(req.params.task_id) } },
	            { $unwind: '$comments' },
	            // { $match: { 'comments.father_id': null } },
	            { $sort: { 'comments.created_at': -1 } },
	            // { $limit: 5 },
	            { $project: { comments: 1 } }, {
	                $lookup: {
	                    from: 'users',
	                    localField: 'comments.user_id',
	                    foreignField: '_id',
	                    as: 'comments.users'
	                }
	            }
	        ], function(err, results) {
	            results.forEach(function(result, index) {
	                comments.push(result.comments);
	                if (index == results.length - 1) {
						res.json({status: true, data: comments, message:'Get all comments success'});
	                }
	            });
	        });
        }
	},

	addComment: function(req, res){
		req.checkParams('task_id', 'PARAMS_IS_NOT_EMPTY').notEmpty();
        req.checkParams('task_id', 'MONGO_ID_FORMAT_INVALID').isMongoId();
        var errors = req.validationErrors();
        if (errors){
            res.json({status: false, message:'Validate failed'});
        }else{
			Task.findOne({_id:req.params.task_id}, function(err, result){
				result.comments.push({
					user_id: req.user._id,
					content: req.body.txtcomment
				});
				result.save(function(err, finalResult){
					if(err) throw err;
					res.json({status:true, data: finalResult.comments, message:'Add comment success'});
				})
			})
		}
	},

	updatePriorityLow: function(req, res){
		var id = req.params.id;
		Task.findOne({_id:id}, function(err, result){
			result.priority = 1;
			result.save(function(err, low){
				if(err) throw err;
				res.json({status: true, data:low, message:'update priority to low success'});
			})
		})
	},

	updatePriorityNormal: function(req, res){
		var id = req.params.id;
		Task.findOne({_id:id}, function(err, result){
			result.priority = 0;
			result.save(function(err, normal){
				if(err) throw err;
				res.json({status: true, data:normal, message:'update priority to normal success'});
			})
		})
	},

	updatePriorityHighest: function(req, res){
		var id = req.params.id;
		Task.findOne({_id:id}, function(err, result){
			result.priority = 2;
			result.save(function(err, highest){
				if(err) throw err;
				res.json({status: true, data:highest, message:'update priority to highest success'});
			})
		})
	},

	updateStatusResolved: function(req, res){
		var id = req.params.id;
		Task.findOne({_id:id}, function(err, result){
			result.status = 1;
			result.save(function(err, resolved){
				if(err) throw err;
				res.json({status: true, data:resolved, message:'update status to resolved success'});
			})
		})
	},

	updateStatusInprogress: function(req, res){
		var id = req.params.id;
		Task.findOne({_id:id}, function(err, result){
			result.status = 0;
			result.save(function(err, inprogress){
				if(err) throw err;
				res.json({status: true, data:inprogress, message:'update status to inprogress success'});
			})
		})
	},

	updateTaskName: function(req, res){
		var id = req.params.id;
		Task.findOne({_id:id}, function(err, result){
			result.name = req.body.name;
			result.save(function(err, saveresult){
				if(err) throw err;
				res.json({status: true,data:saveresult, message: 'Update task name success'})
			})
		})
	},

	updateTaskDesc: function(req, res){
		var id = req.params.id;
		Task.findOne({_id:id}, function(err, result){
			result.description = req.body.desc;
			result.save(function(err, saveresult){
				if(err) throw err;
				res.json({status: true,data:saveresult, message: 'Update task description success'})
			})
		})
	},

	updateStart: function(req, res){
		var id = req.params.id;
		Task.findOne({_id:id}, function(err, result){
			result.start_date = req.body.newStart;
			result.save(function(err, finalResult){
				if(err) throw err;
				res.json({status: true, data: finalResult, message:'Update start date success'});
			})
		})
	},

	updateDue: function(req, res){
		var id = req.params.id;
		Task.findOne({_id:id}, function(err, result){
			result.due_date = req.body.newDue;
			result.save(function(err, finalResult){
				if(err) throw err;
				res.json({status: true, data: finalResult, message:'Update due date success'});
			})
		})
	},

	removeMem: function(req, res){
		var taskId = req.params.taskId;
		var memId = req.params.memId;
		Task.findOne({_id:taskId}, function(err, task){
			task.assign_to.splice(memId,1);
			task.save(function(err, finalTask){
				if(err) throw err;
				res.json({status:true, data:finalTask, message:'Remove member of task success'});
			})
		})
	},

	downloadFileAttach: function(req, res){
		var pathName = req.query.path;
		var pathCurrent = path.join(__dirname + '/../' + pathName);
		res.download(pathCurrent);
	},

	removeComment: function(req, res){
		var taskId = req.params.taskId;
		var commentIndex = req.body.cmt;
		Task.findOne({_id:taskId}, function(err, result){
			result.comments.splice(commentIndex,1);
			result.save(function(err, finalResult){
				if(err) throw err;
				res.json({status: true, data: finalResult, message:'Remove comment success'});
			})
		})
	},

	removeAttachFile: function(req, res){
		req.checkParams('task_id', 'PARAMS_IS_NOT_EMPTY').notEmpty();
        req.checkParams('task_id', 'MONGO_ID_FORMAT_INVALID').isMongoId();
        req.checkParams('file_id', 'PARAMS_IS_NOT_EMPTY').notEmpty();
        req.checkParams('file_id', 'MONGO_ID_FORMAT_INVALID').isMongoId();
        var errors = req.validationErrors();
        if(errors){
            res.json({status:false, message:'Validate failed'});
        }else{
        	Task.findOne({_id:req.params.task_id}, function(err, result){
        		result.file_attachs.forEach(function(item, index){
        			if(item._id == req.params.file_id){
        				result.file_attachs.splice(index,1);
        				result.save(function(err, fileattach){
        					if(err) throw err;
        					res.json({status: true, data:fileattach.file_attachs, message:'Remove file attach success'});
        				})
        			}
        		})
        	})
        }
	},

	destroy: function(req, res){
		var id = req.params.id;
		Task.findOneAndRemove({_id:id}, function(err, result){
			if(err){
				res.json({status: false, message:err});
			}else{
				res.json({status: true, message:'Delete task success'});
			}
		})
	}

}
module.exports = TaskController;