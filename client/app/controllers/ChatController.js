(function() {
    'use strict';

    angular
        .module('workApp')
        .controller('ChatController', ChatController);

    function ChatController($rootScope, $scope, $http, $state, ToastFactory, socket) {

    	var vm = this;
    	vm.listMessage = [];

    	socket.emit('user_connect', $rootScope.rootAuth._id);
    	socket.on('list_user_online', function (onlineUsers) {
    		vm.onlineListUsers = onlineUsers;
    	});

    	vm.sendMessage = function () {
    		if (vm.message !== '' && vm.message !== undefined) {
	    		vm.listMessage.push(vm.message);
	    		vm.message = '';
    		}
    	}

    }

})();