// add code to read and set any environment variables with the dotenv package:
// require("dotenv").config();

// Add the code required to import the `keys.js` file and store it in a variable
// var keys = require("./keys.js");

// You should then be able to access your keys information like so
// var spotify = new Spotify(keys.spotify);
// ==================

// Include the axios npm package (Don't forget to run "npm install axios" in this folder first!)
var command = process.argv[2];
var query = process.argv[3];
var axios = require("axios");
var commandFound = true;
var movieFields = [
  "Title",
  "Year",
  "imdbRating",
  "Rated",
  "Country",
  "Language",
  "Plot",
  "Actors"
];
var eventFields = ["name", "country", "region", "city","datetime"];

switch (command) {
  case "concert-this":
    var apiURI =
      "https://rest.bandsintown.com/artists/" +
      query +
      "/events?app_id=codingbootcamp";
    break;
  case "movie-this":
    var apiURI =
      "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy";
    break;
  default:
    console.log("Sorry - command not understood.");
    commandFound = false;
}
if (commandFound) {
  axiosGet(apiURI);
}

function outputMovieInfo(apiResponse, fields) {
  for (var i = 0; i < fields.length; i++) {
    console.log(fields[i] + ": " + apiResponse.data[fields[i]]);
  }
}

function outputEventInfo(apiResponse, fields) {
  for (var i = 0; i < apiResponse.data.length; i++) {
    console.log("===========================================")
    for (var x = 0; x < fields.length-1; x++) {
      console.log(fields[x] + ": " + apiResponse.data[i].venue[fields[x]]);
    }
    var date = apiResponse.data[i][fields[fields.length-1]];
    // var date = date.getMonth();
    console.log(fields[fields.length-1] + ": " + date);
  }
  debugger;
}

// Then run a request with axios to the OMDB API with the movie specified
function axiosGet(url) {
  axios
    .get(url)
    .then(function(response) {
      if (command === "movie-this") {
        outputMovieInfo(response, movieFields);
      } else {
        outputEventInfo(response, eventFields);
      }
    })
    .catch(function(error) {
      onError(error);
    });
}

function template() {
  axios
    .get(
      "http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy"
    )
    .then(function(response) {
      console.log("The movie's rating is: " + response.data.imdbRating);
    })
    .catch(function(error) {
      onError(error);
    });
}

// ===============================================
function onError(error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log("---------------Data---------------");
    console.log(error.response.data);
    console.log("---------------Status---------------");
    console.log(error.response.status);
    console.log("---------------Status---------------");
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an object that comes back with details pertaining to the error that occurred.
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message);
  }
  console.log(error.config);
}
