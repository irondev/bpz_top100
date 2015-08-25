var player,
    playerIsReady = false,
    playerIsPlaying = false;

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
                playerIsReady = true;
            },
            'onStateChange': function(event) {
                if (event.data == YT.PlayerState.PLAYING)
                    playerIsPlaying = true;
                else
                    playerIsPlaying = false;
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

(function() {
	playerInit();
})();