import React from "react"
import Row from "../row/row.js"
import styles from '../../styles/Quiz.module.css'
import axios from "axios"
import ReactHtmlParser from 'react-html-parser'
import { useState } from "react"
//import fs from "fs"
export default function Quiz({ questions, handleSubmit, countries}){
  function handleNickChange(e){
    setState(function(currentState){
      return{
        ...currentState,
        Nick: e.target.value
      };
    })
  }
  function handleAgeChange(e){
    setState(function(currentState){
      return{
        ...currentState,
        Age: e.target.value
      }
    })
  }
  function handleCountryChange(e){
    setState(function(currentState){
      return{
        ...currentState,
        Country: e.target.value
      }
    })
  }
  const[state, setState] = useState({
    Nick: "",
    Age: "",
    Country:"",
    Sex:"",
    answers:{}
  });
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(6);
  function handleRadioClick(e){
    let val = e.target.value;
    let name = e.target.name;
    console.log(e.target.name);
    state.answers[name] = val;
    console.log(state.answers);
  }
  return(
    <form className={styles.personalityForm} autocomplete="off">
    <div className={styles.formInput}>
      <label for="name"> Nickname </label>
      <input className={styles.textarea} value={state.Nick} onChange={handleNickChange}type="textarea" id="name" />
    </div>
    <div className={styles.formInput}>
      <label for="age"> Age </label>
      <input className={styles.textarea} value={state.Age} onChange={handleAgeChange} type="textarea" id="age" />
    </div>
    <div className={styles.formInput}>
      <label for="male" > Male </label>
      <input className={styles.radio} onClick={handleRadioClick} name="Sex" type="radio" value="Male" id="male" />
      <label for="female"> Female </label>
      <input className={styles.radio} onClick={handleRadioClick} name="Sex" type="radio" value="Female" id="female"/>
    </div>
    <div className={styles.formInput}>
      <label for="country"> Country </label>
      <select className={styles.select} onChange={handleCountryChange}name="country" id="country">
        {ReactHtmlParser(countries)}
      </select>
    </div>
    <table className={styles.quizTable}>
      <tbody className={styles.quizBody}>
        {(questions.map(function(e, index){
            let temp = `Q${String(index+1)}`;
            return <Row questionNumber={index+1} groupName={temp} content={e} handleRadioClick={handleRadioClick}/>
        })).slice(start,end)}
        {end == questions.length ?
        <input type="submit" onClick={function(e){
          state.answers["Nick"] = state.Nick;
          state.answers["Age"] = state.Age;
          state.answers["Country"] = state.Country;
          handleSubmit(e,state.answers)
        }
        } />
        :
        <button type="button" onClick={function(e){
          if(end + 6 > questions.length){
            setEnd(questions.length)
          }
          else{
            setEnd(end+6)
          }
          setStart(start+6);
        }
      } > Next </button>
      }
      </tbody>
      {}
    </table>
    </form>
  );
}
