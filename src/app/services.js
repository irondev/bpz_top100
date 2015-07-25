app.service('socket', function ($rootScope) {
	var socket = io.connect();

	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback)
						callback.apply(socket, args);
				});
			});
		}
	};
});

app.service('appScopes', function () {
    var mem = {};
 
    return {
        store: function (key, value) {
            mem[key] = value;
        },
        get: function (key) {
            return mem[key];
        }
    };
});

app.service('datasService', function($http) {
	var promise = {};

	return {
		get: function(service) {
			var path = (service == 'watchfilters') ? './app/models/' : './uploads/dpos/'; // cause watchfilters is static
			if (!promise[service]) {
				promise[service] = $http.get(path + service +'.json').then(function(res) {
					return res.data;
				});
			}
			return promise[service];
		},
		getById: function(id, items) {
			var item = null;
			for (var i in items) {
				if (items[i].id == id)
					item = items[i];
			}
			return item;
		},
		getByUniqueId: function(keyId, id, items) {
			var item = null;
			for (var i in items) {
				if (items[i][keyId] == id)
					item = items[i];
			}
			return item;
		}
	};
});

app.service('imageCache', ['$q', function($q) {
    return {
        Cache: function(urls) {
            var promises = [];
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