angular.module('workApp').service('UserService',function($http, ToastFactory, $state){
	
	this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                $state.reload();
            }else{
                ToastFactory.popErrors(response.message);
            }
        })
        .error(function(){
        });
    }

});