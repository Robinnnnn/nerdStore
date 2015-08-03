app.directive('itemDetail', function(Review) {
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/item/item.detail.html',
		scope: {
			item: '='
		},
		link: function(scope) {
			scope.item.price /= 100;
		}
	};
});
