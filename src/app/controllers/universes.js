(function() {

	app.controller('PartnerListingCtrl', function($scope, $rootScope, $routeParams, $filter, appScopes, socket, datasService, imageCache) {
		appScopes.store('PartnerListingCtrl', $scope);
		$rootScope.loadingState = 'is-loading';

		datasService.get('partnerListing').then(function(datas) {

			//get/set filters
			datasService.get('universefilters').then(function(filterdatas) {
				var filterRows = [];
				for (var i in filterdatas) {
					if (i%2 == 0)
						filterRows.push([]);
					filterRows[(filterRows.length-1)].push(filterdatas[i]);
				}
				$scope.filterRows = filterRows;
			});
			$scope.getFilters = function () {
				var filters = {};
				return filters;
			};
			$scope.tmpFilters = $scope.getFilters();
			$scope.selectFilter = function (filterKey, filterValue) {
				var filter = {};
				filter[filterKey] = filterValue;
				$rootScope.do({
					controller: 'PartnerListingCtrl',
					action: 'selectFilter',
					params: {filter:filter}
				});
			};
			$scope.setFilters = function () {
				$rootScope.do({
					controller: 'PartnerListingCtrl',
					action: 'setFilters'
				});
			};
			$scope.resetFilters = function () {
				$rootScope.do({
					controller: 'PartnerListingCtrl',
					action: 'resetFilters'
				});
			};

			//set pagedItems
			$scope.setPagedItems = function (filters) {
				var itemWidth = ($scope.context == 'screen') ? 536 : 319;
				var itemsPerRow = 3;
				var itemsPerPage = 6;
				$scope.currentPage = 1;
				$scope.offsetLeft = 0;
				$scope.pageWidth = itemWidth * itemsPerRow;
				var filteredItems = $filter('filter')(datas, function(item) {
					var isMatching, 
						loop = 0;
					for (var k in filters) {
						if (item[k])
							isMatching = true;
						loop++;
					}
					return (isMatching || !loop) ? true : false;
				});
				$scope.itemsNum = filteredItems.length;
				$scope.pagesNum = Math.ceil($scope.itemsNum / itemsPerPage);
				var pagedItems = [];
				var p = 0;
				for (var i in filteredItems) {
					if (i%itemsPerPage == 0) {
						p++;
						pagedItems.push([]);
					}
					pagedItems[p-1].push(filteredItems[i]);
				}
				$scope.pagedItems = pagedItems;


				// preload images
				imagesToPreload = [];
				for (var i = 0; i < Math.min(9, datas.length); i++) {
					if ($rootScope.context == 'device') {
						imagesToPreload.push(datas[i].introductionvisual.defaultImage);
					} else {
						imagesToPreload.push(datas[i].introductionvisual.defaultImage);
					}
				}
				imageCache.Cache(imagesToPreload).then(function(){
					$rootScope.loadingState = '';
				});
			};
			$scope.setPagedItems($scope.getFilters());

			//set currentPage
			$scope.to = function (index) {
				$rootScope.do({
					controller: 'PartnerListingCtrl',
					action: 'to',
					params: {index:index}
				});
			};
		});

	});

	app.controller('PartnerDetailsCtrl', function($scope, $rootScope, $routeParams, $filter, appScopes, socket, datasService) {
		appScopes.store('PartnerDetailsCtrl', $scope);

		datasService.get('partnerListing').then(function(datas) {

			$scope.partner = datasService.getByUniqueId('partnerId', $routeParams.partnerId, datas);
			$scope.currentPage = 1;
			$scope.offsetLeft = 0;
			$scope.pagesNum = 4;
			$scope.pageWidth = ($scope.context == 'screen') ? 1920 : 1024;

			//set currentPage
			$scope.to = function (index) {
				appScopes.get('Run').do({
					controller: 'PartnerDetailsCtrl',
					action: 'to',
					params: {index:index}
				});
			};

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
						controller: 'PartnerDetailsCtrl',
						action: 'scroll',
						params: {elementIndex:i, coefScrollTop:coefScrollTop}
					});
				}
			});
			
		});

	});

	app.controller('PartnerVariantListingCtrl', function($scope, $routeParams, $timeout, appScopes, socket, datasService) {
		appScopes.store('PartnerVariantListingCtrl', $scope);

		datasService.get('partnerListing').then(function(datas) {

			$scope.partner = datasService.getByUniqueId('partnerId', $routeParams.partnerId, datas);
			$scope.currentItem = 1;
			$scope.offsetLeft = 0;
			$scope.itemsNum = $scope.partner.watches.length;
			$scope.itemWidth = ($scope.context == 'screen') ? 390 : 265;
			$scope.itemsActived = [0,1,2];

			//set currentPage
			$scope.to = function (index) {
				$rootScope.do({
					controller: 'PartnerVariantListingCtrl',
					action: 'toItem',
					params: {index:index}
				});
				$timeout(function() {
					$rootScope.do({
						controller: 'PartnerVariantListingCtrl',
						action: 'variantsActivate'
					});
				}, 200);
			};

		});

	});

})();