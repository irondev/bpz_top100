app.service('$datas', function($http) {
	var promise = {};
	return {
		getInfos: function() {
			if (!promise['infos']) {
				promise['infos'] = $http.get(config.infosApiUrl).then(function(res) {
					return res.data;
				});
			}
			return promise['infos'];
		},
		getAlbums: function() {
			if (!promise['albums']) {
				promise['albums'] = $http.get(config.albumsApiUrl).then(function(res) {
					return res.data;
				});
			}
			return promise['albums'];
		},
		getNav: function() {
			if (!promise['nav']) {
				promise['nav'] = $http.get(config.navApiUrl).then(function(res) {
					return res.data;
				});
			}
			return promise['nav'];
		}
	};
});

app.service('$imageCache', ['$q', function($q) {
    return {
        Cache: function(urls) {
            var promises = [];
            var cachedImages = [];
            for (var i = 0; i < urls.length; i++) {
                if (cachedImages.indexOf(urls[i]) == -1) {
	                var deferred = $q.defer();
	                var img = new Image();

	                img.onload = (function(deferred) {
	                    return function(){
	                        deferred.resolve();
	                    }
	                })(deferred);
	                
	                img.onerror = (function(deferred,url) {
	                    return function(){
	                    	deferred.resolve();
	                        //deferred.reject(url);
	                    }
	                })(deferred,urls[i]);

	                promises.push(deferred.promise);
	                img.src = urls[i];

	                cachedImages.push(urls[i]);
	            }
            }
            return $q.all(promises);
        }
    }
}]);