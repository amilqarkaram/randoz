import React from "react"
import Row from "../row/row.js"
import styles from '../../styles/Quiz.module.css'
import axios from "axios"
import { useState } from "react"
//import fs from "fs"
export default function Quiz({ questions, handleSubmit}){
  const answers = {};
  function handleRadioClick(e){
    let val = e.target.value;
    let name = e.target.name;
    answers[name] = val;
    console.log(val);
  }
  return(
    <form className={styles.personalityForm}>
    <table className={styles.quizTable}>
      <tbody className={styles.quizBody}>
        {questions.map(function(e, index){
            let temp = `Q${String(index+1)}`;
            return <Row groupName={temp} content={e} handleRadioClick={handleRadioClick}/>
        })}
        <input type="submit" onClick={function(e){handleSubmit(e,answers)}} />
      </tbody>
      {}
    </table>
    </form>
  );
}
