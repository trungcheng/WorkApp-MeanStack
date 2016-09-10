angular.module('SteedOfficeApp').controller('TeamModalController', function($http, $rootScope, $scope, $state, $modalInstance, team, ToastFactory){

	$scope.team = team;

	$scope.stt = 1;

	$scope.display = false;

	$scope.alluser = function(){
		var memberArr = [];
		$http.get('/api/user').success(function(response){
			if(response.status){
				for (var i=0; i<response.data.length;i++){
					for (var j=0; j<team.members.length;j++){
						if(response.data[i]._id == team.members[j]._id){
							memberArr.push(response.data[i]);
							for (var k=0;k<memberArr.length;k++){
								response.data.splice(response.data.indexOf(memberArr[k]),1);
								for (var m=0; m< response.data.length;m++){
									if(response.data[m].id = team.owner._id){
										response.data.splice(response.data[m],1);
										$scope.members = response.data;
									}
								}
								if(team.owner._id == $rootScope.rootAuth._id){
									$scope.display = true;
								}else{
									$scope.display = false;
								}
							}
						}else{
							$scope.members = [];
							$scope.display = false;
						}
					}
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