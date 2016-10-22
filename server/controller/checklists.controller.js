var CheckList = require('../model/checklist.model');
var Task = require('../model/tasks.model');
var mongoose = require('mongoose');


var ChecklistController = {

	index: function(req, res){
        req.checkParams('task_id', 'PARAMS_IS_NOT_EMPTY').notEmpty();
        req.checkParams('task_id', 'MONGO_ID_FORMAT_INVALID').isMongoId();
        var errors = req.validationErrors();
        if (errors) {
            res.json({status: false, message:'Validate failed'});
        } else {
            CheckList.find({task_id: req.params.task_id }).sort({created_at: -1}).exec(function(err, result){
                if(err) {
                    throw err;
                }else{
                    res.json({status: true, data:result, message:'Get all checklist success'});
                };
            });
        };
    },

    addCheckList: function(req, res){
    	req.checkParams('task_id', 'PARAMS_IS_NOT_EMPTY').notEmpty();
        req.checkParams('task_id', 'MONGO_ID_FORMAT_INVALID').isMongoId();
        req.checkBody('name', 'REQUIRED').notEmpty();
        req.checkBody('name', 'REQUIRED').isLength({
            max: 100
        });
        var errors = req.validationErrors();
        if (errors) {
            res.json({status: false, message:'Validate failed'});
        } else {
            var data = {
                name: req.body.name,
                task_id: new mongoose.Types.ObjectId(req.params.task_id),
                created_at: Date.now(),
                created_by: new mongoose.Types.ObjectId(req.user._id),
                updated_by: new mongoose.Types.ObjectId(req.user._id)
            };
            var checklist = new CheckList(data);
            checklist.save(function(err, saveResult) {
                if (err) {
                    throw err;
                } else {
                    res.json({status: true, data: saveResult, message:'Add checklist success'});
                };
            });
        };
    },

    addTodo: function(req, res){
		req.checkParams('checklist_id', 'PARAMS_IS_NOT_EMPTY').notEmpty();
        req.checkParams('checklist_id', 'MONGO_ID_FORMAT_INVALID').isMongoId();
        req.checkBody('name', 'REQUIRED').notEmpty();
        req.checkBody('name', 'NAME_LENGTH_ERROR').isLength({
            max: 90
        });
        var errors = req.validationErrors();
        if (errors) {
            res.json({status: false, message:'Validate failed'});
        } else {
        	CheckList.findOne({ _id: new mongoose.Types.ObjectId(req.params.checklist_id) }, function(err, checklist){
        		checklist.items.push({ name: req.body.name, complete: false });
                checklist.save(function(err, checklistSaveResult){
                	if(err) throw err;
                	Task.findOne({_id:checklistSaveResult.task_id}, function(err, task){
                		task.checklist_count.total += 1;
                		task.save(function(err, taskSaveResult) {
                			if(err) throw err;
                			res.json({status: true, data:{task:taskSaveResult,item:checklistSaveResult.items[checklistSaveResult.items.length - 1]}, message:'Add todo success'});
                		})
                	})
                })
        	})
        }
	},

	completeTodo: function(req, res){
		req.checkParams('task_id', 'PARAMS_IS_NOT_EMPTY').notEmpty();
        req.checkParams('task_id', 'MONGO_ID_FORMAT_INVALID').isMongoId();
        req.checkParams('item_id', 'PARAMS_IS_NOT_EMPTY').notEmpty();
        req.checkParams('item_id', 'MONGO_ID_FORMAT_INVALID').isMongoId();
        var errors = req.validationErrors();
        if(errors){
            res.json({status:false, message:'Validate failed'});
        }else{
        	CheckList.findOneAndUpdate(
        		{'items._id': req.params.item_id, 'items.complete': false},
        		{
        			$set:{
        				'items.$.complete': true
        			}
        		}, function(err, result){
        			if(err){
        				throw err;
        			}else if(result){
        				Task.findOne({_id:req.params.task_id}, function(err, task){
                			if(err) throw err;
                			task.checklist_count.done += 1;
                            task.save(function(err, taskSaveResult) {
                            	if(err){
                            		throw err;
                            	}else{
                            		res.json({status: true,data: taskSaveResult, message:'Complete todo success'})
                            	}
                            })
                		})
        			}else{
        				res.json({status: false, message:'Something wrong'});
        			}
        		}
        	)
        }
	},

	unCompleteTodo: function(req, res){
		req.checkParams('task_id', 'PARAMS_IS_NOT_EMPTY').notEmpty();
        req.checkParams('task_id', 'MONGO_ID_FORMAT_INVALID').isMongoId();
        req.checkParams('item_id', 'PARAMS_IS_NOT_EMPTY').notEmpty();
        req.checkParams('item_id', 'MONGO_ID_FORMAT_INVALID').isMongoId();
        var errors = req.validationErrors();
        if(errors){
            res.json({status:false, message:'Validate failed'});
        }else{
        	CheckList.findOneAndUpdate(
        		{'items._id': req.params.item_id, 'items.complete': true},
        		{
        			$set:{
        				'items.$.complete': false
        			}
        		}, function(err, result){
        			if(err){
        				throw err;
        			}else if(result){
        				Task.findOne({_id:req.params.task_id}, function(err, task){
                			if(err) throw err;
                			task.checklist_count.done -= 1;
                            task.save(function(err, taskSaveResult) {
                            	if(err){
                            		throw err;
                            	}else{
                            		res.json({status: true,data: taskSaveResult, message:'Uncomplete todo success'})
                            	}
                            })
                		})
        			}else{
        				res.json({status: false, message:'Something wrong'});
        			}
        		}
        	)
        }
	},

	destroyTodo: function(req, res){
		req.checkParams('task_id', 'PARAMS_IS_NOT_EMPTY').notEmpty();
        req.checkParams('task_id', 'MONGO_ID_FORMAT_INVALID').isMongoId();
		req.checkParams('checklist_id', 'PARAMS_IS_NOT_EMPTY').notEmpty();
        req.checkParams('checklist_id', 'MONGO_ID_FORMAT_INVALID').isMongoId();
        req.checkParams('item_id', 'PARAMS_IS_NOT_EMPTY').notEmpty();
        req.checkParams('item_id', 'MONGO_ID_FORMAT_INVALID').isMongoId();
        var errors = req.validationErrors();
        if(errors){
        	res.json({status: false, message:'Validate failed'});
        }else{
        	CheckList.find(
        		{'items._id': new mongoose.Types.ObjectId(req.params.item_id)},
        		{'items.$': 1, _id: 0 },function(err, checklist) {
        			var item = checklist[0].items[0];
        			CheckList.findOneAndUpdate({ _id: req.params.checklist_id }, {
        				$pull: {
                            'items': {
                                '_id': req.params.item_id
                            }
                        }
                    }, function(err, result) {
                    	if(err){
                    		throw err;
                    	}else if(result){
                    		Task.findOne({_id:req.params.task_id}, function(err, task){
                    			if(err) throw err;
                    			task.checklist_count.total -= 1;
                    			if (item.complete) {
	                                task.checklist_count.done -= 1;
	                            }
	                            task.save(function(err, taskSaveResult) {
	                            	if(err){
	                            		throw err;
	                            	}else{
	                            		res.json({status: true,data:taskSaveResult, message:'Delete todo success'})
	                            	}
	                            })
                    		})
                    	}else{
                    		res.json({status: false, message:'Something wrong'});
                    	}
                    })
        	})
        }
	},

    destroy: function(req, res) {
        req.checkParams('checklist_id', 'PARAMS_IS_NOT_EMPTY').notEmpty();
        req.checkParams('checklist_id', 'MONGO_ID_FORMAT_INVALID').isMongoId();
        var errors = req.validationErrors();
        if (errors) {
            res.json({status: false, message:'Validate failed'});
        } else {
            CheckList.findOne({ _id: req.params.checklist_id }, function(err, checklist) {
                if (err) {
                    throw err;
                } else if (checklist) {
                    if (checklist.items.length > 0) {
                        res.json({status: false, message:'Please clear all items before remove this checklist'});
                    } else {
                        CheckList.findOneAndRemove({ _id: req.params.checklist_id }, function(err) {
                            if (err) {
                                throw err;
                            } else {
                                res.json({status: true, message:'Remove checklist success'});
                            };
                        });
                    };
                } else {
                    res.json({status: false, data:[], message:'Data not found'});
                };
            });
        };
    },

}

module.exports = ChecklistController;