var command = process.argv[2];
var query = process.argv.slice(3).join(" "); // Joining the remaining arguments since the query may contain spaces
var axios = require("axios");

switch (command) {
  case "concert-this":
    var apiURI =
      "https://rest.bandsintown.com/artists/" +
      query +
      "/events?app_id=codingbootcamp";
    axiosGet(apiURI);
    break;
  case "movie-this":
    var apiURI =
      "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy";
    axiosGet(apiURI);
    break;
  case "spotify-this-song":
    if (query === "" || query === null || query === undefined) {
      var query = "The Sign";
    }
    outputSpotify(query);
    break;
  case "do-what-it-says":
    outputDWIS();
    break;
  default:
    console.log("Sorry - command not understood.");
}
// =======================================================================
function outputLog(outputData) {
  var fs = require("fs");
  var filename = "log.txt";

  fs.appendFile(filename, "\n" + outputData, function(err) {
    if (err) throw err;
    console.log(outputData);
  });
}
// =======================================================================
function outputDWIS() {
  var fs = require("fs");

  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }
    var dataArr = data.split(",");
    outputSpotify(dataArr[1]);
  });
}
// =======================================================================
function outputSpotify(spotifySearch) {
  // add code to read and set any environment variables with the dotenv package:
  require("dotenv").config();

  // Add the code required to import the `keys.js` file and store it in a variable
  var keys = require("./keys.js");

  // You should then be able to access your keys information like so
  var Spotify = require("node-spotify-api");
  var spotify = new Spotify(keys.spotify);
  spotify.search({ type: "track", query: '"' + spotifySearch + '"' }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    }

    var tracks = data.tracks;
    for (var i = 0; i < data.tracks.items.length; i++) {
      var showData = [
        "Artists:\t\t" + tracks.items[i].album.artists[0].name,
        "Song name:\t\t" + tracks.items[i].name,
        "Album:\t\t\t" + tracks.items[i].album.name,
        "Preview Song:\t\t" + tracks.items[i].preview_url,
        "==========================================="
      ].join("\n");
      outputLog(showData);
    }
  });
}
// =======================================================================
function outputMovieInfo(apiResponse) {
  var showData = [
    "Title:\t\t" + apiResponse.data.Title,
    "Release Year:\t" + apiResponse.data.Year,
    "IMDB Rating:\t" + apiResponse.data.imdbRating,
    "Rotten Tomatoes Rating:\t" + apiResponse.data.Ratings[1].Value,
    "Country:\t" + apiResponse.data.Country,
    "Language:\t" + apiResponse.data.Language,
    "Plot:\t\t" + apiResponse.data.Plot,
    "Actors:\t\t" + apiResponse.data.Actors,
    "==========================================="
  ].join("\n");
  outputLog(showData);
}
// =======================================================================
function outputConcertInfo(apiResponse) {
  for (var i = 0; i < apiResponse.data.length; i++) {
    var location = apiResponse.data[i].venue.city + ", ";
    location += apiResponse.data[i].venue.region;
    location += " (" + apiResponse.data[i].venue.country + ")";

    var showData = [
      "Venue:\t\t" + apiResponse.data[i].venue.name,
      "Location:\t" + location,
      "Date:\t\t" + shortDate(apiResponse.data[i].datetime),
      "==========================================="
    ].join("\n");
    outputLog(showData);
  }
}
// =======================================================================
function shortDate(datetime) {
  var sDate = datetime
    .split("T", 1)
    .toString()
    .split("-");

  return sDate[1] + "/" + sDate[2] + "/" + sDate[0];
}
// =======================================================================
function axiosGet(url) {
  axios
    .get(url)
    .then(function(response) {
      if (command === "movie-this") {
        outputMovieInfo(response);
      } else {
        outputConcertInfo(response);
      }
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