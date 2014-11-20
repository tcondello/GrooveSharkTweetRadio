/**
 * Created by Tim on 11/6/2014.
 */
var groove = angular.module("groove", []);

groove.controller("AppCtrl",['$scope', '$http', function($scope, $http){
    $scope.results = [];

//     $scope.search = function(Song){
//         $scope.results.push($scope.Song);
//     };

    $scope.search = function() {
        /* the $http service allows you to make arbitrary ajax requests.
         * in this case you might also consider using angular-resource and setting up a
         * User $resource. */
        $http.get('/question', { params: Song },
            function(response) { $scope.results = response; },
            function(failure) { console.log("failed:" + failure);}
        )};
}]);

groove.controller("ApiCtrl", ['$scope', '$resource', function($scope, $resource){
    var TwitterAPI = $resource("http://search.twitter.com/search.json",
        { callback: "JSON_CALLBACK"},
        {get: { method: "JSONP" }});
    $scope.search = function(){
        $scope.searchResult = TwitterAPI.get({ q: $scope.searchTerm});
    };

}]);

groove.controller("PostCtrl", function($scope, $http){
    $http.get('http://ec2-54-90-254-168.compute-1.amazonaws.com/blotter/mark/CouncilDistrict.json').
        success(function(data, status, headers, config) {
            $scope.posts = data;
        }).
        error(function(data, status, headers, config) {
            // log error
        });
});
