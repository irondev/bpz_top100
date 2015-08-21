(function() {

	app.controller('Top100Ctrl', function($scope, $rootScope, $filter, $location, $datas, $window, $interval) {

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
		}

		/*$scope.orderGroup = function(array) {
			//console.log(array);
			//console.log($scope.groupBy);
			var reverse = ($scope.groupBy == 'meta.albumrankcat') ? true : false;
			return $filter('orderBy')(array, function(arg) {
				//console.log(arg);
			}, reverse);
		};*/

		$scope.activeAlbum = null;
		$scope.openAlbum = function(albumSlug) {
			$location.path('/album/'+ albumSlug);
			$scope.activeAlbum = albumSlug;
		}

		$scope.isPlayerReady = true;
		$scope.loadAlbumSample = function(youtubeUrl) {
			playerLoadId(youtubeUrl);
			$scope.isPlaying = true;
			$scope.setProgressBar();
		}

		$scope.playAlbumSample = function() {
			playerPlay();
			$scope.isPlaying = true;
			$scope.unsetProgressBar();
		}

		$scope.pauseAlbumSample = function() {
			playerPause();
			$scope.isPlaying = false;
			$scope.unsetProgressBar();
		}

		$scope.setProgressBar = function() {
		    playerTimer = $interval(function() {
		        var duration = playerGetDuration();
		        var currentTime = playerGetCurrentTime();
		        $scope.playerProgression = currentTime * 100 / duration;
		    }, 1000);
		}

		$scope.unsetProgressBar = function() {
		    clearInterval(playerTimer);
		}

	});

})();