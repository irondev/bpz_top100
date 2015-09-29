var app;
var documentHeight = document.documentElement.clientHeight;
var documentScroll = window.pageYOffset;

(function() {
	
	app = angular.module('app', ['ngSanitize', 'angular.filter']);

	app.config(['$compileProvider', function($compileProvider) {
		$compileProvider.debugInfoEnabled(true);
	}]);
	
	app.run(['$rootScope', function($scope, $rootScope) {

		$scope.appReady = false;
		$scope.config = config;

		$scope.documentHeight = documentHeight;
		angular.element(window).bind('resize', function() {
		    documentHeight = document.documentElement.clientHeight;
		    $scope.documentHeight = documentHeight;
		    $scope.$apply();
		});

		$scope.documentScroll = documentScroll;
		angular.element(window).bind('scroll', function() {
		    documentScroll = window.pageYOffset;
		    $scope.documentScroll = documentScroll;
		    $scope.$apply();
		});

		$scope.isNavigating = false;
		$scope.toggleNav = function() {
			$scope.isNavigating = $scope.isNavigating ? false : true;
		};

		$scope.skipCover = function() {
			jQuery("html, body").animate({scrollTop:documentHeight - 55}, 'slow');
		};

		$scope.backToTop = function($event) {
			if (documentScroll > 0) {
				jQuery("html, body").animate({scrollTop:0}, 'slow');
				$event.preventDefault();
			}	
		};
		
	}]);

})();