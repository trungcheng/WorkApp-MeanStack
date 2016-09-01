angular.module('SteedOfficeApp').controller('RegisterController', function($http, $rootScope, $scope, $state,$cookieStore,$location,RegisterService,ToastFactory,socket) {

	$scope.Credential = {};

	$scope.Credential = {
		first:null,
		last:null,
		email: null,
		password:null,
		address:null,
		phone:null
	}
    // $scope.isLoading = false;
    $scope.userData = {token:''};

    $scope.phoneNumbr = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,5}$/im;

	$scope.submited = false;

	$scope.blured = false;

	$scope.emailStatus = false;
	
	$scope.phoneStatus = false;

	$scope.register = function(){
		$scope.submited = true;
		RegisterService.postRegister($scope.Credential).success(function(response){
			if(response.status){
				ToastFactory.popSuccess(response.message);
				$state.go('access.login');
			}
			else{
				$scope.Credential = {
					first:null,
					last:null,
					email: null,
					password:null,
					address:null,
					phone:null
				}
				ToastFactory.popErrors(response.message);
			}
		});
	},

	$scope.checkEmail = function(){
		if($scope.Credential.email){
			$scope.blured =  true;
			$http({
			  	method: 'GET',
			  	url: '/api/user/checkEmail/' + $scope.Credential.email,
			}).success(function(response){
				if(response.status){
					$scope.emailStatus = true;
				} else {
					$scope.emailStatus = false;
				}
			})
		}
	},

	$scope.checkPhone = function(){
		if($scope.Credential.phone){
			$scope.blured =  true;
			$http({
			  	method: 'GET',
			  	url: '/api/user/checkPhone/' + $scope.Credential.phone,
			}).success(function(response){
				if(response.status){
					$scope.phoneStatus = true;
				} else {
					$scope.phoneStatus = false;
				}
			})
		}
	}

});