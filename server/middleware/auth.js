'use strict';

var jwt = require('jsonwebtoken');

var Middleware = {

	handle: function(req, res, next){
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		if(token){
			jwt.verify(token, 'trungcheng', function(err, decoded){
				if(err){
					res.status(401).json({status:false, data:{}, message:err });
				}else{
					req.user = decoded._doc;
					next();
				}
			})
		}else{
			res.status(401).json({status:false, data:{}, message:'Token not provider'});
		}
	}
}

module.exports = Middleware;