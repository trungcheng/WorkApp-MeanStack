angular.module('SteedOfficeApp').controller('TaskController', function($http, $rootScope, $scope, $uibModal, $log, $state, $stateParams, $timeout, ToastFactory){

    $scope.tasks = {};

    $scope.task = {};

    $scope.avatarNum = 3;

    $scope.display = false;

    $http.get('/api/project-detail/'+$stateParams.id).success(function(response){
        if(response.status){
            if($rootScope.rootAuth._id == response.data.created_by){
                $scope.display = true;
            }else{
                $scope.display = false;
            }
        }
    })

    $scope.displayTaskName = function(task){
        task.isEditName = true;
        task.newName = angular.copy(task.name);
    }

    $scope.cancelEditName = function(task){
        task.isEditName = false;
    }

    $scope.saveTaskName = function(task){
        $http.put('/api/thistask/name/'+task._id, {name:task.newName}).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                task.isEditName = false;
                task.name = response.data.name;
            }
        })
    }

    $scope.displayTaskDesc = function(task){
        task.isEditDesc = true;
        task.newDesc = angular.copy(task.description);
    }

    $scope.cancelEditDesc = function(task){
        task.isEditDesc = false;
    }

    $scope.saveTaskDesc = function(task){
        $http.put('/api/thistask/desc/'+task._id, {desc:task.newDesc}).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                task.isEditDesc = false;
                task.description = response.data.description;
            }
        })
    }

    $scope.displayEditMem = function(task){
        task.displayMem = true;
    }

    $scope.rollBackMem = function(task){
        task.displayMem = false;
    }

    $scope.allmems = function(){
        $http.get('/api/task/project-detail/'+$stateParams.id).success(function(response){
            if(response.status){
                $scope.members = response.data;
            }
        })
    }

    $scope.filterMem = function(task){
        $scope.allmems();
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

    $scope.removeMem = function(task, mem, index){
        $http.delete('/api/task/removeMem/'+task._id+'/'+mem._id).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                task.assign_to.splice(index,1);
            }
        })
    }

    $scope.open = function (task) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/client/views/projects/modal-task.html',
            controller: 'TaskModalController',
            size: 'lg',
            resolve: {
                task: function() {
                  return task;
                }
            }
        });

        modalInstance.result.then(function (result) {
            console.log(result);
        }, function () {
           
        });
    };

    $scope.add = function(){
        $scope.task.project_id = $stateParams.id;
        $http({
            method: 'POST',
            url: '/api/task',
            data: $scope.task
        }).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                $state.reload();
            }else{
                ToastFactory.popErrors(response.message);
            }
        })
    }

    $scope.saveMem = function(task){
        $http.post('/api/task/addMem/'+task._id,{selectedMember:task.selectedMember}).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                $state.reload();
            }else{
                ToastFactory.popErrors(response.message);
            }
        })
    }

    $scope.alltask = function(){
        $http.get('/api/tasks/'+$stateParams.id).success(function(response){
            if(response.status){
                $scope.tasks = response.data;
            }
        })
    }

    $scope.low = function(lid){
        $http.put('/api/task/priority-low/'+ lid).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                $state.reload();
            }
        })
    }

    $scope.normal = function(nid){
        $http.put('/api/task/priority-normal/'+ nid).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                $state.reload();
            }
        })
    }

    $scope.highest = function(hid){
        $http.put('/api/task/priority-highest/'+ hid).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                $state.reload();
            }
        })
    }

    $scope.resolved = function(task){
        $http.put('/api/task/status-resolved/'+ task._id).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                $state.reload();
            }
        })
    }

    $scope.progress = function(task){
        $http.put('/api/task/status-inprogress/'+ task._id).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                $state.reload();
            }
        })
    }

    $scope.removeTask = function(id, index){
        $http.delete('/api/task/'+id).success(function(response){
            if(response.status){
                $scope.tasks.splice(index,1);
            }
        })
    }

});