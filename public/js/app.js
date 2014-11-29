/**
 * Created by Tim on 11/6/2014.
 */
angular.module("GrooveApp", ["firebase"])
    .controller("MainCtrl", function($scope, $firebase) {
        var ref = new Firebase("https://groovebmp.firebaseio.com/bpm_playlist");
        var sync = $firebase(ref);
        // create a synchronized array for use in our HTML code
        $scope.Song = sync.$asArray();
        $scope.count =0;
        $scope.selectedSong = {};
        $scope.currentSong = function(){return $scope.selectedSong ; };

        $scope.selectSong = function (i){
            $scope.selectedSong = $scope.Song[i];
        };
        $scope.nextSong = function(){
            $scope.count = $scope.count + 1
        };
    })
    .directive('flashWidget', function(){
        return{
            restrict: 'E',
            scope: {song: '&'},

            link: function(scope, elem) {

                function updateDom(song){
                    if (song.$id == undefined)
                        return;
                    elem.html('<object width="250" height="40">'+
                    '<embed src="http://grooveshark.com/songWidget.swf" type="application/x-shockwave-flash" width="250" height="40" flashvars="hostname=cowbell.grooveshark.com&songIDs=' +
                    song.$id +
                    '&style=metal&p=1" allowscriptaccess="always" wmode="window"></embed>'+
                    '</object>');

                }
                scope.$watch(scope.song, function(value) {
                    updateDom(value)
                });
        }
    }
});
