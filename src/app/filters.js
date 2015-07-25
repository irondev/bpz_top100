app.filter('formatNavItem', ['$sce', function($sce) {
	return function(input) {
		var words = input.split(' ');
		var string = words[0] +'<br />';
		for (var i in words) {
			if (i > 0)
				string += ' '+ words[i];
		}
		return $sce.trustAsHtml(string);
	};
}]);

app.filter('noTagHeuer', ['$sce', function($sce) {
	return function(input) {
		var output = input.replace(/tag heuer/gi, '');
		return $sce.trustAsHtml(output);
	};
}]);