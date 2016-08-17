var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
	from: {type: mongoose.Schema.Types.ObjectId},
	project_id: {type: mongoose.Schema.Types.ObjectId},
	message: String,
	time: Date
})

module.exports = mongoose.model('Chat', ChatSchema);