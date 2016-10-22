var event = require('events');
var multer  = require('multer');

var FileController = {

	upload: function(req, res) {
		var eventEmiter = new events.EventEmitter();
		// Upload process.
		console.log(req.body);
		// Done process
		eventEmiter.emit('upload_success', {file: file});
	}
};

module.exports = FileController;