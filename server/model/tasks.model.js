var mongoose = require('mongoose');
var integerValidator = require('mongoose-integer');

var TaskSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: String,
	assign_to: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
	project_id: {type: mongoose.Schema.Types.ObjectId, ref:'Project'},
	comments: [
		{
			user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
			content: String
		}
	],
	file_attachs: {type: Array},
	checklist_count: {
		done: {type: Number, integer: true, default:0},
		total: {type: Number, integer: true, default:0},
	},
	priority: {type: Number, integer: true, default:0},
	status: {type: Number, integer: true, default:0},
	start_date: {type:Date, default: null},
	due_date: {type:Date, default: null},
	created_at: {type:Date, default: Date.now},
	updated_at: {type:Date, default: Date.now},
	created_by: {type: mongoose.Schema.Types.ObjectId},
	updated_by: {type: mongoose.Schema.Types.ObjectId}
})

TaskSchema.plugin(integerValidator);
module.exports = mongoose.model('Task', TaskSchema);