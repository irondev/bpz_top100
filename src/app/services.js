app.service('datas', function($http) {
	var promise = {};

	return {
		getDatas: function(service) {
			if (!promise[service]) {
				promise[service] = $http.get(config.apiUrl).then(function(res) {
					return res.data;
				});
			}
			return promise[service];
		}
	};
});