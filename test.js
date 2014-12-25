/**
 * Created by Mac-astr010 on 12/14/14.
 */
var http = require("http");
var Twit = require("twit");
var Firebase = require("firebase");
var CronJob = require('cron').CronJob;
var moment = require('moment');
var T = new Twit({
    consumer_key:         'tQBgTC7WSC2YKDYkdQgDCPVtx',
    consumer_secret:      'xpMbSpmSy6d4HpKT0VFch70YNqBhTydDSXbrfW3137KJw9iI4C',
    access_token:         '1374765799-O40L3jHmUeEVZbSpzaLiLLxyGlQgRPbSgSLtaVX',
    access_token_secret:  'OYwgOSuqLpfiOtta5n3EpVP4u4debCClsfEEaWgNwqqGh'
});
var myFirebaseRef = new Firebase("https://groovebmp.firebaseio.com/SoundCloud");

start("bpm_playlist", 3);

function start(Tuser, x) {
    T.get('statuses/user_timeline', {screen_name: Tuser, count: x}, function (err, data) {
        data.forEach(function (values) {
            var tweet = values.text;
            var tweetData = new ParsedTweet(tweet);
            if (tweetData.isAdvertisement) return;
            getSoundInfo(tweetData.songNm, tweetData.artistsNm, function(err, data) {
                if (err) return;
                var soundInfo = parseSoundSong(data);
                if (!soundInfo) return;
                var songs = myFirebaseRef.child(soundInfo.id);
                songs.set({
                    uri: soundInfo.uri,
                    SongName: soundInfo.SongName,
                    Date: soundInfo.Date,
                    Tweet: tweet
                });
            });
        });
    });
}

function ParsedTweet(tweet) {
    var arrayOfTweets = tweet.split("-");

    //this.tweet = tweet;
    this.artistsStr = arrayOfTweets[0];
    this.songStr = arrayOfTweets[1];
    this.songNm = this.songStr.split("playing");
    this.song = this.songNm[0].trim();
    this.artistsNm = artistsStr.replace(/\//g,"+").trim().replace(/ /g,"+");
    this.isAdvertisement = !!/@/g.test(this.artistsNm);
}

function getSoundInfo(songName, artistName, fn) {
    var soundKey = "acefae469fefbc074fb7ad9bb480a56d";
    var song = songName.replace(/ /g,"+");
    var artist = artistName.replace(/ /g,"+");
    var url = 'http://api.soundcloud.com/tracks.json?client_id=' + soundKey + '&q=' + artist + song +'&limit=1';
    http.get(url, function(res){
        var data = '';
        res.on('data', function (chunk){
            data += chunk;
        });
        res.on('end', function(){
            var obj = JSON.parse(data);
            if(typeof obj.errors != 'undefined'){
                console.log('ERROR: ' + obj.errors[0].error_message);
                fn(obj.errors);
            } else{
                fn(0, obj);
            }
        });
        res.on('error', function(err) {
            fn(err);
        });
    });
}

function parseSoundSong(obj) {
    if(typeof obj[0] != 'undefined'){
        var result = {};
        result.id = obj[0].id;
        result.SongName = obj[0].title;
        result.uri = obj[0].uri;
        result.Date = moment().format('l h:mm:ss a');
        if(typeof result.uri === 'undefined'){
            result.uri = 'null';
        }
        return result;
    } else {
        return null;
    }
}