// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const util  = require("util");
const statman = require('statman');
const stopwatch = new statman.Stopwatch();
var Heap = require('heap');
import {parser, getAllTags, processResults, parseGenresAndTags} from '../../utils/utils.js'
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin-amilqar:123hurBnomC@cluster0.rmpoy.mongodb.net/videoGameDB", {useNewUrlParser: true, useUnifiedTopology: true});
const userGamesSchema = {
  name: String,
  games: [Object]
};
let userGames;
try {
  userGames = mongoose.model('user-games')
} catch (error) {
  userGames = mongoose.model('user-games', userGamesSchema)
}
let facetMap;
//initailizing middleware
// allow us to make handle HTTP requests from another origin
app.use(cors());
app.use(bodyparser.json());

app.get("/api/server",function(req,res){
//getAllTags(3000).then((response) => res.send(response));
// var options = function(pageNumber){
// return {
// method: 'GET',
// url: `https://rawg-video-games-database.p.rapidapi.com/games?page_size=6000&page=${pageNumber}`,
// headers: {
//   'x-rapidapi-key': '388c8cb1b0mshf709e0bbd1b0095p15acf2jsnf1bd7be0e38f',
//   'x-rapidapi-host': 'rawg-video-games-database.p.rapidapi.com'
// }
// }
// }
// axios.request(options(1)).then(function(response){res.send(response.data)})
// var heap = new Heap(function(a, b) {
//     return b.weight - a.weight;
// });
var heap = new Heap(function(a, b) {
  return b.weight - a.weight;
});
userGames.findOne({name: "nick"},function(err, doc){
  if(err){console.log('there was an error in search for the query')}
  else{
    for(let i = 0; i < doc.games.length;++i){
      heap.push(doc.games[i]);
    }
    let arr = [];
    for(let i =0; i < 3; ++i){
      arr.push(heap.peek());
      heap.pop();
    }
    res.json(arr);
  }
});
})
app.post("/api/server/",function(req, res){
  //console.log("request data: "+ JSON.stringify(req.body));
  let data = JSON.stringify(req.body)
  //parse, parses out the personality test and maps facets to their scores
  facetMap = parser(data);
  let weightMap = {};
  //let key = "Liberalism";
  //console.log(key + String(facetMap.get(key)));
  //makes a get request to the spreadsheets where facets are mapped to tags and genres in the database
  axios.get("https://spreadsheets.google.com/feeds/list/1SdwGJ4aU3t7f28OXfQWCTN5tMwT98XWqbT0C6CSqxXY/od6/public/values?alt=json")
  .then(function(response){
    for(let i = 0; i < response.data.feed.entry.length;++i){
      //console.log(response.data.feed.entry[i]);
      //parses genres and tags from the google spreadsheet, these are all related to a specific facet
      let genresArr = parseGenresAndTags(response.data.feed.entry[i]['gsx$genres']['$t']);
      let tagsArr = parseGenresAndTags(response.data.feed.entry[i]['gsx$tags']['$t']);
      for(let j = 0; j < genresArr.length; ++j){
        //console.log(response.data.feed.entry[i]['gsx$facets']['$t']);
        //maps the genres parsed from the googlesheets to its facet's weight(taken from the facet map)
        weightMap[genresArr[j]] = facetMap.get(response.data.feed.entry[i]['gsx$facets']['$t']);
      }
      for(let j = 0; j < tagsArr.length; ++j){
        //console.log(response.data.feed.entry[i]['gsx$facets']['$t']);
        //maps the tags parsed from the googlesheets to its facet's weight(taken from the facet map)
        weightMap[tagsArr[j]] = facetMap.get(response.data.feed.entry[i]['gsx$facets']['$t']);
      }
  }
    //console.log(weightMap);
    stopwatch.start();
    // iterates through the game database averaging the weights of the tags and genres per games
    // an array of game objects is created,
    //where each object hold game info along with its weight calculated above
    processResults(weightMap).then(function(response){
      //finished calculations
      console.log("Finished...Now writing to database");
      let user = new userGames({
        name: "nick",
        games: response
      });
      user.save(function(err,user){
        if(err){console.log(err)}
        else{
          console.log(stopwatch.read());
          //finished writing the data to the database
          res.send("We are Done-----------------");
        }
      });
    });
  });
});
export default app;
