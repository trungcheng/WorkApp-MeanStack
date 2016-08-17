angular.module('SteedOfficeApp').service('RegisterService',function($http){

	this.postRegister = function(Credential){
		return $http.post('/user',Credential);
	}
});