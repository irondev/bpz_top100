var app;
var player;
var standByTimer;
var cachedImages = [];
var config = {
	standByTimeout: 120
};

(function() {
	
	app = angular.module('app', [
		'ngRoute', 'ngTouch', 'ngSanitize'
	]);
	
	app.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
			when('/', {
				section: 'home',
				page: 'home',
				pageTitle: 'Home',
				templateUrl: './app/views/home.html',
				controller: 'PageCtrl'
			}).
			when('/catalogue', {
				redirectTo: '/catalogue/men'
			}).
			when('/catalogue/:gender', {
				section: 'catalogue',
				page: 'home',
				pageTitle: 'Explore the catalogue',
				templateUrl: './app/views/watchListing.html',
				controller: 'PageCtrl',
				hasFilters: true
			}).
			when('/timepiece/:watchId', {
				section: 'watch',
				page: 'details-overview',
				pageTitle: 'Overview',
				templateUrl: './app/views/watchDetails.html',
				controller: 'PageCtrl'
			}).
			when('/universes/', {
				section: 'universes',
				page: 'home',
				pageTitle: 'Discover the universes',
				templateUrl: './app/views/partnerListing.html',
				controller: 'PageCtrl',
				hasFilters: true
			}).
			when('/universes/:partnerId', {
				section: 'universes',
				page: 'details',
				pageTitle: 'Univers',
				templateUrl: './app/views/partnerDetails.html',
				controller: 'PageCtrl'
			}).
			when('/collections/', {
				section: 'collections',
				page: 'home',
				pageTitle: 'Explore the collections',
				templateUrl: './app/views/collecListing.html',
				controller: 'PageCtrl'
			}).
			when('/collections/:collecId', {
				section: 'collections',
				page: 'details',
				pageTitle: 'Collection',
				templateUrl: './app/views/collecDetails.html',
				controller: 'PageCtrl'
			}).
			when('/collections/:collecId/timepieces/:collecIds', {
				section: 'collections',
				page: 'listing',
				pageTitle: 'Collection',
				templateUrl: './app/views/watchListing.html',
				controller: 'PageCtrl',
				hasFilters: true
			}).
			when('/standby', {
				section: 'standby',
				page: 'standby',
				pageTitle: '',
				templateUrl: './app/views/standby.html',
				controller: 'PageCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
		}
	]);
	
	app.run(['$rootScope', '$location', '$timeout', '$q', 'appScopes', 'socket', 'datasService', 'imageCache', function($rootScope, $location, $timeout, $q, appScopes, socket, datasService, imageCache) {
		appScopes.store('Run', $rootScope);

		// set device heights
		$rootScope.windowHeight = Math.min(window.innerHeight, window.innerWidth);
		window.addEventListener('resize', function() {
			$rootScope.windowHeight = Math.min(window.innerHeight, window.innerWidth);
		});
		$rootScope.barsHeight = 0;
		if (document.getElementById('header'))
			$rootScope.barsHeight += document.getElementById('header').clientHeight;
		if (document.getElementById('footer'))
			$rootScope.barsHeight += document.getElementById('footer').clientHeight;

		// standby refresh on touch
		document.addEventListener('touchstart', function(e) {
			$rootScope.do({
				action: 'refreshStandby'
			});
		});

		document.addEventListener('touchend', function(e) {
			$rootScope.$apply(function() {
				if ($location.path() == '/standby') {
					$timeout(function() {
						$rootScope.go('/');
					}, 200);
				}
			});
		});

		// disable document scrolling on ipad
		document.addEventListener('touchmove', function(e) {
			var el = e.target;
			var innerScroll = false;
			while (el) {
				if (el.attributes && el.attributes.class && el.attributes.class.value.indexOf("js-scroller") != -1) {
					innerScroll = true;
					el = null;
				} else {
					el = el.parentNode;
				}
			}
			if (!innerScroll)
				e.preventDefault();
		}, true);

		// intro preloading json and images
		$rootScope.appReady = false;
		// intro images
		imageCache.Cache([
			'/img/bg-black-timepiece.jpg',
			'/img/logo-intro.png'
		]).then(function() {
			var promiseStoreApplicationMenu = datasService.get('storeApplicationMenu');
			$q.all([promiseStoreApplicationMenu]).then(function(datas) {
				var imagesToPreload = [];
				// static images
				if ($rootScope.context == 'device') {
					imagesToPreload.push('/img/bg-timepiece.jpg');
					imagesToPreload.push('/img/bg-watchListing.jpg');
					imagesToPreload.push('/img/bg-360.jpg');
					imagesToPreload.push('/img/cursor-360.png');
				} else {
					imagesToPreload.push('/img/bg-timepiece-tv.jpg');
					imagesToPreload.push('/img/bg-watchListing-tv.jpg');
					imagesToPreload.push('/img/circle-360-tv.png');
				}
				// home images
				for (var i = 0; i < datas[0].length; i++) {
					if ($rootScope.context == 'device') {
						imagesToPreload.push(datas[0][i].image.medium);
					} else {
						imagesToPreload.push(datas[0][i].image.large);
					}
				}
				imageCache.Cache(imagesToPreload).then(function(){
					$rootScope.appReady = true;
					$rootScope.do({
						action: 'refreshStandby'
					});
			    });
			});
		});

		// set routes events
		$rootScope.$on('$routeChangeStart', function (event, current, previous) {
			$rootScope.loadingState = 'is-loading';
		});
		$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
			$rootScope.section = current.$$route.section;
			$rootScope.page = current.$$route.page;
			$rootScope.pageTitle = current.$$route.pageTitle;
			$rootScope.hasFilters = current.$$route.hasFilters;
			$rootScope.loadingState = '';
			player = null;
		});
		$rootScope.$on('$routeChangeError', function (event, current, previous) {
			$rootScope.loadingState = '';
			window.location.reload();
		});

		// socket interactions
		socket.on('ipad2tv', function(msg) {
			if ($rootScope.context == 'screen')
				$rootScope.do(msg, false);
		});
		$rootScope.do = function(msg, ipad2tv) {
			if (ipad2tv !== false)
				ipad2tv = true;
			if (ipad2tv)
				socket.emit('ipad2tv', msg);
			if ($rootScope.context == 'device' || !ipad2tv) {
				switch (msg.action) {
					case 'go':
						if (msg.params.path == 'back') {
							window.history.back();
						} else if (msg.params.path == 'forward') {
							window.history.forward();
						} else {
							$location.path(msg.params.path);
							$location.search({});
						}
						appScopes.get('PageCtrl').navState = '';
						appScopes.get('PageCtrl').popinState = '';
						appScopes.get('PageCtrl').filterState = '';
						appScopes.get('PageCtrl').dspFilters = [];
						if (appScopes.get('HomeCtrl'))
							appScopes.get('HomeCtrl').activeChild = [];
					break;
					case 'to':
						if (msg.params.index === parseInt(msg.params.index, 10))
							appScopes.get(msg.controller).currentPage = msg.params.index + 1;
						else if (msg.params.index == 'left' && appScopes.get(msg.controller).currentPage < appScopes.get(msg.controller).pagesNum)
							appScopes.get(msg.controller).currentPage++;
						else if (msg.params.index == 'right' && appScopes.get(msg.controller).currentPage > 1)
							appScopes.get(msg.controller).currentPage--;
						appScopes.get(msg.controller).offsetLeft = -(appScopes.get(msg.controller).currentPage * appScopes.get(msg.controller).pageWidth - appScopes.get(msg.controller).pageWidth);
						if (player) {
							player.pauseVideo();
							for (var i in player) {
								if (typeof player[i] == 'object' && player[i].tagName == 'IFRAME')
									player[i].style.display = 'none';//for ipad
							}
						}
					break;
					case 'toItem':
						if (msg.params.index === parseInt(msg.params.index, 10))
							appScopes.get(msg.controller).currentItem = msg.params.index + 1;
						else if (msg.params.index == 'left' && appScopes.get(msg.controller).currentItem < appScopes.get(msg.controller).itemsNum - 2)
							appScopes.get(msg.controller).currentItem++;
						else if (msg.params.index == 'right' && appScopes.get(msg.controller).currentItem > 1)
							appScopes.get(msg.controller).currentItem--;
						appScopes.get(msg.controller).offsetLeft = -(appScopes.get(msg.controller).currentItem * appScopes.get(msg.controller).itemWidth - appScopes.get(msg.controller).itemWidth);
					break;
					case 'toCollecItem':
						if (msg.params.index === parseInt(msg.params.index, 10))
							appScopes.get(msg.controller).currentItem = msg.params.index + 1;
						else if (msg.params.index == 'left' && appScopes.get(msg.controller).currentItem < appScopes.get(msg.controller).itemsNum - 1)
							appScopes.get(msg.controller).currentItem++;
						else if (msg.params.index == 'right' && appScopes.get(msg.controller).currentItem > 1)
							appScopes.get(msg.controller).currentItem--;
						appScopes.get(msg.controller).offsetLeft = -1 * Math.min(appScopes.get(msg.controller).currentItem * appScopes.get(msg.controller).itemWidth - appScopes.get(msg.controller).itemWidth, appScopes.get(msg.controller).offsetLeftMax);
					break;
					case 'variantsActivate':
						appScopes.get(msg.controller).itemsActived = [];
						for (var i = appScopes.get(msg.controller).currentItem - 1; i <= appScopes.get(msg.controller).currentItem + 1; i++) {
							appScopes.get(msg.controller).itemsActived.push(i);
						}
					break;
					case 'pagerToTitle':
						appScopes.get('PageCtrl').page = msg.params.page;
						appScopes.get('PageCtrl').pageTitle = msg.params.pageTitle;
					break;
					case 'setPreview':
						appScopes.get('PageCtrl').previewItem = msg.params.item;
						appScopes.get('PageCtrl').previewTpl = '/preview.html';
						appScopes.get('PageCtrl').popinState = 'is-poping';
					break;
					case 'unsetPreview':
						appScopes.get('PageCtrl').popinState = '';
					break;
					case 'selectFilter':
						for (var k in msg.params.filter) {
							if (appScopes.get(msg.controller).tmpFilters[k] && appScopes.get(msg.controller).tmpFilters[k] == msg.params.filter[k])
								delete appScopes.get(msg.controller).tmpFilters[k];
							else
								appScopes.get(msg.controller).tmpFilters[k] = msg.params.filter[k];
						}
					break;
					case 'setFilters':
						appScopes.get(msg.controller).setPagedItems(appScopes.get(msg.controller).tmpFilters);
						appScopes.get('PageCtrl').filterState = '';
						delete appScopes.get('PageCtrl').dspFilters;
						appScopes.get('PageCtrl').dspFilters = [];
						var activeFilters = document.getElementById("filters").getElementsByClassName("is-active");
						for (i = 0; i < activeFilters.length; i++) {
							appScopes.get('PageCtrl').dspFilters.push({label: activeFilters[i].innerHTML});
						}
					break;
					case 'resetFilters':
						appScopes.get(msg.controller).tmpFilters = appScopes.get(msg.controller).getFilters();
						appScopes.get(msg.controller).setPagedItems(appScopes.get(msg.controller).tmpFilters);
						appScopes.get('PageCtrl').filterState = '';
						appScopes.get('PageCtrl').dspFilters = [];
					break;
					case 'scroll':
						if (appScopes.get('PageCtrl').context == 'screen') {
							var element = angular.element(document.getElementsByClassName('js-scroller')[msg.params.elementIndex])[0];
							element.scrollTop = (element.scrollHeight - element.clientHeight) * msg.params.coefScrollTop;
						}
					break;
					case 'play':
						var image = document.getElementById(msg.params.elementId).parentNode.getElementsByTagName("img")[0];
						if (player) {
							player.loadVideoById(msg.params.videoId);
							player.playVideo();
						} else {
							player = new YT.Player(msg.params.elementId, {
								height: image.clientHeight,
								width: image.clientWidth,
								videoId: msg.params.videoId,
								events: {
									'onReady': function(e) {
		    							e.target.playVideo();
									},
									'onStateChange': function(e) {
										if (e.data === YT.PlayerState.BUFFERING || e.data === YT.PlayerState.PLAYING) {
		    								document.getElementById(msg.params.elementId).style.display = 'block';
		    							}
		    							if (e.data === YT.PlayerState.ENDED || e.data === YT.PlayerState.PAUSED) {
											document.getElementById(msg.params.elementId).style.display = 'none';
		    							}
									}
								}
							});
						}
					break;
					case '360':
						appScopes.get(msg.controller).currentImage = msg.params.currentImage;
					break;
					case 'refreshStandby':
						if (standByTimer)
							$timeout.cancel(standByTimer);
						standByTimer = $timeout(function() {
							$location.path('/standby');
						}, config.standByTimeout * 1000);
					break;
					case 'toggleChild':
						if (appScopes.get(msg.controller).isActiveChild(msg.params.index)) {
							appScopes.get(msg.controller).activeChild.splice(appScopes.get(msg.controller).activeChild.indexOf(msg.params.index), 1);
						} else {
							appScopes.get(msg.controller).activeChild.push(msg.params.index);
						}
					break;
				}
			}
		};

	}]);

})();