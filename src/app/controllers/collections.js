(function() {

	app.controller('CollecListingCtrl', function($scope, $rootScope, appScopes, socket, datasService, imageCache) {
		appScopes.store('CollecListingCtrl', $scope);
		$rootScope.loadingState = 'is-loading';

		datasService.get('collecListing').then(function(datas) {
			//set pagedItems
			$scope.items = datas;
			$scope.offsetLeft = 0;
			$scope.currentItem = 1;
			$scope.pageWidth = ($scope.context == 'screen') ? 1920 : 1024;
			$scope.itemWidth = ($scope.context == 'screen') ? 740 : 390;
			$scope.itemsNum = $scope.items.length;
			$scope.offsetLeftMax = ($scope.itemsNum >= 3) ? ($scope.itemWidth * $scope.itemsNum) - $scope.pageWidth : 0;

			// preload images
			imagesToPreload = [];
			for (var i = 0; i < Math.min(4, datas.length); i++) {
				if ($rootScope.context == 'device') {
					imagesToPreload.push(datas[i].backgroundimage.medium);
					imagesToPreload.push(datas[i].watchimage.small);
				} else {
					imagesToPreload.push(datas[i].backgroundimage.large);
					imagesToPreload.push(datas[i].watchimage.medium);
				}
			}
			imageCache.Cache(imagesToPreload).then(function(){
				$rootScope.loadingState = '';
			});

			//set currentItem
			$scope.to = function (index) {
				$rootScope.do({
					controller: 'CollecListingCtrl',
					action: 'toCollecItem',
					params: {index: index}
				});
			};
		});

	});

	app.controller('CollecDetailsCtrl', function($scope, $rootScope, $routeParams, $filter, $timeout, appScopes, socket, datasService) {
		appScopes.store('CollecDetailsCtrl', $scope);

		datasService.get('collecListing').then(function(datas) {

			$scope.collec = datasService.getById($routeParams.collecId, datas);
			$scope.collec.collecIds = $scope.collec.collections.join();
			$scope.currentPage = 1;
			$scope.offsetLeft = 0;
			$scope.pagesNum = $scope.collec.pages.length + 1;
			$scope.pageWidth = ($scope.context == 'screen') ? 1920 : 1024;

			//set currentPage
			$scope.to = function (index) {
				appScopes.get('Run').do({
					controller: 'CollecDetailsCtrl',
					action: 'to',
					params: {index: index}
				});
			};

			$timeout(function() {
				angular.element(document.getElementsByClassName('js-scroller')).bind("scroll", function() {
					if ($rootScope.context == 'device') {
						var elements = document.getElementsByClassName('js-scroller');
						for (var i = 0; i < elements.length; i++) {
							if (elements[i] == this) 
								break;
						}
						var element = angular.element(this)[0];
						var coefScrollTop = element.scrollTop / (element.scrollHeight - element.clientHeight);
						$rootScope.do({
							controller: 'CollecDetailsCtrl',
							action: 'scroll',
							params: {elementIndex:i, coefScrollTop:coefScrollTop}
						});
					}
				});
			}, 200);

		});

	});

})();