angular.module('SteedOfficeApp').controller('LoginController', function($rootScope, $scope, $state,$cookieStore,$location,LoginService,ToastFactory,socket) {

	$scope.Credential = {};
	
	if($location.search().stt){
		var query = $location.search().stt;
		var msg = query.replace(/-/g, " ");
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

});