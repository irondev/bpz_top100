app.directive('header', function() {
	return {
		templateUrl: './app/views/partials/header.html'
	};
});

app.directive('footer', function() {
	return {
		templateUrl: './app/views/partials/footer.html'
	};
});

app.directive('nav', function() {
	return {
		templateUrl: './app/views/partials/nav.html'
	};
});

app.directive('filtersWatches', function() {
	return {
		templateUrl: './app/views/partials/filters-watches.html'
	};
});

app.directive('filtersUniverses', function() {
	return {
		templateUrl: './app/views/partials/filters-universes.html'
	};
});