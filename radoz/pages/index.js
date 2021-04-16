import Head from 'next/head'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { useEffect, useRef, useState } from 'react'
import TestForm from "../components/testForm/testForm.js"
import Row from "../components/row/row.js"
import Quiz from "../components/quiz/quiz.js"
import fs from "fs"
import path from "path"
//import file from "../assets/data.txt"
export default function Home(props) {
  function handleSubmit(e, answers){
    e.preventDefault();
    const params = new URLSearchParams();
    for ( var key in answers ) {
        params.append(key, answers[key]);
    }
    axios({
      method: 'post',
      url: '/api/server',
      data: params
    });
  }
  return (
    <div className={styles.container}>
    <h1 className={styles.title}>Video Game Personality Quiz</h1>
    <Quiz questions={props.questions} handleSubmit={handleSubmit}/>
    </div>
  )
}
export async function getServerSideProps() {
  var questions  =[];

  try {
      var data = fs.readFileSync("C:/Users/13053/OneDrive/Desktop/Data Structures/randoz/radoz/assets/data.txt", 'utf8');
      var questions  = [];
      let tempString = "";
      for(let i = 0; i < data.length; ++i){
        if(data[i] != '\r'){
        tempString += data[i];
      }
      else{
        questions.push(tempString)
        tempString = "";
        ++i;
      }
      }
      // console.log(data);
      // console.log(questions)
  } catch(e) {
      console.log('Error:', e.stack);
  }
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      questions,
    },
  }
}
