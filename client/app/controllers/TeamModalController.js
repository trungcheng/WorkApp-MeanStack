angular.module('workApp').controller('TeamModalController', function($http, $rootScope, $scope, $state, $modalInstance, team, ToastFactory){

	$scope.team = team;

	$scope.display = false;

	$scope.teamName = true;

	$scope.teamDesc = true;

	$scope.displayTeamName = function(){
		$scope.teamName = false;
		$scope.team.newName = angular.copy($scope.team.name);
	}

	$scope.cancelEditName = function(){
		$scope.teamName = true;
	}

	$scope.saveTeamName = function(){
		$http.put('/api/thisteam/name/'+team._id, $scope.team).success(function(response){
			if(response.status){
				ToastFactory.popSuccess(response.message);
				$scope.teamName = true;
				team.name = response.data.name;
			}
		})
	}

	$scope.displayTeamDesc = function(){
		$scope.teamDesc = false;
		$scope.team.newDesc = angular.copy($scope.team.description);
	}

	$scope.cancelEditDesc = function(){
		$scope.teamDesc = true;
	}

	$scope.saveTeamDesc = function(){
		$http.put('/api/thisteam/desc/'+team._id, $scope.team).success(function(response){
			if(response.status){
				ToastFactory.popSuccess(response.message);
				$scope.teamDesc = true;
				team.description = response.data.description;
			}
		})
	}

	$scope.alluser = function(){
		$http.get('/api/user').success(function(response){
			if(response.status){
				var memArr = [];
				memArr.push(team.owner);
				for(var i=0;i<team.members.length;i++){
					memArr.push(team.members[i]);
				}
				for(var j=0;j<team.members_processing.length;j++){
					memArr.push(team.members_processing[j]);
				}

				if(team.owner._id == $rootScope.rootAuth._id){
					$scope.members = (function (){
				        var memArrId = {};
				        var allUserId = {};
				        var result = [];

				        memArr.forEach(function(el, i){
				          memArrId[el._id] = memArr[i];
				        });

				        response.data.forEach(function(el, i){
				          allUserId[el._id] = response.data[i];
				        });

				        for(var i in allUserId){
				            if(!memArrId.hasOwnProperty(i)){
				                result.push(allUserId[i]);
				            }
				        }
				        return result;
				    }());
					$scope.display = true;
				}else{
					$scope.members = [];
					$scope.display = false;
				}
			}
		})
	}

    $scope.add = function(){
        $http({
            method: 'POST',
            url: '/api/thisteam/' + team._id,
            data: $scope.team
        }).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                $state.reload();
            }else{
                ToastFactory.popErrors(response.message);
            }
        })
    };

    $scope.removeMem = function(member){
    	$http({
    		method: 'DELETE',
    		url: '/api/thisteam/remove/'+team._id+'/'+member._id,
    	}).success(function(response){
    		if(response.status){
    			team.members.splice(team.members.indexOf(member),1);
    			ToastFactory.popSuccess(response.message);
    		}
    	})
    };

    $scope.removeTeam = function(){
    	$http.delete('/api/team/'+team._id).success(function(response){
    		if(response.status){
    			ToastFactory.popSuccess(response.message);
    			$modalInstance.dismiss();
    			$state.reload();
    		}
    	})
    }

	$scope.cancel = function(){
		$modalInstance.dismiss();
	};

	$scope.ok = function(){
		$modalInstance.close('Hello World');
	};

})