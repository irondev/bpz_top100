var player,
    playerTimer;

var playerInit = function () {
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};

var onYouTubeIframeAPIReady = function () {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        loop: 0,
        events: {
            'onReady': function(event) {
                var $scope = angular.element(document.querySelector('[ng-controller="Top100Ctrl"]')).scope();
                $scope.isPlayerReady = true;
            },
            'onStateChange': function(event) {
                var $scope = angular.element(document.querySelector('[ng-controller="Top100Ctrl"]')).scope();
                switch (event.data) {
                    case YT.PlayerState.PLAYING:
                        $scope.isLoading = false;
                        $scope.isPlaying = $scope.loadedAlbum;
                        $scope.isPausing = false;
                        $scope.setProgressBar();
                    break;
                    case YT.PlayerState.PAUSED:
                        $scope.isLoading = false;
                        $scope.isPlaying = false;
                        $scope.isPausing = $scope.loadedAlbum;
                    break;
                    case YT.PlayerState.ENDED:
                        $scope.isLoading = false;
                        $scope.isPlaying = false;
                        $scope.isPausing = false;
                        $scope.nextAlbumSample();
                    break;
                }
            }
        }
    });
};

var playerLoadId = function (id) {
    if (id.indexOf('youtube.com/v/') != -1)
        player.loadVideoByUrl(id);  
    else if (id.indexOf('?v=') != -1)
        id = id.substr((id.indexOf('?v=') + 3));
    player.loadVideoById(id);
};

var playerGetDuration = function () {
    return player.getDuration();
};

var playerGetCurrentTime = function () {
    return player.getCurrentTime();
};

var playerPlay = function () {
    player.playVideo();
};

var playerPause = function () {
    player.pauseVideo();
};

var playerStop = function () {
	player.stopVideo();
};

var playerSeekTo = function (value) {
    var duration = playerGetDuration();
    var seekTo = duration * value / 100;
    player.seekTo(seekTo);
};

(function() {
	playerInit();
})();