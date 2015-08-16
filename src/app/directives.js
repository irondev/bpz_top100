app.directive('nav', ['$datas', function($datas) {
    return {
		restrict: 'E',
		link: function (scope, elm, attrs) {

			$datas.getNav().then(function(datas) {
				scope.nav = datas;
			});

		},
        templateUrl: config.incPath + 'nav.html',
        replace: false
    };
}]);