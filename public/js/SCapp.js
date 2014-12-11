/**
 * Created by Tim on 11/6/2014.
 */
angular.module("GrooveApp", ["firebase"])
    .controller("MainCtrl", function($scope, $firebase) {
        var ref = new Firebase("https://groovebmp.firebaseio.com/SoundCloud");
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
                    elem.html('<iframe width="100%" height="50%" scrolling="no" frameborder="no"' +
                        'src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + song.$id +
                        '&amp;color=ff6600&amp;auto_play=true&amp;show_artwork=true"></iframe>'
                    );
                }
                scope.$watch(scope.song, function(value) {
                    updateDom(value)
                });
            }
        }
    });