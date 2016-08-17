angular.module('SteedOfficeApp').controller('RegisterController', function($rootScope, $scope, $state,$cookieStore,$location,RegisterService,ToastFactory,socket) {

	$scope.Credential = {};
    // $scope.isLoading = false;
    $scope.userData = {token:''};

	$scope.register = function(){
		RegisterService.postRegister($scope.Credential).success(function(response){
			if(response.status){
				console.log(response);
				ToastFactory.popSuccess(response.message);
				$state.go('access.login');
			}
			else{
				ToastFactory.popErrors(response.message);
			}
		});
	}

	// RegisterService.getVerify().success(function(response){
	// 	if(response.status){
	// 		ToastFactory.popSuccess(response.message);
	// 		$state.go('access.login');
	// 	}
	// })

});