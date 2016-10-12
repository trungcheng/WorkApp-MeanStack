angular.module('SteedOfficeApp').controller('ProjectController', function($http, $rootScope, $scope, $uibModal, $log, $state, $timeout, ToastFactory){

    $scope.teams = {};
    $scope.projects = {};
    $scope.project = {};

    $scope.status = {
        isopen: false
    };

    $scope.active = true;

    var current_date = new Date();
    var date = current_date.getDate();
    var month = current_date.getMonth()+1;
    var year = current_date.getFullYear();
    var today = Date.now();

    $scope.open = function (project) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: '/client/views/projects/modal-project.html',
            controller: 'ProjectModalController',
            size: 'md',
            resolve: {
                project: function() {
                  return project;
                }
            }
        });

        modalInstance.result.then(function (result) {
            console.log(result);
        }, function () {
           
        });
    };

    $http.get('/api/team').success(function(response){
    	$scope.teams = response.data;
    })

    $scope.add = function(){
        $http({
            method: 'POST',
            url: '/api/project',
            data: $scope.project
        }).success(function(response){
            if(response.status){
                ToastFactory.popSuccess(response.message);
                $state.reload();
            }else{
                ToastFactory.popErrors(response.message);
            }
        })
    }

    $scope.showproject = function(){
        $http.get('/api/project').success(function(response){
            if(response.status){
                $scope.projects = response.data;
            }
        });
    }

	$scope.openstart = function() {
	   	$scope.start.opened = true;
	};

	$scope.opendue = function() {
	   	$scope.due.opened = true;
	};

	$scope.dateOptions = {
	    formatYear: 'yyyy',
	    formatDate: 'dd',
	    formatMonth: 'MM',
	    startingDay: 1
	};

	$scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats[2];

	$scope.start = {
	    opened: false
	};

	$scope.due = {
	    opened: false
	};
});