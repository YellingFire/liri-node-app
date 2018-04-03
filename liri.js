//initiate the calling of the .env file that holds potentially sensitive material
require("dotenv").config();
// initiate the npm for twitter
var Twitter = require("twitter");
// initiate the key.js page
var keys = require("./keys.js");
var userChoice = process.argv[2];
var twitterUsername = process.argv[3];

// create a local instance for twitter client
var client= new Twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
});

// Function for pulling tweets from the @JavarushChad timeline--change out @JavarushChad to global variable "twitterUsername" above to enter username as arg[3]
function getTweets(){
    client.get('statuses/user_timeline', {screen_name: "@JavarushChad"}, function(error, tweets, response) {

        for (i = 0; i < tweets.length; i++) {
            console.log(tweets[i].text + "\n" + tweets[i].created_at + "\n");
        };
        // console.log(tweets[0].text);
        // console.log(tweets[0].created_at);
     });
};

//Start the logic to hand the arguments entered by user
if (userChoice === "my-tweets") {
    getTweets();
}

