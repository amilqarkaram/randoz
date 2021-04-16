// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// const express = require("express");
// const app = express();
// const bodyparser = require("body-parser");
// const cors = require("cors");
const axios = require("axios");
// const util = require("util");
// const statman = require('statman');
// const stopwatch = new statman.Stopwatch();
//var Heap = require('heap');
//import { request } from '../utils/utils.js'
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin-amilqar:123hurBnomC@cluster0.rmpoy.mongodb.net/videoGameTwoDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const GamesSchema = {
  name: String,
  id: Number,
  image: String,
  genres: [Object],
  tags: [Object]
}
let games;
try {
  games = mongoose.model('games')
} catch (error) {
  games = mongoose.model('games', GamesSchema)
}

function request(options) {
  return new Promise((resolve, reject) => {
    axios.request(options).then(function(response) {
      let str = "";
      for (let i = 0; i < response.data.results.length; ++i) {
        str += response.data.results[i].name;
        str += "\n";
      }
      //console.log(str);
      resolve(response);
    }).catch(function(error) {
      console.log("error: " + error);
      resolve(error);
    });
  });
}
let personalizedGames = [];
let personalizedGame;
var options = function(pageNumber) {
  return {
    method: 'GET',
    url: `https://rawg-video-games-database.p.rapidapi.com/games?ordering=-metacritic&page_size=6000&page=${pageNumber}`,
    headers: {
      'x-rapidapi-key': '388c8cb1b0mshf709e0bbd1b0095p15acf2jsnf1bd7be0e38f',
      'x-rapidapi-host': 'rawg-video-games-database.p.rapidapi.com'
    }
  }
}
async function fetchMetaData() {
  let allData = [];
  let morePagesAvailable = true;
  let total_pages = 11384;
  let currentPage = 11383;

  while (morePagesAvailable) {
    currentPage++;
    const response = await request(options(currentPage))
    console.log("currentPage: " + currentPage);
    if (response instanceof Error) {
      console.log("we reached the end of data");
      break;
    }
    let data = await response.data.results;
    if (!data) {
      break;
    } else {
      data.forEach(function(e) {
        let game = new games({
          name: e.name,
          id: e.id,
          image: e.background_image,
          genres: e.genres,
          tags: e.tags
        });
        game.save(function(err, game) {
          if (err) {
            console.log(err)
          } else {
            console.log(game.name + " has been saved");
          }
        });
      });
    }
    morePagesAvailable = currentPage < total_pages;
  }
}
fetchMetaData();
