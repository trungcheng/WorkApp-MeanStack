var User = require('../model/users.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var fs = require('fs');
var rand = Math.floor((Math.random() * 100) + 54);

var uploadPath = './public/uploads/';

var UserController = {

	index: function(req, res){
		User.find(function(err, user){
			if(err){
				res.json({status: false, data:{}, message:err});
			}else{
				res.json({status: true, data:user, message:'Get all user success'});
			}
		})
	},

	show: function(req, res){
		var id = req.user._id
		User.findOne({_id:id}, function(err, result){
			if(err){
				res.json({status: false, message:err});
			}else{
				res.json({status: true, data:result, message:'Show user success'});
			}
		})
	},

	register: function(req, res){
		var first = req.body.first || '';
		var last = req.body.last || '';
		var email = req.body.email || '';
		var password = req.body.password || '';
		var address = req.body.address || '';
		var phone = req.body.phone || '';

		if(email != ''){
			var data = {
				name: {first: first, last: last},
				email: email,
				password: bcrypt.hashSync(password, bcrypt.genSaltSync(5)),
				address: address,
				phone: phone
			};
			var old_email = req.params.email;
			var user = new User(data);
			var old_user = User.find({email:old_email});
			if(user.email != old_user.email){
				req.checkBody('phone', 'phone is required').notEmpty();
				req.checkBody('email', 'email is required').notEmpty();
				req.checkBody('email', 'format email wrong').isEmail();
				req.checkBody('first', 'first is required').notEmpty();
				req.checkBody('first', 'first must be at from 2-6 characters').isLength({min:2,max:6});
				req.checkBody('last', 'last is required').notEmpty();
				req.checkBody('last', 'last must be at from 2-6 characters').isLength({min:2,max:6});
				req.checkBody('password', 'password is required').notEmpty();
				req.checkBody('password', 'password must be at least 6 characters').isLength({min:6});
				req.checkBody('address', 'address is required').notEmpty();
				var errors = req.validationErrors();
  				if(!errors){
					user.save(function(err, result){
						if(err){
							res.json({status: false, data: [], message: err});
						} else {

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
						    link = "http://"+req.get('host')+"/api/user/verify/confirm_email/"+rand+"?userId="+result._id;
						    mailOptions = {
						    	from :  'WorkApp.com <trungs1bmt@gmail.com>',
						        to : req.body.email,
						        subject : "[WorkApp] Please confirm your Email account",
						        html : "Welcome <strong>"+result.name.first+" "+result.name.last+"</strong> to WorkApp !<br><br>Please Click on the link to verify your email.<br><a href="+link+">Click here to verify account</a><br><br>Thanks,<br>Your friends at WorkApp"
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

							res.json({status: true, data:result, message: 'User register success, please confirm email now !'});
						}
					});
				}else{
					res.json({message:'Validate failed, please try again !'});
				}
			}else{
				res.json({status: false, data: [], message: 'Email has already exits !'});
			}
		} else {
			res.json({status: false, data: [], message: 'Validate failed, please try again !'});
		}
	},

	destroy: function(req, res){
		var id = req.params.id;
		User.findOneAndRemove({_id:id}, function(err, result){
			if(err){
				res.json({status:false, data:[], message: err});
			}else{
				res.json({status: true, data: {}, message: 'Remove user success'});
			}
		});
	},

	checkEmail: function(req, res){
		User.find({email: req.params.email}).count(function(err, count){
			if(count == 0){
				res.json({status: true, data: {}, message: 'Email invalid'});
			} else {
				res.json({status: false, data: [], message: 'Email already exists'});
			}
		})
	},

	checkPhone: function(req, res){
		User.find({phone: req.params.phone}).count(function(err, count){
			if(count == 0){
				res.json({status: true, data: {}, message: 'Phone number invalid'});
			} else {
				res.json({status: false, data: [], message: 'Phone number already exists'});
			}
		})
	},

	verify: function(req, res){
		var timeId = req.params.timeId;
		var userId = req.query.userId;
		req.checkQuery('userId','UserId must be MongoId').isMongoId();
		var errors = req.validationErrors();
		if(!errors){
			if(timeId == rand){
				User.findOne({_id:userId}, function(err, result){
					if(err){
						res.json({status:false, message:err});
					}else{
						result.active = true;
						result.save(function(err, result1){
							if(err){
								res.send('Email verify failed !');
							}else{
								
								if(!fs.existsSync(uploadPath + result._id)) {
								    fs.mkdirSync(uploadPath + result._id, 0777, function(err){
								    	if(err) throw err;
								    	console.log('create dir success');
								    });
								}else{
									console.log('Dir already exists');
								}
								var host = req.get('host');
								res.redirect('http://'+host+'/#/access/login?stt=Confirm-email-success');
							}
						})
					}
				});
			}else{
				res.json({message:'Confirm failed !'});
			}
		}else{
			res.json({message:'Confirm failed !'});
		}
	},

	authenticate: function(req, res){
		User.findOne({email: req.body.email}, function(err, authen){
			if(err){
				res.json({status: false, message: err});
			}
			if(!authen){
				res.json({status: false, message: 'Your email wrong !'});
			}else{
				var oldpass = authen.password;
				if(bcrypt.compareSync(req.body.password, oldpass)){

					if(authen.active){
						var token = jwt.sign(authen, 'trungcheng', {
							expiresIn: '30 days'
						});
						res.json({status: true, data:{member:authen, token: token}, message: 'Authenticate success.'})
					}else{
						res.json({status: false, data:{}, message: 'Not active email, please confirm email now !'})
					}
				}else{
					res.json({status: false, data:{}, message: 'Your password wrong.'})
				}
			}
		})
	},

	resetpass: function(req, res){
		User.findOne({email:req.body.email}, function(err, result){
			if(err){
				res.json({status: false, message: err});
			}else{
				var token_reset = jwt.sign({_id:result._id}, 'trungdn', {
					expiresIn: '15m'
				});
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
			    link = "http://"+req.get('host')+"/api/user/password_reset/"+token_reset;
			    mailOptions = {
			    	from :  'WorkApp.com <trungs1bmt@gmail.com>',
			        to : req.body.email,
			        subject : "[WorkApp] Please reset your password",
			        html : "We heard that you lost your WorkApp password. Sorry about that !<br><br>But don’t worry! You can use the following link within the next day to reset your password:<br><br> Please Click on the link to reset your password.<br><a href="+link+">Click here to reset your password</a><br><br>Thanks,<br>Your friends at WorkApp"
			    }

			    smtpConfig.sendMail(mailOptions, function(err){
				    if (err) throw err;
				});

				smtpConfig.close();

				res.json({status:true, message:'Please check email to reset password now !'});
			}
		})
	},

	verify_resetpass: function(req, res){
		var id = req.params.id;
		var host = req.get('host');
		res.redirect('http://'+host+'/#/access/password_reset?reset_code='+id);
	},

	changepass: function(req, res){
		var token_rpw = req.query.token;
		if(token_rpw){
			jwt.verify(token_rpw, 'trungdn', function(err, decoded){
				if(err){
					res.status(401).json({status:false, data:{}, message:err });
				}else{
					req.user = decoded;
					User.findOne({_id:req.user._id}, function(err, result){
						if(err){
							res.json({status: false, message:err});
						}else{
							result.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(5));
							result.save(function(err, result1){
								if(err){
									res.json({status: false, message:'Your password reset failed'});
								}else{
									res.json({status: true, message:'Your password reset success'});
								}
							})
						}
					})
				}
			})
		}else{
			res.status(404).json({status:false, data:{}, message:'Token not found'});
		}
	},

	update: function(req, res){

		var id = req.params.id;
		User.findOne({_id:id}, function(err, result){
			if(err){
				res.json({status: false, data: [], message: err});
			} else {
				if(result.email == req.body.email && result.phone == req.body.phone){
					result.email = req.body.email;
					result.phone = req.body.phone;
					result.name.first = req.body.first;
					result.name.last = req.body.last;
					result.address = req.body.address;
					result.save(function(err){
						if(err){
							res.json({status: false, message: err});
						}else{
							res.json({status: true, message: 'Update profile infomation success'});
						}
					})
				}else{
					User.find({$or:[{email:req.body.email},{phone:req.body.phone}]}).exec(function(err,result1){
						if(err){
							res.json({status: false, message: err});
						}
						if(!result1){
							result.email = req.body.email;
							result.phone = req.body.phone;
							result.name.first = req.body.first;
							result.name.last = req.body.last;
							result.address = req.body.address;
							result.save(function(err, result2){
								if(err){
									res.json({status: false, message: err});
								}else{
									res.json({status: true, message: 'Update profile infomation success'});
								}
							})
						}else{
							res.json({status: false, message: 'Email or phone number have already exists !'});
						}
					})
				}
			}
		})
	},

	upload: function(req, res){
		var id = req.user._id;
		User.findOne({_id:id}, function(err, result){
			if(err) throw err;
			result.avatar = req.files[0].path;
			result.save(function(err, result1){
				if(err){
					res.json({status: false,data:[], message:err});
				}else{
					res.json({status: true,data: result1, message:'Upload avatar success'})
				}
			})
		})
	},

	updatepass: function(req, res){
		var id = req.params.id;
		User.findOne({_id:id}, function(err, result){
			if(err){
				res.json({status: false,data:[], message:err});
			}else{
				var oldpass = result.password;
				if(bcrypt.compareSync(req.body.current, oldpass)){
					result.password = bcrypt.hashSync(req.body.new, bcrypt.genSaltSync(5));
					result.save(function(err, result1){
						if(err){
							res.json({status: false,data:[], message:err});
						}else{
							res.json({status: true,data: result1, message:'Your password have been changed success'})
						}
					})
				}else{
					res.json({status: false,data: [], message:'Your current password wrong'});
				}
			}
		})
	}

}

module.exports = UserController;