angular.module('SteedOfficeApp').controller('TeamModalController', function($http, $rootScope, $scope, $state, $modalInstance, team, ToastFactory){

	$scope.team = team;

	$scope.display = false;

	$scope.alluser = function(){
		$http.get('/api/user').success(function(response){
			if(response.status){
				var memArr = [];
				memArr.push(team.owner);
				for(var i=0;i<team.members.length;i++){
					memArr.push(team.members[i]);
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
    }

	$scope.cancel = function(){
		$modalInstance.dismiss();
	};

	$scope.ok = function(){
		$modalInstance.close('Hello World');
	};

})