var mongoose = require('mongoose');

module.exports = mongoose.model('Task_Checklist', {
   	name: String,
   	task_id: { type: mongoose.Schema.Types.ObjectId, index: true },
   	items: [{
       	name: String,
       	complete: {
           type: Boolean,
           default: false
       	}
   	}],
   	created_at: {
       	type: Date,
   	},
   	updated_at: {
       	type: Date,
       	default: Date.now
   	},
   	created_by: {
       	type: mongoose.Schema.Types.ObjectId,
       	index: true
   	},
   	updated_by: {
       	type: mongoose.Schema.Types.ObjectId,
       	index: true
   	}
});
