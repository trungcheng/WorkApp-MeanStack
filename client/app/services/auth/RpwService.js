angular.module('SteedOfficeApp').service('RpwService',function($http){

	this.postReset = function(Credential){
		return $http.post('/api/user/password_reset',Credential);
	}
});
