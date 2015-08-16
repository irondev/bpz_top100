(function() {

	app.controller('Top100Ctrl', function($scope, $rootScope, $datas, $filter, $window) {

		$scope.config = config;

		$scope.documentHeight = documentHeight;
		angular.element($window).bind('resize', function(e) {
		    documentHeight = document.documentElement.clientHeight;
		    $scope.documentHeight = documentHeight;
		    $scope.$apply();
		});

		$scope.documentScroll = documentScroll;
		angular.element($window).bind('scroll', function(e) {
		    documentScroll = window.pageYOffset;
		    $scope.documentScroll = documentScroll;
		    $scope.$apply();
		});

		$datas.getInfos().then(function(datas) {
			console.log(datas);
			$scope.infos = datas;
		});	

		$datas.getAlbums().then(function(datas) {
			console.log(datas);
			$scope.albums = datas;
			$scope.groupBy = 'meta.albumrankcat'
		});

		$scope.orderGroup = function(array) {
			//console.log(array);
			//console.log($scope.groupBy);
			var reverse = ($scope.groupBy == 'meta.albumrankcat') ? true : false;
			return $filter('orderBy')(array, function(arg) {
				//console.log(arg);
			}, reverse);
		};	

		$scope.isNavigating = false;

		$scope.toggleNav = function() {
			$scope.isNavigating = $scope.isNavigating ? false : true;
		}

	});

})();