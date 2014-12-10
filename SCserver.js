/**
 * Created by Tim on 11/12/2014.
 */
//var express = require("express");
var http = require("http");
var Twit = require("twit");
var Firebase = require("firebase");
var T = new Twit({
    consumer_key:         'tQBgTC7WSC2YKDYkdQgDCPVtx',
    consumer_secret:      'xpMbSpmSy6d4HpKT0VFch70YNqBhTydDSXbrfW3137KJw9iI4C',
    access_token:         '1374765799-O40L3jHmUeEVZbSpzaLiLLxyGlQgRPbSgSLtaVX',
    access_token_secret:  'OYwgOSuqLpfiOtta5n3EpVP4u4debCClsfEEaWgNwqqGh'
});
var myFirebaseRef = new Firebase("https://groovebmp.firebaseio.com/SoundCloud");

function SoundSong (A, S){
    var SoundKey = "acefae469fefbc074fb7ad9bb480a56d";
    var xtraKey = "4346c8125f4f5c40ad666bacd8e96498";
    S = S.replace(/ /g,"+");
    var url = 'http://api.soundcloud.com/tracks.json?client_id=' + SoundKey + '&q=' + S +'&limit=1';
    http.get(url, function(res){
        var data = '';
        res.on('data', function (chunk){
            data += chunk;
        });
        res.on('end', function(){
            var obj = JSON.parse(data);
            //console.log(obj[0]);
            ParseSoundSong(obj);

//            if(typeof obj['error'] != 'undefined'){
//                console.log('===============================');
//                console.log('ERROR: ' + obj['error']);
//                console.log('===============================');
//            }else{
//                
//            }
        });
    });
}
function ParseSoundSong (obj){
    if(typeof obj[0] != 'undefined'){
        var id = obj[0].id;
        var SongName = obj[0].title;
        var uri = obj[0].uri;
        if(typeof uri === 'undefined'){
            uri = 'null';
        }
        var Songs = myFirebaseRef.child(id);
        Songs.set({
            uri: uri,
            SongName: SongName
        });
    }else{
        console.log(obj);
    }
}
function splitTweet(TweetToSplit) {
    var regexObj = /@/g;
    var arrayOfTweets = TweetToSplit.split("-");
    var ArtistsStr = arrayOfTweets[0];
    var SongStr = arrayOfTweets[1];
    var SongNm = SongStr.split("playing");
    var Song = SongNm[0].trim();
    var ArtistsNm = ArtistsStr.replace(/\//g,"+");
    var ArtistsNm = ArtistsNm.trim().replace(/ /g,"+");
    res = regexObj.test(ArtistsNm);
    if (SongNm != "") {
        if (res) {
            console.log("BPM Advertisement")
        } else {
            SoundSong(ArtistsNm, Song);
        }
    }else{
        console.log("Empty")
    }
}
function start(Tuser, x) {
    T.get('statuses/user_timeline', {screen_name: Tuser, count: x}, function (err, data) {
        data.forEach(function (values) {
            var tweet = values.text;
            splitTweet(tweet);
//             console.log(tweet);
        });
    });
}
start("bpm_playlist", 2000);