var Project = require('../model/projects.model');
var mongoose = require('mongoose');

var ProjectController = {

	index: function(req, res){
		Project.find({})
			.populate('created_by team_id').sort({created_at:-1}).exec(function(err, result){
				if(err){
					res.json({status:false, message:err});
				}else{
					res.json({status:true,data: result,message:'Get all project success'});
				}
			})
	},

	showProject: function(req, res){
		Project.findOne({_id:req.params.project_id}, function(err, result){
			if(err) throw err;
			res.json({status: true, data: result, message:'Show project success'});
		})
	},

	add: function(req, res){
		// console.log(req.body);
		var name = req.body.name || '';
		var description = req.body.description || '';
		var start_date = req.body.start || '';
		var due_date = req.body.due || '';
		var teamId = req.body.selectedTeam._id || '';

		if(name != ''){
			var data = {
				name: name,
				description: description,
				start_date: start_date,
				due_date: due_date,
				team_id: teamId,
				created_by: new mongoose.Types.ObjectId(req.user._id),
				updated_by: new mongoose.Types.ObjectId(req.user._id)
			};
			var project = new Project(data);
			req.checkBody('name', 'name is required').notEmpty();
			req.checkBody('description', 'description is required').notEmpty();
			var errors = req.validationErrors();
			if(!errors){
				project.save(function(err, result){
					if(err){
						res.json({status: false, message:err});
					}else{
						res.json({status: true, data:result, message:'Add project success'});
					}
				})
			}else{
				res.json({message:'Validate failed, please try again !'});
			}
		}else{
			res.json({status: false, data: [], message: 'Validate failed'});
		}
	},

	updateProjectName: function(req, res){
		var id = req.params.id;
		Project.findOne({_id:id}, function(err, result){
			result.name = req.body.newName;
			result.save(function(err, saveresult){
				if(err) throw err;
				res.json({status: true,data:saveresult, message: 'Update project name success'});
			})
		})
	},

	updateProjectDesc: function(req, res){
		var id = req.params.id;
		Project.findOne({_id:id}, function(err, result){
			result.description = req.body.newDesc;
			result.save(function(err, saveresult){
				if(err) throw err;
				res.json({status: true,data:saveresult, message: 'Update project description success'});
			})
		})
	},

	update: function(req, res){
		var id = req.params.id;
		Project.findOne({_id:id}, function(err, result){
			result.start_date = req.body.start;
			result.due_date = req.body.due;
			result.team_id = req.body.selected;
			result.save(function(err, result1){
				if(err){
					res.json({status:false, data:[], message:err});
				}else{
					res.json({status:true, data:result1, message:'Update project success'});
				}
			})
		})
	},

	destroy: function(req, res){
		var id = req.params.id;
		Project.findOneAndRemove({_id:id}, function(err, result){
			if(err){
				res.json({status: false, message:err});
			}else{
				res.json({status: true, message:'Delete project success'});
			}
		})
	}

}
module.exports = ProjectController;