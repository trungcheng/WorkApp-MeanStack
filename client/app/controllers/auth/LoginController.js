angular.module('workApp').controller('LoginController', function($rootScope, $scope, $state,$cookieStore,$location,LoginService,ToastFactory) {

	$scope.Credential = {};

	$scope.Credential = {
		email:null,
		password:null
	}
	
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
				if(response.message == 'Your email wrong !'){
					$scope.Credential = {
						email:null,
						password:$scope.Credential.password
					}
					ToastFactory.popErrors(response.message);
				}else{
					$scope.Credential = {
						email:$scope.Credential.email,
						password:null
					}
					ToastFactory.popErrors(response.message);
				}
				
			}
		})
	}

});