/**
 * Created by Tim on 11/12/2014.
 */
var express = require("express");
var http = require("http");
var Twit = require("twit");
var T = new Twit({
    consumer_key:         'tQBgTC7WSC2YKDYkdQgDCPVtx'
    , consumer_secret:      'xpMbSpmSy6d4HpKT0VFch70YNqBhTydDSXbrfW3137KJw9iI4C'
    , access_token:         '1374765799-O40L3jHmUeEVZbSpzaLiLLxyGlQgRPbSgSLtaVX'
    , access_token_secret:  'OYwgOSuqLpfiOtta5n3EpVP4u4debCClsfEEaWgNwqqGh'
});



function splitTweet(TweetToSplit) {
    var arrayOfTweets = TweetToSplit.split("-");
    var ArtistsStr = arrayOfTweets[0];
    var SongStr = arrayOfTweets[1];
    var SongNm = SongStr.split("playing");
    var Song = SongNm[0].trim();
    var ArtistsNm = ArtistsStr.split("/");
    console.log(ArtistsNm[0], Song);
}
T.get('statuses/user_timeline', { screen_name: 'bpm_playlist', count: 1 }, function(err, data, response) {
    data.forEach(function(values){
        var tweet = values.text;
        splitTweet(tweet);
    });
});



// WORKING BELOW THIS LINE
//var app = express();
//
//app.use(express.static(__dirname + '/public'));

//app.get('/question', function(req, res){
//    res.send(req.body);
//});

// Start the server on port 3000
//app.listen(process.env.PORT || 3000);

// Print out a nice message so you know that the server started
//console.log('Server running on port 3000');