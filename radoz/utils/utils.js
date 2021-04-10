import axios from 'axios'
function parser(data){
  let parse = data;
  let facetMap = new Map();
  for(let m = 0; m < 5; ++m){
    let facetScores = parse.substr(parse.indexOf("DOMAIN/Facet"));
    let newLineCount = 0;
    let k = 0;
    while(newLineCount < 8){
      if(facetScores[k] == '\\' && facetScores[k+1] == 'n'){
        ++newLineCount;
      }
      ++k;
    }
    //console.log("k is: " + k);
    //console.log(parse.substr(parse.indexOf("DOMAIN/Facet"),k));
    facetScores = facetScores.slice(0,k);
    let scorArr = [];
    //console.log(parse);
    for(let i = 0; i < 6;++i){
      let facet = facetScores.slice((facetScores.lastIndexOf(".") + 1),facetScores.length - 1);
      facetScores = facetScores.slice(0,facetScores.lastIndexOf(".") - 1);
      //console.log("facet: " + facet +"----------------------------")
      let facetName = "";
      let facetScore = "";
      let readWords = true;
      for(let j = 0; j < facet.length;++j){
        if(facet.charCodeAt(j) >= 48 && facet.charCodeAt(j) <= 57){
          facetScore += facet[j];
        }
        if(facet.charAt(j) == '\\'){
          //facetName = facetName.slice(facetName.length-2,facetName.length - 1);
          readWords = false;
        }
        if(readWords){
          //console.log("hello " + facet[j]);
        facetName += facet[j];
      }
      }
      facetMap.set(facetName,facetScore);
      console.log("facet Name: " + facetName);
      console.log("facet Score: " + facetScore);
    }
    parse = parse.slice(parse.indexOf("DOMAIN/Facet")+k);
    console.log("new Parse:-------------------------------------");
  }
  return facetMap;
}


/* -----------------------HELPER: handles an axios request based on options Helper-----------------------*/

function request(options){
return new Promise((resolve,reject)=>{
  axios.request(options).then(function (response) {
    let str = "";
    for(let i = 0; i < response.data.results.length;++i){
        str += response.data.results[i].name;
        str += "\n";
    }
    //console.log(str);
    resolve(response);
  }).catch(function(error){
    console.log("error: " + error);
    resolve(error);
  });
});
}

/* --------------------------------------------------------------------------------------------*/

/* -----------------------------------------Get all Tags Driver--------------------------------*/

function getAllTags(gameCountMin){
  var options = function(pageNumber){
  return {
  method: 'GET',
  url: `https://rawg-video-games-database.p.rapidapi.com/tags?page_size=6000&page=${pageNumber}`,
  headers: {
    'x-rapidapi-key': '388c8cb1b0mshf709e0bbd1b0095p15acf2jsnf1bd7be0e38f',
    'x-rapidapi-host': 'rawg-video-games-database.p.rapidapi.com'
  }
}
}
async function fetchMetaData() {
  let allData = [];
  let morePagesAvailable = true;
  let total_pages = 35;
  let currentPage = 0;

  while(morePagesAvailable) {
    currentPage++;
    const response = await (options(currentPage))
    console.log("currentPage: " + currentPage);
    if(response instanceof Error){
      console.log("end");
      return allData;
    }
    let data = await response.data.results;
    if(!data){
      break;
    }
    else{
        data.forEach(function(e){
        if(e.games_count>gameCountMin){
        console.log("game count: "+ e.games_count);
        console.log("tage: " + e.name);
        allData.unshift(e.name)
      }
      } );
    }
    morePagesAvailable = currentPage < total_pages;
  }

  return allData;
}
return fetchMetaData();
}

/* -----------------------------------------------------------------------------------*/

/*------------------------------------HELPER: Result processing, calcluate weights---------------------------*/

function calculateGameWeight(data,game){
  let weightCalculation = 0;
  let count = 0;
  //staring with genres, begins to calculate totalweight as each genre is associated with a weight
  for(let i = 0; i < game.genres.length;++i){
    if(data.hasOwnProperty(game.genres[i].name)){
      weightCalculation += Number(data[game.genres[i].name]);
      ++count;
    }
  }
  //next we deal with tags
  for(let i = 0; i < game.tags.length;++i){
    if(data.hasOwnProperty(game.tags[i].name)){
      weightCalculation += Number(data[game.tags[i].name]);
      ++count;
    }
  }
  if(count == 0){
    count = 1;
  }
  weightCalculation = weightCalculation/count;
  return weightCalculation;
}
/* -----------------------------------------------------------------------------------*/

/* -----------------------Go through every game and assign a weight--------------------------- */

function processResults(weightMap){
  let personalizedGames = [];
  let personalizedGame;
  var options = function(pageNumber){
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
  let total_pages = 20;
  let currentPage = 0;

  while(morePagesAvailable) {
    currentPage++;
    const response = await request(options(currentPage))
    //console.log("currentPage: " + currentPage);
    if(response instanceof Error){
      console.log("end");
      return allData;
    }
    let data = await response.data.results;
    if(!data){
      break;
    }
    else{
        data.forEach(function(e){
          personalizedGame = {
            name: e.name,
            id: e.id,
            weight: calculateGameWeight(weightMap,e)
          }
          //console.log(e.name);
          //console.log(personalizedGame);
          allData.unshift(personalizedGame);
      } );
    }
    morePagesAvailable = currentPage < total_pages;
  }

  return allData;
}
return fetchMetaData();
}

/* -----------------------------------------------------------------------------------*/

/* ------------Parsing genres and Tags out of the googleSheets stream --------------*/

function parseGenresAndTags(str){
  let arr = [];
  let tempStr = "";
  //parses out words using commas as delimiter
  //also removes excess spaces
  for(let i = 0; i < str.length; ++i){
    if(str[i] == ','){
      tempStr = tempStr.replace(" ","");
      arr.push(tempStr);
      tempStr = "";
      continue;
    }
    tempStr += str[i];
  }
  tempStr = tempStr.replace(" ","");
  arr.push(tempStr);
  return arr;
}

/* -----------------------------------------------------------------------------------*/


export { parser, getAllTags, processResults, parseGenresAndTags};
