/**
 * Created by Tim on 11/6/2014.
 */
angular.module("GrooveApp", ["firebase"])
    .controller("MainCtrl", function($scope, $firebase) {
        var ref = new Firebase("https://groovebmp.firebaseio.com/bpm_playlist");
        var sync = $firebase(ref);
        // create a synchronized array for use in our HTML code
        $scope.bpmSong = sync.$asArray();
        $scope.songID = $scope.bpmSong[0];
    })
    .directive('flashWidget', function(){
        return{
            restrict: 'E',
            scope: {id: '='},
            template: '<object width="250" height="40">'+
            '<embed src="http://grooveshark.com/songWidget.swf" type="application/x-shockwave-flash" width="250" height="40" flashvars="hostname=cowbell.grooveshark.com&songIDs={{id[0].$id}}&style=metal&p=0" allowscriptaccess="always" wmode="window"></embed>'+
            '</object>'
        }
    });