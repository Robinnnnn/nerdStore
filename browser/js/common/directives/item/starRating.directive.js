app.directive('starRating',function(){
	return {
		restrict:'A',
		template:'<ul class="rating">' +'<li ng-repeat="star in stars" ng-class="star">' +'\u2605' +'</li>' +'</ul>',
        scope:{
        	rating:'=',
        	max:'='
        },
        link:function(scope,elem,attrs){
        	scope.stars= [];
        	// scope.stars.push
        	for (var i = 0; i < scope.max; i++) {
                scope.stars.push({
                    filled: i < scope.rating
                });
            }
        }
	}

})