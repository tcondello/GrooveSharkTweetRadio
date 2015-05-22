/**
 * Created by Tim on 11/12/2014.
 */
//var express = require("express");
var http = require("http");
var Twit = require("twit");
var Firebase = require("firebase");
var T = new Twit({
    consumer_key:         '',
    consumer_secret:      '',
    access_token:         '',
    access_token_secret:  ''
});
var BPM = "bpm_playlist";
var countEntered = 0;
var countSkipped = 0;
var myFirebaseRef = new Firebase("https://groovebmp.firebaseio.com/" + BPM);

function TinySong (A, S){
    //var TinyKey = "*******************************";
    A = A.replace(/ /g,"+");
    S = S.replace(/ /g,"+");
    var url = 'http://tinysong.com/b/' + A + "+" + S + '?format=json&key=*******************';
    http.get(url, function(res){
        var data = '';
        res.on('data', function (chunk){
            data += chunk;
        });
        res.on('end', function(){
            var obj = JSON.parse(data);
            if(typeof obj['error'] != 'undefined'){
                console.log('===============================');
                console.log('ERROR: ' + obj['error']);
                console.log('===============================');
            }else{
                ParseTinySong(obj)
            }
        });
    });
}
function ParseTinySong (obj){
    var SongID = obj["SongID"];
    var SongName = obj["SongName"];
    var ArtistName = obj["ArtistName"];
    var AlbumName = obj["AlbumName"];
    if(typeof SongID != 'undefined'){
        var Songs = myFirebaseRef.child(SongID);
        Songs.set({
            ArtistName: ArtistName,
            SongName: SongName,
            AlbumName: AlbumName
        });
        countEntered = countEntered + 1;
    }else{
        countSkipped = countSkipped + 1;
    }
}
function splitTweet(TweetToSplit) {
    var arrayOfTweets = TweetToSplit.split("-");
    var ArtistsStr = arrayOfTweets[0];
    var SongStr = arrayOfTweets[1];
    var SongNm = SongStr.split("playing");
    var Song = SongNm[0].trim();
    var ArtistsNm = ArtistsStr.split("/");
    TinySong(ArtistsNm[0], Song);
}
function start(x) {
    T.get('statuses/user_timeline', {screen_name: BPM, count: x}, function (err, data) {
        data.forEach(function (values) {
            var tweet = values.text;
            splitTweet(tweet);
        });
    });
}
start(1000);
console.log('# added to FireBase= ' + countEntered);
console.log('# skipped = ' + countSkipped);
