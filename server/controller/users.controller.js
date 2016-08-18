var User = require('../model/users.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var rand = Math.floor((Math.random() * 100) + 54);

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
				req.checkBody('phone','format phone number wrong').isMobilePhone('vi-VN');
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

							console.log(result.phone);

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
						        subject : "Please confirm your Email account",
						        html : "Hello <strong>"+result.name.first+" "+result.name.last+"</strong>,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify account</a>"
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
				res.json({status: false, message: 'Authen failed, user not found'});
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
					res.json({status: false, data:{}, message: 'Email or password wrong.'})
				}
			}
		})
	}

}

module.exports = UserController;