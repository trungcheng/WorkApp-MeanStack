angular.module('SteedOfficeApp').controller('LoginController', function($rootScope, $scope, $state,$cookieStore,$location,LoginService,ToastFactory,socket) {

	$scope.Credential = {};
	// $scope.verifyStatus = false;

	var query = $location.search().stt;
	var msg = query.replace("-"," ");
	if(typeof query != undefined || query != null){
		// $scope.verifyStatus = true;
		ToastFactory.popSuccess(msg);
	}

	$scope.login = function(){
		LoginService.postLogin($scope.Credential).success(function(response){
			if(response.status){
				$cookieStore.put('member',response.data.member);
				$cookieStore.put('token',response.data.token);
				ToastFactory.popSuccess(response.message);
				$state.go('app.dashboard');
			}
			else{
				ToastFactory.popErrors(response.message);
			}
		})
	}

	// $scope.verify = function(){
	// 	LoginService.getVerify().success(function(response){
	// 		if(response.status){
	// 			ToastFactory.popSuccess(response.message);
	// 		}else{
	// 			ToastFactory.popErrors(response.message);
	// 		}
	// 	})
	// }

	// $scope.logout = function(){
	// 	LoginService.getLogout().success(function(response){
	// 		if(response.status){
	// 			$cookieStore.remove('CurrentUser');
	// 			ToastFactory.popSuccess(response.message);
	// 			$state.go('access.login');
	// 		}
	// 		else{
	// 			ToastFactory.popErrors(response.message);
	// 		}
	// 	})
	// }

});