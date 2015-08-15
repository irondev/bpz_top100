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
		}
	};
});