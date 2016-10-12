angular.module('SteedOfficeApp').controller('ProjectModalController', function($http, $rootScope, $scope, $state, $modalInstance, project, ToastFactory){

	$scope.project = project;
	$scope.display = false;

	$scope.projectName = true;

	$scope.projectDesc = true;

	if($rootScope.rootAuth._id == project.created_by._id){
		$scope.display = true;
	}else{
		$scope.display = false;
	}

	$scope.displayProjectName = function(){
		$scope.projectName = false;
		$scope.project.newName = angular.copy($scope.project.name);
	}

	$scope.cancelEditName = function(){
		$scope.projectName = true;
	}

	$scope.saveProjectName = function(){
		$http.put('/api/thisproject/name/'+project._id, $scope.project).success(function(response){
			if(response.status){
				ToastFactory.popSuccess(response.message);
				$scope.projectName = true;
				project.name = response.data.name;
			}
		})
	}

	$scope.displayProjectDesc = function(){
		$scope.projectDesc = false;
		$scope.project.newDesc = angular.copy($scope.project.description);
	}

	$scope.cancelEditDesc = function(){
		$scope.projectDesc = true;
	}

	$scope.saveProjectDesc = function(){
		$http.put('/api/thisproject/desc/'+project._id, $scope.project).success(function(response){
			if(response.status){
				ToastFactory.popSuccess(response.message);
				$scope.projectDesc = true;
				project.description = response.data.description;
			}
		})
	}

	$scope.update = function(){
		if(!$scope.project.selectedTeam){
			$http({
				method: 'PUT',
				url: '/api/project/'+project._id,
				data: {
					start: $scope.project.start_date,
					due: $scope.project.due_date,
					selected: project.team_id._id
				}
			}).success(function(response){
					ToastFactory.popSuccess(response.message);
					$modalInstance.dismiss();
					$state.reload();
			})	
		}else{
			$http({
				method: 'PUT',
				url: '/api/project/'+project._id,
				data: {
					start: $scope.project.start_date,
					due: $scope.project.due_date,
					selected: $scope.project.selectedTeam._id
				}
			}).success(function(response){
					ToastFactory.popSuccess(response.message);
					$modalInstance.dismiss();
					$state.reload();
				})
		}
	}

	$scope.removeProject = function(){
		$http.delete('/api/project/'+project._id).success(function(response){
			if(response.status){
				$modalInstance.dismiss();
				$state.reload();
			}
		})
	}

	$http.get('/api/team').success(function(response){
    	$scope.teams = response.data;
    })

	$scope.cancel = function(){
		$modalInstance.dismiss();
	};

	$scope.closeModal = function(){
		$modalInstance.dismiss();
		$state.go('app.project_detail',{id:$scope.project._id});
	};

	$scope.ok = function(){
		$modalInstance.close();
		// console.log('hihi');
	};

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

})