var mongoose = require('mongoose');

module.exports = mongoose.model('Group_Message',{
  name:String,
  group_id:String,
  users:[],
  messages:[{
    user_send_id:{type:String,index:true},
    message: String,
    type: { type: String, default: 'text' },
    date: { type: Date, default: Date.now }
  }]

});