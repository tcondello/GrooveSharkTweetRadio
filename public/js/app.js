/**
 * Created by Tim on 11/6/2014.
 */
var app = angular.module("sampleApp", ["firebase"]);
app.controller("SampleCtrl", function($scope, $firebase) {
    var ref = new Firebase("https://groovebmp.firebaseio.com/");
    var sync = $firebase(ref);
    // create a synchronized array for use in our HTML code
    $scope.messages = sync.$asArray();
});