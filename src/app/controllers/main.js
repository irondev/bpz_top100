(function() {

	app.controller('PageCtrl', function($scope, $rootScope, $routeParams, $location, $sce, appScopes, socket, datasService) {
		appScopes.store('PageCtrl', $rootScope);

		if ($routeParams.gender) {
			$rootScope.gender = $routeParams.gender;
			$rootScope.pageTitle = 'For '+ $routeParams.gender;
		}
		if ($routeParams.watchId) {
			$rootScope.watchId = $routeParams.watchId;
		}
		if ($routeParams.collecId) {
			$rootScope.collecId = $routeParams.collecId;
		}
		if ($routeParams.collecIds) {
			$rootScope.collecIds = $routeParams.collecIds;
			datasService.get('collecListing').then(function(collecDatas) {
				$rootScope.pageTitle = datasService.getById($rootScope.collecId, collecDatas).label;
			});
		}
		if ($routeParams.partnerId) {
			$rootScope.partnerId = $routeParams.partnerId;
		}

		$rootScope.go = function (path) {
			$rootScope.do({
				controller: 'PageCtrl',
				action: 'go',
				params: {path: path}
			});
		};

		$rootScope.play = function (elementId, videoId) {
			$rootScope.do({
				controller: 'PageCtrl',
				action: 'play',
				params: {elementId: elementId, videoId: videoId}
			});
		};

		$rootScope.getImage = function (imageObj, sizeObj) {
			if (!imageObj)
				return false;
			else if ($rootScope.context == 'device' && angular.isDefined(sizeObj.device) && imageObj[sizeObj.device])
				return imageObj[sizeObj.device];
			else if ($rootScope.context == 'screen' && angular.isDefined(sizeObj.screen) && imageObj[sizeObj.screen])
				return imageObj[sizeObj.screen];
			else
				return imageObj.defaultImage;
		};

	});

	app.controller('HomeCtrl', function($scope, appScopes, socket, datasService) {
		appScopes.store('HomeCtrl', $scope);

		datasService.get('storeApplicationMenu').then(function(datas) {
			$scope.navItems = datas;

			$scope.activeChild = [];
			$scope.toggleChild = function (index) {
				appScopes.get('Run').do({
					controller: 'HomeCtrl',
					action: 'toggleChild',
					params: {index: index}
				});
			};
			$scope.isActiveChild = function (index) {
				if ($scope.activeChild.indexOf(index) != -1)
					return true;
				else
					return false;
			};
		});

	});

	app.controller('NavCtrl', function($scope, datasService, appScopes) {

		datasService.get('storeApplicationMenu').then(function(datas) {

			$scope.closeNav = function () {
				appScopes.get('PageCtrl').navState = '';
			};

			//get nav items
			$scope.navItems = datas;

			//set accordion
			$scope.activeSubNav = [];
			$scope.toggleSubNav = function (index) {
				if ($scope.isActiveSubNav(index)) {
					$scope.activeSubNav.splice($scope.activeSubNav.indexOf(index), 1);
				} else {
					$scope.activeSubNav.push(index);
				}
			};
			$scope.isActiveSubNav = function (index) {
				if ($scope.activeSubNav.indexOf(index) != -1)
					return true;
				else
					return false;
			};

		});

	});

})();