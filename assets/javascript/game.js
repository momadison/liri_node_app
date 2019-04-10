//GET NPM PACKAGES
var axios = require("axios");
var inquirer = require("inquirer")


//OMDB request function
function queryOmdb (search) {
    axios.get("http://www.omdbapi.com/?t="+search+"&y=&plot=short&apikey=trilogy").then(
        function(response) {
            console.log("The movie's title is: " + response.data.Title);
            console.log("The movie's actor's are: " + response.data.Actors);
            console.log("The movie's imdb rating is: " + response.data.imdbRating);
            return response;
        }
    );
}


//Inquirer Prompt
inquirer.prompt([
    {
        type:       "list",
        message:    "What would you like me to do?",
        choices:    ["Look up Movie", "Search Spotify for Songs", "Look for Concerts"],
        name:       "toDo"
    }
]).then (function(inquirerResponse) {
    switch (inquirerResponse.toDo) {
        case "Look up Movie":
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
        case "Search Spotify for Songs":
            console.log("Search spotify");
            break;
        case "Look for Concerts":
            console.log("look for concerts");
            break;
    }
})