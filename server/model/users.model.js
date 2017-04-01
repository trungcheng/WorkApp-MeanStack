var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
	name:{
		first: {type: String, required: true},
		last: {type: String, required: true}
	},
	email: {type: String, unique: true, required: true},
	phone: String,
	address: String,
	avatar: {type: String, default: null},
	password: {type: String, required: true},
	teams: [],
	active: {type: Boolean, default: false},
	created_at: {type:Date, default: Date.now},
	updated_at: {type:Date, default: Date.now},
	created_by: {type: mongoose.Schema.Types.ObjectId},
	updated_by: {type: mongoose.Schema.Types.ObjectId}
});

