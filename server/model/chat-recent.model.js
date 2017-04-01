var mongoose = require('mongoose');

module.exports = mongoose.model('Recent_Message',{
  user_send_id: {type: String, index:true},
  user_receive_id: {type: String, index:true},
  read:{type:Boolean},
  last_message:{type: String},
  date:{type: Date, default: Date.now},
  total_message:{type:Number}
});