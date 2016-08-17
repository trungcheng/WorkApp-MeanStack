var mongoose = require('mongoose');
var integerValidator = require('mongoose-integer');

var TaskSchema = new mongoose.Schema({
	name: {type: String, required: true},
	content: String,
	description: String,
	assign_to: {type: mongoose.Schema.Types.ObjectId},
	project_id: {type: mongoose.Schema.Types.ObjectId},
	comments: {type: Array},
	file_attachs: {type: Array},
	checklist: {type: Array},
	status: {type: Number, integer: true},
	start_date: {type: Date, default: Date.now},
	due_date: {type: Date, default: Date.now},
	created_at: {type:Date, default: Date.now},
	updated_at: {type:Date, default: Date.now},
	created_by: {type: mongoose.Schema.Types.ObjectId},
	updated_by: {type: mongoose.Schema.Types.ObjectId}
})

TaskSchema.plugin(integerValidator);
module.exports = mongoose.model('Task', TaskSchema);