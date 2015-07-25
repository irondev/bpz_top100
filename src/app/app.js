var app;

(function() {
	
	app = angular.module('app', []);
	
	app.run(['$rootScope', function($rootScope) {
		console.log("run");
	}]);

})();