
angular.module('workApp').controller('UserProfileController', function($rootScope, $scope, UserService, $state, $location, $http, ToastFactory) {
    $scope.$on('$viewContentLoaded', function() {  
        App.initAjax(); // initialize core components
        Layout.setSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile')); // set profile link active in sidebar menu 
    });

    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = true;

    $scope.phoneNumbr = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,5}$/im;

    $scope.submited = false;

    $scope.Profile = {};

    $scope.Pass = {};

    $scope.uploaded = false;

    $scope.index = function(){
        $http.get('/api/user/userdetail').success(function(response){
            if(response.status){
                if(response.data.avatar == null){
                    $scope.Profile = response.data;
                    $scope.uploaded = false;
                }else{
                    $scope.Profile = response.data;
                    $scope.uploaded = true;
                }
            }
        })
    };

    $scope.update = function(){
        $http({
            method: 'PUT',
            url: '/api/user/userdetail/' + $rootScope.rootAuth._id,
            data: {
                first: $scope.Profile.name.first,
                last: $scope.Profile.name.last,
                email: $scope.Profile.email,
                address: $scope.Profile.address,
                phone: $scope.Profile.phone,
            }
        }).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                $scope.Profile = response.data;
                $state.reload();
            }else{
                ToastFactory.popErrors(response.message);
            }
        })
    };

    $scope.upload = function(){
        var data = $scope.myFile;
        var uploadUrl = '/api/user/upload';
        UserService.uploadFileToUrl(data, uploadUrl);
    };

    $scope.change = function(){
        $http({
            method: 'PUT',
            url: '/api/user/updatepass/' + $rootScope.rootAuth._id,
            data: {
                current: $scope.Pass.current,
                new: $scope.Pass.new
            }
        }).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                $state.reload();
            }else{
                ToastFactory.popErrors(response.message);
            }
        })
    }

}); 