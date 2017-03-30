angular.module('workApp').factory('ToastFactory',function(toaster,$translate){
	return {
		popSuccess : function(message){
			toaster.pop({type: 'success',title: $translate.instant('ACTION SUCCESS'),body: $translate.instant(message)});
		},
		popErrors : function(message){
			toaster.pop({type: 'error', title: $translate.instant('ACTION FAILED'), body: $translate.instant(message)});
		},
	}
});