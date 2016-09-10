angular.module('SteedOfficeApp').controller('TeamController', function($http, $rootScope, $scope, $uibModal, $log, $state, $timeout, ToastFactory){

    $scope.members = {};

    $scope.admin = {};

    $scope.avatarNum = 5;

    $scope.open = function (team) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/client/views/teams/modal-team.html',
            controller: 'TeamModalController',
            size: 'lg',
            resolve: {
                team: function() {
                  return team;
                }
            }
        });

        modalInstance.result.then(function (result) {
            console.log(result);
        }, function () {
           
        });
    };

    $http.get('/api/user').success(function(response){
        $scope.members = response.data;
    })

    $scope.add = function(){
        $http({
            method: 'POST',
            url: '/api/team',
            data: $scope.team
        }).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                $state.reload();
            }else{
                ToastFactory.popErrors(response.message);
            }
        })
    }

    $scope.showteam = function(){
        $http.get('/api/team').success(function(response){
            if(response.status){
                $scope.teams = response.data;
            }
        });
    }

    $scope.team = {};
    // $scope.team.selectedmember = [$scope.people[5], $scope.people[4]];
});