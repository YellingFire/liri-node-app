//initiate the calling of the .env file that holds potentially sensitive material
require("dotenv").config();
// initiate the npm for twitter
const Twitter = require("twitter");
//intiate the npm for spotify
const Spotify = require("node-spotify-api");
// initiate the key.js page
const keys = require("./keys.js");
//initiate request npm
const request = require('request');
//initiate fs npm
const fs = require('file-system');
//initate inquirer
const inquirer = require('inquirer');
//Global Variables for UI
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
function getMovies(movSearchTerm){
    request("http://www.omdbapi.com/?apikey=trilogy&t=" + movSearchTerm, function(error, response) {
        
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

// Function for pulling tweets from the @JavarushChad timeline--change out @JavarushChad to global variable "secondQuery" above to enter username as arg[3]
function getTweets(){
    client.get("statuses/user_timeline", {screen_name: "@JavarushChad"}, function(error, tweets, response) {

        for (i = 0; i < tweets.length; i++) {
            var tweeties = tweets[i].text;
            var createdTweetiesAt = tweets[i].created_at

            console.log(`
            ${tweeties}
            ${createdTweetiesAt}`)
        };
        
     });
};
//END getTweets()--

function getSpotify(searchTerm){
    spotify.search({ type: "track", query: searchTerm, limit: 10 }, function(err, data) {
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
            ${spotPreview ? spotPreview : "No Preview available"}
            ${spotAlbum}`);
        }

    });
};
//END getSpotify()--

//Function for Do What it Says
function DWIS() {

    fs.readFile("./random.txt", 'utf8', function read(err, data) {

        var spotifyCont = "spotify";
        var twitCont = "twitter";
        var movCont = "movie";
        var content = data;
        var doWhatContent = data.split(",");
        //Handle Errors
        if (err) {
            throw err;
        }
        // console.log(doWhatContent[1])
        // Do What I Say Spotify Case
        else if (content.includes(spotifyCont)) {
            var musicTitle = doWhatContent[1];
            getSpotify(musicTitle);
            
        }
        // Do What I Say Twitter Case
        else if (content.includes(twitCont)) {
            getTweets();
            // console.log("random.txt info includes the word 'twitter' ");
        }
        //Do What I Say Movie Case
        else if (content.includes(movCont)) {
            var movieTitle = doWhatContent[1];
            getMovies(movieTitle);
            // console.log("random.txt info includes the word 'Movie' ");
        };
        
        
        // processData();
    });
};
//END DWIS()--

//Start the logic to handle the arguments entered by user
//twitter case
if (userChoice === "my-tweets") {
    getTweets();
}

//Spotify NO secondQuery case
else if (userChoice === "spotify-this-song" && secondQuery === undefined) {
    var noSecondSpotQuery = "Ace of Base: The Sign";
    getSpotify(noSecondSpotQuery);
}

//Spotify case
else if (userChoice === "spotify-this-song") {
    getSpotify(secondQuery);
   
}

//Movie NO secondQuery case
else if (userChoice === "movie-this" && secondQuery === undefined) {
    var noSecondMovQuery = "Mr.+Nobody";
    getMovies(noSecondMovQuery);
}

//Get movie case
else if (userChoice === "movie-this") {
    getMovies(secondQuery);
}

//Do What it says case
else if (userChoice === "do-what-it-says") {
    DWIS();
};

