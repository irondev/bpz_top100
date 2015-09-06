var app;
var documentHeight = document.documentElement.clientHeight;
var documentScroll = window.pageYOffset;

(function() {
	
	app = angular.module('app', ['ngSanitize', 'angular.filter']);
	
	app.run(['$rootScope', function($scope, $rootScope) {

		$scope.appReady = false;
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
		};

		$scope.skipCover = function() {
			jQuery("html, body").animate({scrollTop:documentHeight - 55}, 'slow');
		};

		$scope.backToTop = function() {
			jQuery("html, body").animate({scrollTop:0}, 'slow');
		};
		
	}]);

})();