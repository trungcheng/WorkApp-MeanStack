angular.module('workApp').controller('TaskModalController', function($http, $window, $rootScope, $scope, $state, $stateParams, $modalInstance, task, ToastFactory, FileUploader){

	$scope.task = task;

	$scope.avatarNum = 3;

	$scope.display = false;

	$scope.displayTaskName1 = function(task){
        task.isEditName1 = true;
        task.newName1 = angular.copy(task.name);
    }

    $scope.cancelEditName1 = function(task){
        task.isEditName1 = false;
    }

    $scope.saveTaskName1 = function(task){
        $http.put('/api/thistask/name/'+task._id, {name:task.newName1}).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                task.isEditName1 = false;
                task.name = response.data.name;
            }
        })
    }

    $scope.displayTaskDesc1 = function(task){
        task.isEditDesc1 = true;
        task.newDesc1 = angular.copy(task.description);
    }

    $scope.cancelEditDesc1 = function(task){
        task.isEditDesc1 = false;
    }

    $scope.saveTaskDesc1 = function(task){
        $http.put('/api/thistask/desc/'+task._id, {desc:task.newDesc1}).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                task.isEditDesc1 = false;
                task.description = response.data.description;
            }
        })
    }

    $scope.displayEditMem1 = function(task){
        task.displayMem1 = true;
    }

    $scope.rollBackMem1 = function(task){
        task.displayMem1 = false;
    }

    $scope.filterMem = function(task){
    	$http.get('/api/task/project-detail/'+$stateParams.id).success(function(response){
            if(response.status){
                $scope.members = response.data;
                $scope.memFilters = (function (){
		            var memArrId = {};
		            var allUserId = {};
		            var result = [];

		            task.assign_to.forEach(function(el, i){
		              memArrId[el._id] = task.assign_to[i];
		            });

		            $scope.members.forEach(function(el, i){
		              allUserId[el._id] = $scope.members[i];
		            });

		            for(var i in allUserId){
		                if(!memArrId.hasOwnProperty(i)){
		                    result.push(allUserId[i]);
		                }
		            }
		            return result;
		        }());
            }
        })
    }

    $scope.saveMem1 = function(task){
        $http.post('/api/task/addMem/'+task._id,{selectedMember:task.selectedMember}).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                $modalInstance.dismiss();
                $state.reload();
            }else{
                ToastFactory.popErrors(response.message);
            }
        })
    }

    $scope.removeMem = function(task, mem, index){
        $http.delete('/api/task/removeMem/'+task._id+'/'+mem._id).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                task.assign_to.splice(index,1);
            }
        })
    }

    $scope.displayEditStart = function(task){
    	task.isEditStart = true;
    	$scope.task.newStart = angular.copy($scope.task.start_date);
    }

    $scope.cancelEditStart = function(task){
    	task.isEditStart = false;
    }

    $scope.saveStart = function(task){
		$http.put('/api/thistask/startdate/'+task._id, $scope.task).success(function(response){
			if(response.status){
				ToastFactory.popSuccess(response.message);
				task.isEditStart = false;
				task.start_date = response.data.start_date;
			}
		})
	}

    $scope.displayEditDue = function(task){
    	task.isEditDue = true;
    }

    $scope.cancelEditDue = function(task){
    	task.isEditDue = false;
    }

    $scope.saveDue = function(task){
		$http.put('/api/thistask/duedate/'+task._id, $scope.task).success(function(response){
			if(response.status){
				ToastFactory.popSuccess(response.message);
				task.isEditDue = false;
				task.due_date = response.data.due_date;
			}
		})
	}

    $scope.cancel = function(){
		$modalInstance.dismiss();
	};

	$scope.ok = function(){
		$modalInstance.close();
	};

	$scope.openstart = function() {
	   	$scope.start.opened = true;
	};

	$scope.opendue = function() {
	   	$scope.due.opened = true;
	};

	$scope.dateOptions = {
	    formatYear: 'yyyy',
	    formatDate: 'dd',
	    formatMonth: 'MM',
	    startingDay: 1
	};

	$scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[2];

	$scope.start = {
	    opened: false
	};

	$scope.due = {
	    opened: false
	};

	$scope.allCheckList = function(){
		$http.get('/api/task/checklists/'+$scope.task._id).success(function(response){
			$scope.checklists = response.data;
		})
		$http.get('/api/project-detail/'+$stateParams.id).success(function(response){
	        if(response.status){
	            if($rootScope.rootAuth._id == response.data.created_by){
	                $scope.display = true;
	            }else{
	                $scope.display = false;
	            }
	        }
	    })
		if($scope.task.status == 0){
			$scope.channel = 'In progress';
		}else{
			$scope.channel = 'Resolved';
		}
		$http.get('/api/user/userdetail').success(function(response){
			$scope.userRoot = response.data;
		})
	}

	$scope.addCheckList = function(task){
		$http.post('/api/task/checklist/'+task._id, {name:$scope.checkList.name}).success(function(response){
			if(response.status){
				ToastFactory.popSuccess(response.message);
				$scope.checklists.unshift(response.data);
				$scope.checkList.name = '';
			}
		})
	}

	$scope.removeCheckList = function(item, index){
		$http.delete('/api/task/removeCheckList/'+item._id).success(function(response){
			if(response.status){
				ToastFactory.popSuccess(response.message);
				$scope.checklists.splice(index, 1);
			}else{
				ToastFactory.popErrors(response.message);
			}
		})
	}

	$scope.addTodo = function(task, item){
		$http.post('/api/task/checklist/addTodo/'+item._id, {name:item.todo}).success(function(response){
			if(response.status){
				ToastFactory.popSuccess(response.message);
				item.items.push(response.data.item);
				task.checklist_count = response.data.task.checklist_count;
				item.todo = '';
			}
		})
	}

	$scope.removeTodo = function(task, item, todo, index){
		$http.delete('/api/task/checklist/removeTodo/'+task._id+'/'+item._id+'/'+todo._id).success(function(response){
			if(response.status){
				ToastFactory.popSuccess(response.message);
				item.items.splice(index, 1);
				task.checklist_count = response.data.checklist_count;
			}
		})
	}

	$scope.checkStatusTodo = function(task,todo){
		if(todo.complete){
			$http.put('/api/task/checklist/completeTodo/'+task._id+'/'+todo._id).success(function(response){
				if(response.status){
					ToastFactory.popSuccess(response.message);
					task.checklist_count = response.data.checklist_count;
				}
			})
		}else{
			$http.put('/api/task/checklist/unCompleteTodo/'+task._id+'/'+todo._id).success(function(response){
				if(response.status){
					ToastFactory.popSuccess(response.message);
					task.checklist_count = response.data.checklist_count;
				}
			})
		}
	}

	$scope.addcomment = function(task){
		$http.post('/api/task/addcomment/'+task._id, {txtcomment:task.txtcomment}).success(function(response){
			if(response.status){
				$scope.task.comments = response.data.comments;
				task.txtcomment = '';
			}
		})
	}

	$scope.removeItem = function(task, comment, index){
		console.log(comment);
		$http.delete('/api/task/removecomment/'+task._id, {cmt:comment}).success(function(response){
			if(response.status){
				$scope.task.comments.splice(index,1);
			}
		})
	}

    var uploader = $scope.uploader = new FileUploader({
        url: '/api/task/attachments/'+ $scope.task._id + '?token=' + $rootScope.rootAuthToken
    });
    // FILTERS
    uploader.filters.push(
    {
        name: 'customFilter',
        fn: function(item, options)
        {
            return this.queue.length < 10;
        }
    });

    console.info('uploader', uploader);

})