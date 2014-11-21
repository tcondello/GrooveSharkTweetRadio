/**
 * Created by Tim on 11/12/2014.
 */
var express = require("express");
var http = require("http");
var Twit = require("twit");
var Firebase = require("firebase");
var T = new Twit({
    consumer_key:         'tQBgTC7WSC2YKDYkdQgDCPVtx'
    , consumer_secret:      'xpMbSpmSy6d4HpKT0VFch70YNqBhTydDSXbrfW3137KJw9iI4C'
    , access_token:         '1374765799-O40L3jHmUeEVZbSpzaLiLLxyGlQgRPbSgSLtaVX'
    , access_token_secret:  'OYwgOSuqLpfiOtta5n3EpVP4u4debCClsfEEaWgNwqqGh'
});
var BPM = "bpm_playlist";
var myFirebaseRef = new Firebase("https://groovebmp.firebaseio.com/" + BPM);

function TinySong (A, S){
    //var TinyKey = "f6834955de245c39810cf059ce77da5d";
    var TinyKeyFPCON = "5ab99277ab6695b1fe456a9c2132a4ab";
    A = A.replace(/ /g,"+");
    S = S.replace(/ /g,"+");
    var url = 'http://tinysong.com/b/' + A + "+" + S + '?format=json&key=' + TinyKeyFPCON;
    http.get(url, function(res){
        var data = '';
        res.on('data', function (chunk){
            data += chunk;
        });
        res.on('end', function(){
            var obj = JSON.parse(data);
            if(typeof obj["error"] != 'undefined'){
                console.log('<======================ERROR WITH TINYSONG================================>');
                console.log('<======================ERROR WITH TINYSONG================================>');
                console.log('ERROR: ' + obj['error']);
                console.log('<======================ERROR WITH TINYSONG================================>');
                console.log('<======================ERROR WITH TINYSONG================================>');
            }else{
                ParseTinySong(obj);
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
    }else{
        console.log("Nothing here");
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
T.get('statuses/user_timeline', { screen_name: BPM, count: 10 }, function(err, data) {
    data.forEach(function(values){
        var tweet = values.text;
        splitTweet(tweet);
    });
});



//WORKING BELOW THIS LINE
var app = express();

app.use(express.static(__dirname + '/public'));

//Start the server on port 3000
app.listen(process.env.PORT || 3000);

//Print out a nice message so you know that the server started
console.log('Server running on port 3000');