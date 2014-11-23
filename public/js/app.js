/**
 * Created by Tim on 11/6/2014.
 */
var app = angular.module("sampleApp", ["firebase"]);
app.controller("SampleCtrl", function($scope, $firebase) {
    var ref = new Firebase("https://groovebmp.firebaseio.com/bpm_playlist");
    var sync = $firebase(ref);
    // create a synchronized array for use in our HTML code
    $scope.bpmSong = sync.$asArray();
});
//app.directive('GroovePlayer', function() {
//    return {
//        template: '<div style="height: 400px; width:400px;">This is from directive</div>'
//    };
//});