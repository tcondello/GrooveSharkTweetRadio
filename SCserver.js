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
var BPM = "bpm_playlist";
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
//            console.log(obj[0]);
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
       var SongID = obj[0].id;
       var SongName = obj[0].title;
       var Stream_url = obj[0].stream_url;
       if(typeof Stream_url === 'undefined'){
           Stream_url = 'null';
       }   
       var Songs = myFirebaseRef.child(SongID);
       Songs.set({
           Stream_url: Stream_url,
           SongName: SongName,
       });
   }else{
       console.log(obj);
   }
}




function splitTweet(TweetToSplit) {
    var arrayOfTweets = TweetToSplit.split("-");
    var ArtistsStr = arrayOfTweets[0];
    var SongStr = arrayOfTweets[1];
    var SongNm = SongStr.split("playing");
    var Song = SongNm[0].trim();
    var ArtistsNm = ArtistsStr.split("/");
    SoundSong(ArtistsNm[0], Song);
}
function start(x) {
    T.get('statuses/user_timeline', {screen_name: BPM, count: x}, function (err, data) {
        data.forEach(function (values) {
            var tweet = values.text;
            splitTweet(tweet);
        });
    });
}
start(500);
// console.log('# added to FireBase= ' + countEntered);
// console.log('# skipped = ' + countSkipped);
