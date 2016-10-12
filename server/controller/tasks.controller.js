var Task = require('../model/tasks.model');
var Project = require('../model/projects.model');
var Team = require('../model/teams.model');
var User = require('../model/users.model');
var mongoose = require('mongoose');

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
		var description = 'This is description demo';
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
					res.json({status: true, data:result, message:'Add task success'});
				}
			})
		}else{
			res.json({status: false, data: [], message: 'Validate failed'});
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