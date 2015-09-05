(function() {

	app.controller('Top100Ctrl', function($scope, $rootScope, $filter, $location, $window, $document, $timeout, $interval, $q, $datas, $imageCache) {

		var startTime = new Date();
		var promiseInfos = $datas.getInfos();
		var promiseAlbums = $datas.getAlbums();
		$q.all([promiseInfos, promiseAlbums]).then(function(datas) {
			$scope.infos = datas[0];console.log($scope.infos);
			$scope.albums = datas[1];console.log($scope.albums);
			$scope.currentAlbum = $scope.albums[0];
			var imageToPreload = [];
			imageToPreload.push($scope.infos.meta.coverimage.url);
			/*for (var i = 0; i < $scope.albums.length; i++) {
				imageToPreload.push($scope.albums[i].meta.albumcover.url);
			}*/
			$imageCache.Cache(imageToPreload).then(function() {
				var now = new Date();
				var loadingTime = now - startTime;
				if (loadingTime < config.loaderMinTime) {
					$timeout(function() {
						$scope.appReady = true;
					}, (config.loaderMinTime - loadingTime));
				} else {
					$scope.appReady = true;
				}
			});
		}, function(r) {
			console.error(r);
		});

		$scope.groupBy = 'meta.albumrankcat';
		$scope.groupOrderBy = '-meta.albumrankcat';
		$scope.setFilter = function(filter) {
			$location.path('/filter/'+ filter);
			$scope.groupBy = 'meta.' + filter;
			$scope.groupOrderBy = ($scope.groupBy == 'meta.albumrankcat') ? '-meta.albumrankcat' : $scope.groupBy;
			$scope.openedAlbum = null;
		};

		$scope.openAlbum = function(albumObj) {
			$location.path('/album/'+ albumObj.slug);
			$scope.openedAlbum = albumObj;
		};

		$scope.loadAlbumSample = function(albumObj) {
			if ($scope.loadedAlbum && $scope.loadedAlbum.slug == albumObj.slug) {
				$scope.playAlbumSample();
			} else {
				$scope.isLoading = $scope.loadedAlbum = $scope.openedAlbum = $scope.currentAlbum = albumObj;
				playerLoadId($scope.loadedAlbum.meta.albumextract);				
			}
			console.log($scope.loadedAlbum);
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