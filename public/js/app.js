/**
 * Created by Tim on 11/6/2014.
 */
angular.module("GrooveApp", ["firebase"])
    .controller("MainCtrl", function($scope, $firebase) {
        var ref = new Firebase("https://groovebmp.firebaseio.com/bpm_playlist");
        var sync = $firebase(ref);
        // create a synchronized array for use in our HTML code
        $scope.bpmSong = sync.$asArray();
    })
    .directive('flashWidget', function(){

        return {
            restrict: 'E',
            controller: 'MainCtrl',
            scope: {
                width:'=',
                height:'=',
                src: '=',
                songID: '='
            },
            template: '<object width="250" height="40">'+
            '<param name="movie" value="http://grooveshark.com/songWidget.swf">'+
                '<param name="wmode" value="window">'+
            '<param name="allowScriptAccess" value="always">'+
                '<param name="flashvars"value="hostname=cowbell.grooveshark.com&amp;songIDs="{{songID}}"&amp;style=metal&amp;p=0">'+
            '<embed src="http://grooveshark.com/songWidget.swf" type="application/x-shockwave-flash"width="250"height="40"flashvars="hostname=cowbell.grooveshark.com&amp;songIDs="{{songID}}"&amp;style=metal&amp;p=0" allowscriptaccess="always" wmode="window"></embed>'+
                '</object>'
        }
    });
