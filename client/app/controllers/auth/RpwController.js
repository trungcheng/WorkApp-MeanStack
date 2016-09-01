angular.module('SteedOfficeApp').controller('RpwController', function($http, $rootScope, $scope, $state,$cookieStore,$location,RpwService,ToastFactory,socket) {

	$scope.Credential = {};

	$scope.User = {};
	
	$scope.screenChangePassword = true;

	if($location.search().reset_code){
		$scope.screenChangePassword = true;

		$scope.change = function(){
			$http({
			  	method: 'PUT',
			  	url: '/api/user/password_reset?token=' + $location.search().reset_code,
			  	data: {password:$scope.User.password},
			}).success(function(response){
				if(response.status){
					ToastFactory.popSuccess(response.message);
					$state.go('access.login');
				} else {
					ToastFactory.popErrors(response.message);
				}
			}).error(function(error){
				console.log(error);
			})
		}
	}else{
		$scope.screenChangePassword = false;
		$scope.reset = function(){
			RpwService.postReset($scope.Credential).success(function(response){
				if(response.status){
					$scope.Credential = {
						email: null
					}
					ToastFactory.popSuccess(response.message);
					$state.go('access.password_reset');
				}
				else{
					ToastFactory.popErrors(response.message);
				}
			})
		}
	}

});

