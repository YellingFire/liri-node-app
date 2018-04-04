//initiate the calling of the .env file that holds potentially sensitive material
require("dotenv").config();
// initiate the npm for twitter
var Twitter = require("twitter");
//intiate the npm for spotify
var Spotify = require("node-spotify-api");
// initiate the key.js page
var keys = require("./keys.js");
//initiate request npm
var request = require('request');
var userChoice = process.argv[2];
var secondQuery = process.argv[3];

// create a local instance for twitter client
var client= new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
});
// create a local instance for spotify
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
  });

 //Function for pulling movies in 
function getMovies(){
    request("http://www.omdbapi.com/?apikey=trilogy&t=" + secondQuery, function(error, response) {
        
        var myResp = JSON.parse(response.body);
        var movTitle = "Title: " + myResp.Title;
        var movYear = "Year: " + myResp.Year;
        var movIMDBRate = "IMDB Rating: " + myResp.Ratings[1].Value;
        var movRottRate = "Rotten Tomatoes: " + myResp.Ratings[1].Value;
        var movCountProd = "Country: " + myResp.Country;
        var movLang = "Language: " + myResp.Language;
        var movPlot = "Plot: " + myResp.Plot;
        var movActors = "Actors: " + myResp.Actors;

        if (error) {
            return console.log("error: ", error);;
        }

        else {
            console.log(`
            ${movTitle}
            ${movYear}
            ${movIMDBRate}
            ${movRottRate}
            ${movCountProd}
            ${movLang}
            ${movPlot}
            ${movActors}`)
        }        
    })
};
//END getMovies()--  

//Function for no Movie selected
function noMovieSelected() {
    request("http://www.omdbapi.com/?apikey=trilogy&t=Mr.+Nobody", function(error, response) {

        var myResp = JSON.parse(response.body);
        var movTitle = "Title: " + myResp.Title;
        var movYear = "Year: " + myResp.Year;
        var movIMDBRate = "IMDB Rating: " + myResp.Ratings[1].Value;
        var movRottRate = "Rotten Tomatoes: " + myResp.Ratings[1].Value;
        var movCountProd = "Country: " + myResp.Country;
        var movLang = "Language: " + myResp.Language;
        var movPlot = "Plot: " + myResp.Plot;
        var movActors = "Actors: " + myResp.Actors;

        if (error) {
            return console.log("error: ", error);;
        }

        else {
            console.log(`
            ${movTitle}
            ${movYear}
            ${movIMDBRate}
            ${movRottRate}
            ${movCountProd}
            ${movLang}
            ${movPlot}
            ${movActors}`)
        }
    });
};
//END noMovieSelected()--

// Function for pulling tweets from the @JavarushChad timeline--change out @JavarushChad to global variable "secondQuery" above to enter username as arg[3]
function getTweets(){
    client.get("statuses/user_timeline", {screen_name: "@JavarushChad"}, function(error, tweets, response) {

        for (i = 0; i < tweets.length; i++) {
            var tweeties = tweets[i].text;
            var createdTweetiesAt = tweets[i].created_at
            // console.log(tweets[i].text + "\n" + tweets[i].created_at + "\n");
            console.log(`
            ${tweeties}
            ${createdTweetiesAt}`)
        };
        // console.log(tweets[0].text);
        // console.log(tweets[0].created_at);
     });
};
//END getTweets()--

//Need to handle if no secondQuery query is entered
function getSpotify(){
    spotify.search({ type: "track", query: secondQuery, limit: 10 }, function(err, data) {
        var spotArtist= data.tracks.items[0].artists[0].name;
        var spotSongName= data.tracks.items[0].name;
        var spotPreview= data.tracks.items[0].preview_url;
        var spotAlbum= data.tracks.items[0].album.name;

        if (err) {
            return console.log("Error occurred: " + err);
        }

        else {
            console.log(`
            ${spotArtist}
            ${spotSongName}
            ${spotPreview}
            ${spotAlbum}`);
        }

    });
};
//END getSpotify()--

//If no secondQuery is passed run this function
function noSongPassed(){
    spotify.search({type: "track", query: "Ace of Base: The Sign"}, function(err, data) {
        var spotArtistDef= data.tracks.items[0].artists[0].name;
        var spotSongNameDef= data.tracks.items[0].name;
        var spotPreviewDef= data.tracks.items[0].preview_url;
        var spotAlbumDef= data.tracks.items[0].album.name;

        if (err) {
            return console.log("Error occurred: " + err);
        }

        else {
            console.log(`
            ${spotArtistDef}
            ${spotSongNameDef}
            ${spotPreviewDef}
            ${spotAlbumDef}`);
        }

        
    });
};
//END noSongPassed()--


//Start the logic to handle the arguments entered by user
//twitter case
if (userChoice === "my-tweets") {
    getTweets();
}

//spotify NO secondQuery case
else if (userChoice === "spotify-this-song" && secondQuery === undefined || null || "") {
    noSongPassed();
}

//spotify case
else if (userChoice === "spotify-this-song") {
    getSpotify();
   
}

//Movie NO secondQuery case
else if (userChoice === "movie-this" && secondQuery === undefined || null || "") {
    noMovieSelected();
}

//get movie case
else if (userChoice === "movie-this") {
    getMovies();
}


