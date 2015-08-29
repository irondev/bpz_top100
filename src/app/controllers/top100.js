(function() {

	app.controller('Top100Ctrl', function($scope, $rootScope, $filter, $location, $window, $document, $interval, $q, $datas, $imageCache) {

		var promiseInfos = $datas.getInfos();
		var promiseAlbums = $datas.getAlbums();
		$q.all([promiseInfos, promiseAlbums]).then(function(datas) {
			var imageToPreload = [];
			imageToPreload.push(datas[0].meta.coverimage.url);
			/*for (var i = 0; i < datas[1].length; i++) {
				imageToPreload.push(datas[1][i].meta.albumcover.url);
			}*/
			$imageCache.Cache(imageToPreload).then(function() {
				$scope.appReady = true;
			});
		}, function(r) {
			console.error(r);
		});

		$datas.getInfos().then(function(datas) {
			console.log(datas);
			$scope.infos = datas;
		});

		$datas.getAlbums().then(function(datas) {
			console.log(datas);
			$scope.albums = datas;
		});

		$scope.groupBy = 'meta.albumrankcat';
		$scope.setFilter = function(filter) {
			$location.path('/filter/'+ filter);
			$scope.groupBy = 'meta.' + filter;
			$scope.activeAlbum = null;
		};

		/*$scope.orderGroup = function(array) {
			//console.log(array);
			//console.log($scope.groupBy);
			var reverse = ($scope.groupBy == 'meta.albumrankcat') ? true : false;
			return $filter('orderBy')(array, function(arg) {
				//console.log(arg);
			}, reverse);
		};*/

		$scope.activeAlbum = null;
		$scope.playerCurrentAlbum = 0;
		$scope.openAlbum = function(albumSlug) {
			$location.path('/album/'+ albumSlug);
			$scope.activeAlbum = albumSlug;
		};

		$scope.loadAlbumSample = function(youtubeUrl, index) {
			if ($scope.playerCurrentAlbum == index) {
				$scope.playAlbumSample();
			} else {
				$scope.isLoading = $scope.playerCurrentAlbum = index;
				playerLoadId(youtubeUrl);				
			}
		};

		$scope.playAlbumSample = function() {
			playerPlay();
		};

		$scope.pauseAlbumSample = function() {
			playerPause();
		};

		$scope.setProgressBar = function() {
		    playerTimer = $interval(function() {
		        var duration = playerGetDuration();
		        var currentTime = playerGetCurrentTime();
		        $scope.playerProgression = currentTime * 100 / duration;
		    }, 1000);
		};

		$scope.unsetProgressBar = function() {
		    $scope.playerProgression = 0;
		    $interval.cancel(playerTimer);
		};

	});

})();