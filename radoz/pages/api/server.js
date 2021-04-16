// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const util  = require("util");
const process = require('process');
const statman = require('statman');
const stopwatch = new statman.Stopwatch();
var Heap = require('heap');
var heap = new Heap(function(a, b) {
    return b.weight - a.weight;
});
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
let facetMap;
function dbQuery(searchQuery, queryArr, type){
//  for(let i = 0; i < genres.length;++i){
//console.log(queryArr);
let query = "";
  if(type == "genres"){
    query = {"genres.name": searchQuery}
  }
  else if(type == "tags"){
    query = {"tags.name": searchQuery}
  }
  //console.log("type: " + type);
    return new Promise(function(resolve,reject){
      games.find(query,function(err,docArr){
        if(err){console.log(err)}
        else{
          const memory = process.memoryUsage();
          console.log((memory.heapUsed / 1024 / 1024 / 1024).toFixed(4), 'GB');
          console.log("there were " + docArr.length + " documents with " + searchQuery + " as a " + type);
          resolve(docArr);
        }
      }).lean().select("name");
    });
//  }
}
function processDbResults(values, labels, weightMap){
  let newMap = {}
  let namesArr = [];
  for(let i = 0; i < values.length; ++i){
    for(let j = 0; j < values[i].length; ++j){
      if(!newMap.hasOwnProperty(values[i][j].name)){
        newMap[values[i][j].name] = {
          name: values[i][j].name,
          sum: Number(weightMap[labels[i]]),
          count: 1
        }
        namesArr.push(values[i][j].name);
      }
      else{
        ++newMap[values[i][j].name].count;
        newMap[values[i][j].name].sum += Number(weightMap[labels[i]]);
      }
    }
  }
  return [namesArr, newMap];
  //console.log(values[0][0]);
}
//initailizing middleware
// allow us to make handle HTTP requests from another origin
app.use(cors());
app.use(bodyparser.json());

app.get("/api/server/",function(req,res){
//getAllTags(3000).then((response) => res.send(response));
var options = function(pageNumber){
return {
method: 'GET',
url: `https://rawg-video-games-database.p.rapidapi.com/games?page_size=6000&page=${pageNumber}`,
headers: {
  'x-rapidapi-key': '388c8cb1b0mshf709e0bbd1b0095p15acf2jsnf1bd7be0e38f',
  'x-rapidapi-host': 'rawg-video-games-database.p.rapidapi.com'
}
}
}
//axios.request(options(1)).then(function(response){res.send(response.data)})
// var heap = new Heap(function(a, b) {
//   return b.weight - a.weight;
// });
// userGames.findOne({name: "nick"},function(err, doc){
//   if(err){console.log('there was an error in search for the query')}
//   else{
//     for(let i = 0; i < doc.games.length;++i){
//       heap.push(doc.games[i]);
//     }
//     let arr = [];
//     for(let i =0; i < 3; ++i){
//       arr.push(heap.peek());
//       heap.pop();
//     }
//     res.json(arr);
//   }
// });
console.log("helloooo");
let tempArr = [];
for(let i = 0; i < 3; ++i){
  tempArr.push(heap.peek());
  heap.pop();
}
res.json(tempArr);
})
app.post("/api/server",function(req, res){
  //console.log("request data: "+ JSON.stringify(req.body));
  //let data = JSON.stringify(req.body)
//  console.log(JSON.parse(req.body);
//let jsonObject = new JSONObject(req.body);
  console.log(req.body);

});
export default app;
