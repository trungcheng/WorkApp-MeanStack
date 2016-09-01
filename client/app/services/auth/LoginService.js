angular.module('SteedOfficeApp').service('LoginService',function($http){

	this.postLogin = function(Credential){
		return $http.post('/api/user/authenticate',Credential);
	}
});