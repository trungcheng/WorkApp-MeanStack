var events = require('events');
var multer  = require('multer');
var Task = require('../model/tasks.model');

var FileController = {

	index: function(req, res) {
		// var eventEmiter = new events.EventEmitter();
		// Upload process.
		Task.findOne({_id:req.params.task_id}, function (err, result){
			result.file_attachs.push({
				name: req.files[0].originalname,
				path: req.files[0].path
			});
			result.save(function (err, attach){
				res.json({status: true, data:attach.file_attachs[attach.file_attachs.length-1], message:'Attach files success'});
			})
		})
		// Done process
		// eventEmiter.('upload_success', {file: req.files, task_id:req.params.task_id});
	}
};

module.exports = FileController;