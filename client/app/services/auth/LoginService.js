angular.module('SteedOfficeApp').service('LoginService',function($http){

	this.postLogin = function(Credential){
		return $http.post('/authenticate',Credential);
	}
	this.getVerify = function(){
		return $http.get('/user/verify/confirm_email');
	}
});