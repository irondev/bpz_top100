(function() {

	app.controller('Top100Ctrl', function($scope, $rootScope, datas) {

		datas.getDatas().then(function(datas) {
			
			console.log(datas);

		});		

	});

})();