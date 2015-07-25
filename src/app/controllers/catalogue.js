var isTouching360;
var globalVars = [];

(function() {

	app.controller('WatchListingCtrl', function($scope, $rootScope, $routeParams, $filter, appScopes, socket, datasService, imageCache) {
		appScopes.store('WatchListingCtrl', $scope);
		$rootScope.loadingState = 'is-loading';

		datasService.get('watchListing').then(function(datas) {

			//get/set filters
			datasService.get('watchfilters').then(function(filterdatas) {
				$scope.filterRows = filterdatas;
			});
			$scope.getFilters = function () {
				var filters = {};
				if ($routeParams.filters) {
					filters.filters = $routeParams.filters;
				}
				if ($routeParams.gender) {
					filters.gender = $routeParams.gender.toUpperCase();
				}
				if ($routeParams.collecIds) {
					var collecIds = $routeParams.collecIds.split(",");
					filters.collectionId = collecIds;
				}
				return filters;
			};
			$scope.tmpFilters = $scope.getFilters();
			$scope.selectFilter = function (filterKey, filterValue) {
				var filter = {};
				filter[filterKey] = filterValue;
				$rootScope.do({
					controller: 'WatchListingCtrl',
					action: 'selectFilter',
					params: {filter:filter}
				});
			};
			$scope.setFilters = function () {
				$rootScope.do({
					controller: 'WatchListingCtrl',
					action: 'setFilters'
				});
			};
			$scope.resetFilters = function () {
				$rootScope.do({
					controller: 'WatchListingCtrl',
					action: 'resetFilters'
				});
			};

			//set pagedItems
			$scope.setPagedItems = function (filters) {
				var itemWidth = ($scope.context == 'screen') ? 240 : 128;
				var itemsPerRow = 7;
				var itemsPerPage = 18;
				$scope.currentPage = 1;
				$scope.offsetLeft = 0;
				$scope.pageWidth = itemWidth * itemsPerRow;
				var filteredItems = $filter('filter')(datas, filters, function(actual, expected) {
					if (angular.isArray(expected))
						return (expected.indexOf(actual) != -1) ? true : false;
					else
						return (actual === expected) ? true : false;
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
				for (var i = 0; i < Math.min(21, filteredItems.length); i++) {
					if ($rootScope.context == 'device') {
						imagesToPreload.push(filteredItems[i].image.small);
					} else {
						imagesToPreload.push(filteredItems[i].image.large);
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
					controller: 'WatchListingCtrl',
					action: 'to',
					params: {index: index}
				});
			};

			//set/unset preview
			$scope.setPreview = function (item) {
				$rootScope.do({
					controller: 'WatchListingCtrl',
					action: "setPreview",
					params: {item: item}
				});
			};
			$rootScope.unsetPreview = function () {
				$rootScope.do({
					controller: 'WatchListingCtrl',
					action: "unsetPreview"
				});
			};
		});

	});

	app.controller('WatchDetailsCtrl', function($scope, $rootScope, $routeParams, $filter, appScopes, socket, datasService, imageCache) {
		appScopes.store('WatchDetailsCtrl', $scope);
		

		datasService.get('watchListing').then(function(datas) {

			$scope.watch = datasService.getByUniqueId('reference', $rootScope.watchId, datas);
			
			if ($rootScope.context == 'screen') {
				// preload images
				$rootScope.loadingState = 'is-loading';
				imagesToPreload = [$scope.watch.image.defaultImage];
				imageCache.Cache(imagesToPreload).then(function(){
					$rootScope.loadingState = '';
				});
			}

			$scope.currentPage = 1;
			$scope.offsetLeft = 0;
			var pagerItems = [
				{"id":"overview", "label":"Overview"},
				{"id":"more", "label":"More details"},
				{"id":"movement", "label":"Movement"}
			];
			if ($scope.watch.variants.length > 1)
				pagerItems.push({"id":"othertimepieces", "label":"Other timepieces"});
			if ($scope.watch.visual360.length)
				pagerItems.splice(1, 0, {"id":"360", "label":"360°"});
			$scope.pagerItems = pagerItems;
			$scope.pagesNum = $scope.pagerItems.length;
			$scope.pageWidth = ($scope.context == 'screen') ? 1920 : 1024;

			//set currentPage
			$scope.to = function (index) {
				if (isTouching360)
					return false;
				$rootScope.do({
					controller: 'WatchDetailsCtrl',
					action: 'to',
					params: {index: index}
				});
				var el = angular.element(document.getElementById('watchTraveling'));
				setTimeout(function () {
					var activeItem = angular.element(document.getElementById('pager')).children()[($scope.currentPage - 1)];
					var attributes = angular.element(activeItem)[0].attributes;
					var page;
					for (var i = 0; i <= attributes.length; i++) {
						if (typeof attributes[i] !== 'undefined' && attributes[i].nodeName == 'page')
							page = attributes[i].nodeValue;
					}
					var pageTitle = activeItem.innerText;
					$rootScope.do({
						controller: 'WatchDetailsCtrl',
						action: 'pagerToTitle',
						params: {page: page, pageTitle: pageTitle}
					});
				}, 200);
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
						controller: 'WatchDetailsCtrl',
						action: 'scroll',
						params: {elementIndex:i, coefScrollTop:coefScrollTop}
					});
				}
			});

		});

	});

	app.controller('VariantListingCtrl', function($scope, $rootScope, $filter, appScopes, socket, datasService) {
		appScopes.store('VariantListingCtrl', $scope);

		datasService.get('watchListing').then(function(datas) {

			$scope.watch = datasService.getByUniqueId('reference', $rootScope.watchId, datas);
			var variants = [];
			for (var i in $scope.watch.variants) {
				if ($scope.watch.variants[i].reference != $scope.watch.reference)
					variants.push($scope.watch.variants[i]);
			}
			$scope.variants = variants;
			$scope.currentItem = 1;
			$scope.offsetLeft = 0;
			$scope.itemsNum = $scope.variants.length;
			$scope.itemWidth = ($scope.context == 'screen') ? 390 : 265;
			$scope.itemsActived = [0,1,2];

			//set currentPage
			$scope.to = function (index) {
				$rootScope.do({
					controller: 'VariantListingCtrl',
					action: 'toItem',
					params: {index:index}
				});
				setTimeout(function() {
					$rootScope.do({
						controller: 'VariantListingCtrl',
						action: 'variantsActivate'
					});
				}, 200);
			};

		});

	});

	app.controller('Watch360Ctrl', function($scope, $rootScope, appScopes, socket) {
		appScopes.store('Watch360Ctrl', $scope);

		$scope.currentImage = 0;
		var cursor = document.getElementsByClassName('js-360-cursor')[0];

		globalVars['360_steps'] = appScopes.get('WatchDetailsCtrl').watch.visual360.length;
		globalVars['360_radius'] = {x:325, y:140};
		globalVars['360_center'] = {x:485, y:265};
		globalVars['360_angle'] = Math.atan2(globalVars['360_center'].y, globalVars['360_center'].x) + Math.PI;
		globalVars['360_angle'] = Math.round((globalVars['360_angle']/(Math.PI*2))*globalVars['360_steps']);

		angular.element(cursor).bind("touchmove", function(e) {
			isTouching360 = true;

		    var pos = {
				x:e.touches[0].clientX - (cursor.clientWidth / 2),
				y:e.touches[0].clientY - (cursor.clientHeight / 2)
			};
		    var angle = Math.atan2(globalVars['360_center'].y - pos.y, globalVars['360_center'].x - pos.x) + Math.PI; // mettre limite min et max sur angle en radian
		    angle = Math.min(angle, Math.PI);
		    if (angle == Math.PI && pos.x > 512)
		    	angle = 0;

		    var props = {};
		    props.x = Math.cos(angle) * globalVars['360_radius'].x + globalVars['360_center'].x;
		    props.y = Math.sin(angle) * globalVars['360_radius'].y + globalVars['360_center'].y;
			cursor.style.left = props.x + "px";
		    cursor.style.top = props.y + "px";
		    var rotate = 180 * (angle/(Math.PI*2)*2) - 80;
		    cursor.style.WebkitTransform = "rotate("+ rotate +"deg)";

		    var step = Math.floor((globalVars['360_steps'] - 1) * (angle/(Math.PI*2)*2));
		    if (step != $scope.currentImage) {
				$rootScope.do({
					controller: 'Watch360Ctrl',
					action: '360',
					params: {'currentImage': step}
				});
		    }
		});
		angular.element(document.getElementsByClassName('js-360-cursor')).bind("touchend", function(e) {
			setTimeout(function() {
				isTouching360 = false;
			}, 200);
		});
	});

})();