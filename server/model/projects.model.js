var mongoose = require('mongoose');
var integerValidator = require('mongoose-integer');

var ProjectSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: String,
	team_id: {type: mongoose.Schema.Types.ObjectId, ref:'Team'},
	status: {type: Number, integer: true, default:0},
	start_date: Date,
	due_date: Date,
	created_at: {type:Date, default: Date.now},
	updated_at: {type:Date, default: Date.now},
	created_by: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
	updated_by: {type: mongoose.Schema.Types.ObjectId}
})

ProjectSchema.plugin(integerValidator);
module.exports = mongoose.model('Project', ProjectSchema);

