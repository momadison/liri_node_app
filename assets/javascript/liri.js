//REQUIRE
require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var inquirer = require("inquirer")
var Spotify = require("node-spotify-api");
var moment = require("moment")
var fs = require("fs");
const opn = require('opn');


//OMDB request function
function queryOmdb (search) {
    console.log("http://www.omdbapi.com/?t="+search+"&y=&plot=short&apikey=" +keys.omdb);
    key = JSON.stringify(keys.omdb).split('"');
    if (search === "") {
        search = "Mr. Nobody.";
    }
    axios.get("http://www.omdbapi.com/?t="+search+"&y=&plot=short&apikey=" + key[3]).then(
        function(response) {


            console.log('\n***************************************\n');
            console.log("The movie's title is: " + response.data.Title);
            console.log("This movie was released on: "+ response.data.Released);
            console.log("The movie's imdb rating is: " + response.data.imdbRating);
            console.log("Rotten Tomatoes rated this movie a: ", response.data.Ratings[1].Value);
            console.log("This movie was produced in: " + response.data.Country);
            console.log("The main language of the movie is: " + response.data.Language);
            console.log("The plot of the movie is: " + response.data.Plot);
            console.log("The movie's actor's are: " + response.data.Actors);
            console.log('\n****************************************\n');
            
            let rightNow = moment().format("MMMM Do YYYY, h:mm:ss a")
            fs.appendFile("log.txt","\n" + rightNow + "\nOMDB Search - "+ search ,  function(err) {if(err){return console.log(err)}});
        }
    );
}

//Spotify request function
function querySpotify (search) {
    var spotify = new Spotify(keys.spotify);
    if (search === "") {search = "Biking"}

    spotify.search({ type: 'track', query: search, limit: 1 }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

      console.log('\n---------------------------------------------------\n');
      console.log("\nArtist: ", data.tracks.items[0].artists[0].name);
      console.log("Song Name: ", data.tracks.items[0].name);
      console.log("Preview Link: ", data.tracks.items[0].preview_url);
      console.log("Album: ", data.tracks.items[0].album.name);
      console.log('\n---------------------------------------------------\n');

      let rightNow = moment().format("MMMM Do YYYY, h:mm:ss a")
            fs.appendFile("log.txt","\n" + rightNow + "\nSpotify Search - "+ search ,  function(err) {if(err){return console.log(err)}});

      opn(data.tracks.items[0].uri);
    });
      
}

//Bands in town function
function queryBands (search) {
    console.log(keys.bands);
    if (search === ""){search = "Maroon5"}
    axios.get("https://rest.bandsintown.com/artists/" + search + "/events?app_id="+ keys.bands).then(
        function(response) {
            console.log("\n::::::::::" + search.toUpperCase() + "::::::::::\n");
            for (var i = 0; i < response.data.length; i++) {
                eventDate = response.data[i].datetime;
                eventDate = moment(eventDate).format("MM/DD/YYYY");
                console.log("-----" + response.data[i].venue.name + "-----");
                console.log("..." + response.data[i].venue.city + ", " + response.data[i].venue.country + "...");
                console.log(" ||  " + eventDate + "  || \n");
        }
    });
    let rightNow = moment().format("MMMM Do YYYY, h:mm:ss a")
            fs.appendFile("log.txt","\n" + rightNow + "\nBand Search - "+ search ,  function(err) {if(err){return console.log(err)}});
}

console.log("\n*********************************************************");
console.log("*******************-------*******************************")
console.log("*******************-------*******************************")
console.log("*******************-------*******************************")
console.log("*******************-------*******************************")
console.log("*******************-------*******************************")
console.log("*******************-------|||||||||||********************")
console.log("*******************-------|||||||||||********************")
console.log("*******************-------|||||||||||********************")
console.log("*********************************************************\n");

//Inquirer Prompt
inquirer.prompt([
    {
        type:       "list",
        message:    "What would you like me to do?",
        choices:    ["Concert This", "Spotify this song", "Movie This", "Do What It Says"],
        name:       "toDo"
    }
]).then (function(inquirerResponse) {
    switch (inquirerResponse.toDo) {
        case "Movie This":
            inquirer.prompt([
                {
                    type:       "input",
                    message:    "What movie would you like to review?",
                    name:       "movieUserPick"
                }
            ]).then (function(movieResponse) {
                queryOmdb(movieResponse.movieUserPick);
            })
            break;
        case "Spotify this song":
            inquirer.prompt([
                {
                    type:       "input",
                    message:    "What song would you like to look up?",
                    name:       "songUserPick"
                }
            ]).then (function(inquirerResponse) {
                querySpotify(inquirerResponse.songUserPick);
            })
            break;
        case "Concert This":
            inquirer.prompt([
                {
                    type:       "input",
                    message:    "What band would you like to follow?",
                    name:       "bandSchedule"
                }
            ]).then (function(bandResponse) {
                queryBands(bandResponse.bandSchedule);
            })
            break;
        case "Do What It Says":
            fs.readFile("random.txt", "utf8", function (error, data) {
                if (error) {
                    return console.log(error);
                }
                let command = data.split(",");
                for( var i = 0; i < command.length; i += 2){ 
                    
                    if (command[i].trim() === "spotify-this-song") {
                        querySpotify(command[i+1].trim());
                    }

                    else if (command[i].trim() === "concert-this") {
                        queryBands(command[i+1].trim());
                    }

                    else if (command[i].trim() === "movie-this") {
                        queryOmdb(command[i+1].trim());
                    }
                    
                }
            });
    }
})