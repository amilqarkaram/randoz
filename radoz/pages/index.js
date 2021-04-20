import Head from 'next/head'
import React from 'react'
import { scroller } from "react-scroll";
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { useEffect, useRef, useState } from 'react'
import TestForm from "../components/testForm/testForm.js"
import Row from "../components/row/row.js"
import Quiz from "../components/quiz/quiz.js"
import Intro from "../components/intro/intro.js"
import DisplayResult from "../components/displayResult/displayResult.js"
import fs from "fs"
import path from "path"
//import file from "../assets/data.txt"
export default function Home(props) {
  const [submitted, setSubmitted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [topTenArr, setTopTenArr] = useState([]);
  let resultsRef = React.createRef();
  function handleSubmit(e, answers){
    const topTen = [];
    e.preventDefault();
    setTimeout(function(){setSubmitted(true)},1000);
    console.log(resultsRef.current)
    if (resultsRef.current) {
      console.log("oyyyy")
      scroller.scrollTo(styles.container, {
        duration: 1000,
        delay: 0,
        smooth: "easeInOutQuart",
      });
    }
    const params = new URLSearchParams();
    for ( var key in answers ) {
        params.append(key, answers[key]);
    }
    axios({
      method: 'post',
      url: '/api/server',
      data: params
    }).then(function(response){
      console.log(JSON.stringify(response.data));
      let promiseArr =[];
      for(let i = 0; i< response.data.length;++i){
      const options = {
        method: 'GET',
        url: `https://api.rawg.io/api/games/${response.data[i].name}?key=71b290447732426f9f4e750d92223e3c`,
      }
      console.log("id: " + response.data[i].name);
        promiseArr.push(axios.request(options).then(function(response){
          return new Promise(function(resolve, reject){
            resolve(response);
          });
        }))
      }
      Promise.all(promiseArr).then((values)=>{
        for(let j =0; j < values.length;++j){
          const obj = {
            imgSrc: values[j].data.background_image,
            name: values[j].data.name,
            desc: values[j].data.description
          }
          //console.log(JSON.stringify(obj));
          //console.log("values: ")
          //console.log(JSON.stringify(values[j]));
          topTen.push(obj);
        }
        setTopTenArr([...topTen]);
        console.log(JSON.stringify(topTenArr));
          setLoaded(true);
      })
    })
  }
  return (
    <div className={styles.container}>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    </style>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Aldrich&family=Press+Start+2P&display=swap');
    </style>
  {!submitted ?
      <div>
        <Intro ref={resultsRef}/>
        <Quiz countries={props.countries} questions={props.questions} handleSubmit={handleSubmit}/>
      </div>
     :
     <DisplayResult loaderTxt={props.loaderTxt} loaded={loaded} topTenArr={topTenArr}/>
   }
    </div>
  )
}
export async function getServerSideProps({req, res}) {
  var questions  =[];

  try {
      var data = fs.readFileSync("C:/Users/13053/OneDrive/Desktop/Data Structures/randoz/radoz/assets/data.txt", 'utf8');
      var questions  = [];
      let tempString = "";
      for(let i = 0; i < data.length; ++i){
        if(data[i] != '\n'){
        tempString += data[i];
      }
      else{
        questions.push(tempString)
        console.log()
        tempString = "";
      }
      }
      console.log(data);
      console.log(questions)
  } catch(e) {
      console.log('Error:', e.stack);
  }
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  try{
    var countries = fs.readFileSync("C:/Users/13053/OneDrive/Desktop/Data Structures/randoz/radoz/assets/countries.txt", 'utf8');
    //console.log(countries)
  }
  catch(e){
    console.log('Error:', e.stack);
  }
  try{
    var loader= fs.readFileSync("C:/Users/13053/OneDrive/Desktop/Data Structures/randoz/radoz/assets/loaderText.txt", 'utf8');
    var loaderTxt = [];
    let tempString = "";
    console.log("AHHHHHHH: " + loader)
    for(let i = 0; i < loader.length;++i){
      if(loader.charAt(i) == '|'){
        loaderTxt.push(tempString);
        tempString="";
      }
      else{
        tempString += loader.charAt(i)
      }
    }
  }
  catch(e){
    console.log('Error:', e.stack);
  }
    console.log(loaderTxt);
  return {
    props: {
      questions,
      countries,
      loaderTxt
    },
  }
}
