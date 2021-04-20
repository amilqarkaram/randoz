// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const request = require("request");
const cheerio = require("cheerio")
const util = require("util");
const process = require('process');
const FormData = require('form-data')
const statman = require('statman');
const stopwatch = new statman.Stopwatch();
var Heap = require('heap');
var heap = new Heap(function(a, b) {
  return b.sum - a.sum;
});
import {
  BinarySearchTree,
  BinarySearchTreeNode,
  AvlTree,
  AvlTreeNode
} from '@datastructures-js/binary-search-tree';
import {
  parser,
  getAllTags,
  processResults,
  parseGenresAndTags
} from '../../utils/utils.js'
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://admin-amilqar:123hurBnomC@cluster0.rmpoy.mongodb.net/videoGameDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
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

function dbQuery(searchQuery, queryArr, type) {
  //  for(let i = 0; i < genres.length;++i){
  //console.log(queryArr);
  let query = "";
  if (type == "genres") {
    query = {
      "genres.name": searchQuery
    }
  } else if (type == "tags") {
    query = {
      "tags.name": searchQuery
    }
  }
  //console.log("type: " + type);
  return new Promise(function(resolve, reject) {
    games.find(query, function(err, docArr) {
      if (err) {
        console.log(err)
      } else {
        const memory = process.memoryUsage();
        console.log((memory.heapUsed / 1024 / 1024 / 1024).toFixed(4), 'GB');
        console.log("there were " + docArr.length + " documents with " + searchQuery + " as a " + type);
        resolve(docArr);
      }
    }).lean().select("id");
  });
  //  }
}

function processDbResults(values, labels, weightMap) {
  let newMap = {}
  let namesArr = [];
  for (let i = 0; i < values.length; ++i) {
    for (let j = 0; j < values[i].length; ++j) {
      if (!newMap.hasOwnProperty(values[i][j].id)) {
        newMap[values[i][j].id] = {
          name: values[i][j].id,
          sum: Number(weightMap[labels[i]]),
          count: 1
        }
        namesArr.push(values[i][j].id);
      } else {
        ++newMap[values[i][j].id].count;
        newMap[values[i][j].id].sum += Number(weightMap[labels[i]]);
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

app.get("/api/server", function(req, res) {
  let tempArr = [];
  for (let i = 0; i < 3; ++i) {
    tempArr.push(heap.peek());
    heap.pop();
  }
  res.json(tempArr);
})
app.post("/api/server/", function(req, res) {
  // let sendArr = [];
  //   sendArr.push({name: 16628},{name: 322403},{name: 557077},{name: 21924}, {name: 9891},{name:282914},{name:45265},{name:429004},
  //   {name: 442872},{name: 11264});
  //   setTimeout(function(){
  //       res.json(sendArr);
  //   },1000);
  //console.log("request data: "+ JSON.stringify(req.body));
  let data = JSON.parse(JSON.stringify(req.body))
  console.log(data)
  var options = {
    'method': 'POST',
    'url': 'http://www.personal.psu.edu/cgi-bin/users/j/5/j5j/IPIP/shortipipneo3.cgi',
    'headers': {},
    formData: data
  };
  request(options, function(error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    const $ = cheerio.load(response.body);
    console.log(cheerio.text($('tr')))
    let facetText = cheerio.text($('tr'));
    let facetMap = parser(facetText, "post-form");
    console.log(facetMap);
    let weightMap = {};
    axios.get("https://spreadsheets.google.com/feeds/list/1SdwGJ4aU3t7f28OXfQWCTN5tMwT98XWqbT0C6CSqxXY/od6/public/values?alt=json")
      .then(function(response) {
        console.log("feedLegnth: " + response.data.feed.entry.length)
        var genresArr = [];
        var tagsArr = [];
        let myGenresSet = new Set([]);
        let myTagsSet = new Set([]);
        for (let i = 0; i < response.data.feed.entry.length; ++i) {
          let tempGenresArr = parseGenresAndTags(response.data.feed.entry[i]['gsx$genres']['$t'], myGenresSet);
          for (let j = 0; j < tempGenresArr.length; ++j) {
            console.log(facetMap.get(response.data.feed.entry[i]['gsx$facets']['$t']));
            weightMap[tempGenresArr[j]] = facetMap.get(response.data.feed.entry[i]['gsx$facets']['$t']);
          }
          genresArr = genresArr.concat(tempGenresArr);

          let tempTagsArr = parseGenresAndTags(response.data.feed.entry[i]['gsx$tags']['$t'], myTagsSet);
          for (let j = 0; j < tempTagsArr.length; ++j) {
            weightMap[tempTagsArr[j]] = facetMap.get(response.data.feed.entry[i]['gsx$facets']['$t']);
          }
          tagsArr = tagsArr.concat(tempTagsArr);
        }
        console.log(weightMap);
        //stopwatch.start();
        let promiseArr = [];
        let promiseArrLabels = [];
        let queryArr = [];
        console.log(genresArr);
        console.log(tagsArr);
        console.log("genres length: " + genresArr.length);
        for (let i = 0; i < tagsArr.length; ++i) {
          promiseArr.push(dbQuery(tagsArr[i], queryArr, "tags"))
          promiseArrLabels.push(tagsArr[i]);
        }
        for (let i = 0; i < genresArr.length; ++i) {
          promiseArr.push(dbQuery(genresArr[i], queryArr, "genres"))
          promiseArrLabels.push(genresArr[i]);
        }

        Promise.all(promiseArr).then((values) => {
          //console.log(values);
          //console.log(stopwatch.read());
          //stopwatch.stop();
          stopwatch.start();
          const [gameNames, gameMap] = processDbResults(values, promiseArrLabels, weightMap);
          let set = new Set();
          const avl = new AvlTree();
          for (let i = 0; i < gameNames.length; ++i) {
            gameMap[gameNames[i]]["weight"] = (gameMap[gameNames[i]].sum) / gameMap[gameNames[i]].count
            heap.push(gameMap[gameNames[i]]);
            //creating an AVL tree to compare to the heap
            avl.insert(gameMap[gameNames[i]].sum, gameNames[i])
          }
          let sendArr = [];
          let avlArr = [];
          for (let i = 0; i < 10; ++i) {
            //using the heap to give user the top values
            sendArr.push(heap.peek());
            heap.pop();

            //using AVL tree to give user top values
            // avlArr.push(avl.max().getValue());
            // avl.remove(avl.max().getKey());
          }

          console.log(stopwatch.read())
          res.json(sendArr);
          //res.json(avlArr)
          stopwatch.stop()
        });
      });
  });
});
export default app;
