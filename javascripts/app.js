$(document).ready(function(){
	$('#searchBar').click(function(){
		$("#searchModal").modal('show');
	});
	$('#modal-searchBar').keyup(function(e){
		if($(e.target).val() == ''){
			$('#clearSearch').css("display","none");
		} else {
			$('#clearSearch').css("display","block");
		}
	});
	$('#clearSearch').click(function(){
		$('#modal-searchBar').val("").focus();
		$('.initialContent').css("display","block");
		$('.searchContent').css("display","none");

	})
});
var user = angular.module('user',['ngSanitize','ngAnimate']);
user.controller('MainController',['$scope','$timeout','jsonLoad',function($scope,$timeout,jsonLoad){
	$scope.searchResult={};
	$('#searchInput').click(function(){
		$timeout(function(){
			jsonLoad('data_given/Recent-Popular-search-(default).json').then(function(response){
		$scope.recent=response.data.recent;
		$scope.popular = response.data.popular;
	});
		},500);
	})
	$scope.highlight=function(e){
		$(e.currentTarget).addClass('highlight-text');
		$(e.currentTarget).find('.subtext').addClass('highlight-subtext');
	}
	$scope.removeHighlight=function(e){
		$(e.currentTarget).removeClass('highlight-text');
		$(e.currentTarget).find('.subtext').removeClass('highlight-subtext');
	}
}]);
user.factory('jsonLoad',['$http',function($http){
	return function(url){
		return $http.get(url);
		};
}]);
user.directive('showSearchResults',['jsonLoad',function(jsonLoad){
	return{
		restrict: 'A',
		require: 'ngModel',
		link: function(scope,element,attrs,ngModelCrl){
			scope.$watch('searchText',function(value){
				if (value && value.toLowerCase() === 'sin'){
					jsonLoad('data_given/auto_complete-sin.json').then(function(response){
						$('.initialContent').css("display","none");
						$('.searchContent').css("display","block");
						scope.searchResult.data= response.data.results;
					})
				}
				if(value && value.toLowerCase() === 'kuala'){
					jsonLoad('data_given/auto_complete-kuala.json').then(function(response){
						$('.initialContent').css("display","none");
						$('.searchContent').css("display","block");
						scope.searchResult.data= response.data.results;
					})
				}
				if(value === ''){
					$('.initialContent').css("display","block");
					$('.searchContent').css("display","none");
				}
			})
		}
	}
}]);
user.filter('highlight',function(){
	return function(first,second){
		if(first.toLowerCase().indexOf(second) >=0 ){
			var startIndex = first.toLowerCase().indexOf(second);
			var second = first.substring(startIndex,startIndex+second.length);
			var newStr = first.replace(second,replacer);
			function replacer(match){
				return '<span class="bold">'+match+'</span>'
			}
			return '<span>'+ newStr +'</span>'
		} else {
		return first;
		}	
	}
})
