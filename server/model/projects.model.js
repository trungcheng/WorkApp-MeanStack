var mongoose = require('mongoose');
var integerValidator = require('mongoose-integer');

var ProjectSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: String,
	team_id: {type: mongoose.Schema.Types.ObjectId},
	status: {type: Number, integer: true},
	start_date: {type: Date, default: Date.now},
	due_date: {type: Date, default: Date.now},
	created_at: {type:Date, default: Date.now},
	updated_at: {type:Date, default: Date.now},
	created_by: {type: mongoose.Schema.Types.ObjectId},
	updated_by: {type: mongoose.Schema.Types.ObjectId}
})

ProjectSchema.plugin(integerValidator);
module.exports = mongoose.model('Project', ProjectSchema);

