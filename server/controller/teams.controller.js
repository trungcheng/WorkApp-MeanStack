var Team = require('../model/teams.model');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

var TeamController = {

	index: function(req, res){
		Team.find({}).populate('owner members').sort({created_at:-1}).exec(function(err, result){
			if(err){
				res.json({status: false, data:{}, message:err});
			}else{
				res.json({status: true, data: result, message: 'Get all team success'});
			}
		})
	},

	add: function(req, res){
		var selectedMember = [];
		var name = req.body.name || '';
		var description = req.body.description || '';

		if(name != ''){
			req.body.selectedMember.forEach(function(item){
				selectedMember.push(item);
			});
			var data = {
				name: name,
				description: description,
				members_processing: selectedMember,
				owner: new mongoose.Types.ObjectId(req.user._id),
				created_by: new mongoose.Types.ObjectId(req.user._id),
				updated_by: new mongoose.Types.ObjectId(req.user._id)
			}
			var team = new Team(data);
			req.checkBody('name', 'name is required').notEmpty();
			req.checkBody('description', 'description is required').notEmpty();
			var errors = req.validationErrors();
  			if(!errors){
				team.save(function(err, result){
					if(err){
						res.json({status: false, data: [], message: err});
					} else {
						result.members_processing.forEach(function(member){

							var smtpConfig = nodemailer.createTransport("SMTP",{
								host: "smtp.gmail.com",
								secureConnection: true,
								port: 465,
								requiresAuth: true,
								domains: ["gmail.com", "googlemail.com"],
								auth: {
									user: "trungs1bmt@gmail.com",
									pass: "hajimemashite"
								}
							});

							var mailOptions,host,link;

						    host = req.get('host');
						    link = "http://"+req.get('host')+"/api/team_processing/verify/confirm_join/"+result._id+"?memberId="+member._id;
						    mailOptions = {
						    	from :  'WorkApp.com <trungs1bmt@gmail.com>',
						        to : member.email,
						        subject : "[WorkApp] Please confirm joining to team",
						        html : "Welcome <strong>"+member.name.first+" "+member.name.last+"</strong> to "+result.name+" Team !<br><br>Please Click on the link to verify that you have joined to team.<br><a href="+link+">Click here to verify now !</a><br><br>Thanks,<br>Your friends at WorkApp"
						    }

						    smtpConfig.sendMail(mailOptions, function(error, response){
							    if(error){
							        console.log(error);
							    }else{
							    	console.log('send mail success');
							        console.log(response.message);
							    }
							});

							smtpConfig.close();
						});

						res.json({status: true, data:result, message: 'Add team success'});
					}
				})
			}else{
				res.json({message:'Validate failed, please try again !'});
			}
		}else {
			res.json({status: false, data: [], message: 'Validate failed'});
		}
	},

	addmem: function(req, res){
		var teamId = req.params.id;
		var selectedMember = [];

		Team.findOne({_id:teamId}, function(err, result){
			if(err){
				res.json({status: false, data:[], message: err});
			}else{
				req.body.selectedMember.forEach(function(item){
					selectedMember.push(item);
				});
				result.members_processing = selectedMember;
				result.save(function(err, result1){
					if(err){
						res.json({status: false, data: [], message: err});
					}else{
						result1.members_processing.forEach(function(member){
							var smtpConfig = nodemailer.createTransport("SMTP",{
								host: "smtp.gmail.com",
								secureConnection: true,
								port: 465,
								requiresAuth: true,
								domains: ["gmail.com", "googlemail.com"],
								auth: {
									user: "trungs1bmt@gmail.com",
									pass: "hajimemashite"
								}
							});

							var mailOptions,host,link;

						    host = req.get('host');
						    link = "http://"+req.get('host')+"/api/teamdetail_processing/verify/confirm_join/"+result1._id+"?memberId="+member._id;
						    mailOptions = {
						    	from :  'WorkApp.com <trungs1bmt@gmail.com>',
						        to : member.email,
						        subject : "[WorkApp] Please confirm joining to team",
						        html : "Welcome <strong>"+member.name.first+" "+member.name.last+"</strong> to "+result1.name+" Team !<br><br>Please Click on the link to verify that you have joined to team.<br><a href="+link+">Click here to verify now !</a><br><br>Thanks,<br>Your friends at WorkApp"
						    }

						    smtpConfig.sendMail(mailOptions, function(error, response){
							    if(error){
							        console.log(error);
							    }else{
							    	console.log('send mail success');
							        console.log(response.message);
							    }
							});

							smtpConfig.close();
						});
					}

					res.json({status: true, data:result, message: 'Add team success'});
				})
			}
		})
	},

	verify: function(req, res){
		var teamId = req.params.teamId;
		var memberId = req.query.memberId;
		req.checkQuery('memberId','memberId must be MongoId').isMongoId();
		req.checkParams('teamId','teamId must be MongoId').isMongoId();
		var errors = req.validationErrors();
		if(!errors){
			Team.findOne({_id:teamId}, function(err, result){
				if(err) throw err;
				for(var i=0; i< result.members_processing.length;i++){
					if(result.members_processing[i]._id == memberId){
						result.members.push(result.members_processing[i]);
						result.members_processing.splice(result.members_processing[i],1);
						result.save(function(err){
							if(err) throw err;
							var host = req.get('host');
					 		res.redirect('http://'+host+'/#/access/login?stt=Confirm-join-success');
						})
					}else{
						res.send('Confirm failed');
					}
				}
			})
		}else{
			res.json({message:'Confirm failed !'});
		}
	},

	verify_DetailTeam: function(req, res){
		var teamId = req.params.teamId;
		var memberId = req.query.memberId;
		req.checkQuery('memberId','memberId must be MongoId').isMongoId();
		req.checkParams('teamId','teamId must be MongoId').isMongoId();
		var errors = req.validationErrors();
		if(!errors){
			Team.findOne({_id:teamId}, function(err, result){
				if(err) throw err;
				for(var i=0; i< result.members_processing.length;i++){
					if(result.members_processing[i]._id == memberId){
						result.members.push(result.members_processing[i]);
						result.members_processing.splice(result.members_processing[i],1);
						result.save(function(err){
							if(err) throw err;
							var host = req.get('host');
					 		res.redirect('http://'+host+'/#/access/login?stt=Confirm-join-success');
						})
					}else{
						res.send('Confirm failed');
					}
				}
			})
		}else{
			res.json({message:'Confirm failed !'});
		}
	},

	destroy: function(req, res){

		var id = req.params.id;
		Team.findOneAndRemove({_id:id}, function(err, result){
			if(err){
				res.json({status: false, data: [], message: err});
			} else {
				res.json({status: true, data: {}, message: 'remove team success'});
			}
		})
	}

}

module.exports = TeamController;