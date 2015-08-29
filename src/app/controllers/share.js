(function() {

	app.controller('ShareCtrl', function($scope) {

		var shareUrl,
			popupWidth = 640,
			popupHeight = 480;

		$scope.share = function(provider) {
			var canonicalUrl = angular.element(document.querySelector("meta[property='og:url']")).attr("content"),
				title = angular.element(document.querySelector("meta[property='og:title']")).attr("content"),
				twitterAccount = angular.element(document.querySelector("meta[name='twitter:site']")).attr("content").substr(1);

			switch (provider) {
				case 'facebook': 
					shareUrl = "http://www.facebook.com/sharer.php?p[url]=" + encodeURIComponent(canonicalUrl);
				break;
				case 'twitter': 
					shareUrl = "https://twitter.com/share?url=" + encodeURIComponent(canonicalUrl) + "&text=" + encodeURIComponent(title) + "&via=" + twitterAccount;
				break;
				case 'google': 
					shareUrl = "https://plus.google.com/share?url=" + encodeURIComponent(canonicalUrl);
				break;
			};
			var popupX = (screen.availWidth / 2) - (popupWidth / 2);
			var popupY = (screen.availHeight / 2) - (popupHeight / 2);
			window.open(shareUrl, provider, "width="+ popupWidth +",height="+ popupHeight +",left="+ popupX +",top="+ popupY);
		};

	});

})();