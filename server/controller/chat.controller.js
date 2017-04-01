'use strict';

var PrivateMessage = require('../model/chat-private.model');
var GroupMessage = require('../model/chat-group.model');
var RecentMessage = require('../model/chat-recent.model');
var limit = 10;

module.exports.getMessagePrivate = function(req, res) {
    var send_id = req.auth._id;
    var receive_id = req.params.user_receive_id;

    PrivateMessage.find({
        $and: [
            { $or: [{ user_send_id: send_id }, { user_send_id: receive_id }] },
            { $or: [{ user_receive_id: send_id }, { user_receive_id: receive_id }] }
        ]
    }).limit(limit).sort({ date: -1 }).exec(function(err, results) {
        if (err) {
            res.json({status:false,message:'SOMETHING_WENT_WRONG'});
        } else {
            res.json({
                status: true,
                data: results
            });
        }
    });
};

/**
 * [getMessagePrivate load more private message]
 * @return {[array]}     [list messages]
 */
module.exports.getMoreMessagePrivate = function(req, res) {
    var send_id = req.auth._id;
    var receive_id = req.params.user_receive_id;
    var skip = parseInt(req.params.skip);
    PrivateMessage.find({
        $and: [
            { $or: [{ user_send_id: send_id }, { user_send_id: receive_id }] },
            { $or: [{ user_receive_id: send_id }, { user_receive_id: receive_id }] }
        ]
    }).limit(limit).skip(skip).sort({ date: -1 }).exec(function(err, results) {
        if (err) {
            res.json({status:false,message:'SOMETHING_WENT_WRONG'});
        } else {
            res.json({
                status: true,
                data: results
            });
        }
    });
};

/**
 * [getUnreadMessageCount get count of unread message for this user]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[array]}     [list recent message]
 */
module.exports.getUnreadMessageCount = function(req, res) {
    RecentMessage.find({ $or: [{ user_send_id: req.auth._id }, { user_receive_id: req.auth._id }], read: false }).exec(function(err, results) {
        if (err) {
            res.json({
                status: false,
                message:'SOMETHING_WENT_WRONG'
            });
        } else {
            res.json({
                status: true,
                data: results
            });
        }
    });
};


/**
 * [getRecentMessage get recent message for user]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[array]}     [list recent message (limit 5)]
 */
module.exports.getRecentMessage = function(req, res) {
    RecentMessage.find({ $or: [{ user_send_id: req.auth._id }, { user_receive_id: req.auth._id }] }).limit(5).sort({ date: -1 }).exec(function(err, results) {
        if (err) {
            res.json({
                status: false,
                message:'SOMETHING_WENT_WRONG'
            });
        } else {
            res.json({
                status: true,
                data: results
            });
        }
    });
};


/**
 * [putReadMessage change status message to read]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[object]}     [with status + message]
 */
module.exports.putReadMessage = function(req, res) {
    var send_id = req.params.user_send_id;
    var receive_id = req.params.user_receive_id;
    RecentMessage.findOne({
        $and: [
            { $or: [{ user_send_id: send_id }, { user_send_id: receive_id }] },
            { $or: [{ user_receive_id: send_id }, { user_receive_id: receive_id }] }
        ]
    }, function(err, recentMessage) {
        if (recentMessage) {
            recentMessage.read = true;
            recentMessage.total_message = 0;
            recentMessage.save(function(err, result) {
                if (err) {
                    res.json({
                        status: false,
                        message:'SOMETHING_WENT_WRONG'
                    });
                } else {
                    res.json({
                        status: true,
                        message: 'Success'
                    });
                }
            });
        } else {
            res.json({ status: false });
        }
    });
};

/**
 * [postCreateGroupChat create new group chat]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[object]}     [status + group]
 */
module.exports.postCreateGroupChat = function(req, res) {
    var group = new GroupMessage(req.body);
    group.save(function(err, result) {
        if (err) {
            res.json({ status: false,message:'SOMETHING_WENT_WRONG' });
        } else {
            res.json({ status: true, result: result });
        }
    });
};

/**
 * [putUpdateGroupName change name of this group]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
module.exports.putUpdateGroupName = function(req, res) {
    GroupMessage.findOne({ _id : req.params.group_id},function(err,group){
        group.name = req.body.name;
        group.save(function(err, result) {
        if (err) {
          res.json({ status: false,message:'SOMETHING_WENT_WRONG' });
        } else {
          res.json({ status: true, result: result, message:'' });
        }
      });
    });
};

/**
 * [putUpdateGroupUser add new user to group chat]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
module.exports.putUpdateGroupUser = function(req, res) {
    GroupMessage.findOne({ _id : req.params.group_id},function(err,group){
        group.users.push(req.body._id);
        group.save(function(err, result) {
        if (err) {
          res.json({ status: false, message:'SOMETHING_WENT_WRONG'});
        } else {
          res.json({ status: true, result: result, message:''});
        }
      });
    });
};

/**
 * [getListGroupChat get all group chat for this user]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
module.exports.getListGroupChat = function(req, res) {
    GroupMessage.find({ users: { $in: [req.auth._id] } }, { name: 1, users: 1, group_id: 1 }, function(err, result) {
        if (err) {
            res.json({ status: false, result: err, message:'SOMETHING_WENT_WRONG' });
        } else {
            res.json({ status: true, result: result });
        }
    });
};


/**
 * [getDetailGroupChat get detail group chat]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[array]}     [messsages]
 */
module.exports.getDetailGroupChat = function(req, res) {
    GroupMessage.aggregate([
        {
            $match: { group_id: req.params.group_id}
        },
        { $unwind: "$messages"},
        { $sort: { "messages.date": -1 } },
        { $limit: 10 },
    ],function(err,results){
        if(err){
            res.json({ status: false, results: err, message:'SOMETHING_WENT_WRONG' });
        }else{
            res.json({status:true,results:results});
        }
    });
};


/**
 * [getMoreGroupMessage load more message in group]
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[array]}     [list messsages]
 */
module.exports.getMoreGroupMessage = function(req,res){
  var skip = parseInt(req.params.skip);
  GroupMessage.aggregate([
        {
            $match: { group_id: req.params.group_id}
        },
        { $unwind: "$messages"},
        { $sort: { "messages.date": -1 } },
        { $skip: skip },
        { $limit: 10 },
    ],function(err,results){
        if(err){
            res.json({ status: false, results: err, message:'SOMETHING_WENT_WRONG' });
        }else{
            res.json({status:true,results:results});
        }
    });
};