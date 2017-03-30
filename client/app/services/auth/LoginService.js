angular.module('workApp').service('LoginService',function($http){

	this.postLogin = function(Credential){
		return $http.post('/api/user/authenticate',Credential);
	}
});