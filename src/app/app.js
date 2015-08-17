var app;
var documentHeight = document.documentElement.clientHeight;
var documentScroll = window.pageYOffset;

(function() {
	
	app = angular.module('app', ['ngSanitize', 'angular.filter']);
	
	app.run(['$rootScope', function($scope, $rootScope) {

		$scope.config = config;

		$scope.documentHeight = documentHeight;
		angular.element(window).bind('resize', function(e) {
		    documentHeight = document.documentElement.clientHeight;
		    $scope.documentHeight = documentHeight;
		    $scope.$apply();
		});

		$scope.documentScroll = documentScroll;
		angular.element(window).bind('scroll', function(e) {
		    documentScroll = window.pageYOffset;
		    $scope.documentScroll = documentScroll;
		    $scope.$apply();
		});

		$scope.isNavigating = false;
		$scope.toggleNav = function() {
			$scope.isNavigating = $scope.isNavigating ? false : true;
		}
		
	}]);

})();