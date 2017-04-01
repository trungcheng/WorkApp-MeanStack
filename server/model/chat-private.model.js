var mongoose = require('mongoose');

module.exports = mongoose.model('Private_Message',{
  user_send_id: {type: String, index:true},
  user_receive_id: {type: String, index:true},
  message: String,
  type: { type: String, default: 'text' },
  date: { type: Date, default: Date.now }
});