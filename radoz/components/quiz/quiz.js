import React from "react"
import Row from "../row/row.js"
import styles from '../../styles/Quiz.module.css'
import axios from "axios"
import ReactHtmlParser from 'react-html-parser'
import { useState, useEffect,  useRef } from "react"
//import fs from "fs"
export default function Quiz({ questions, handleSubmit, countries}){
  const[state, setState] = useState({
    Nick: "",
    Age: "",
    Country:"",
    Sex:"",
    answers:{},
  });
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(6);
  const topQuizRef = useRef();
  useEffect(function(){
    for(let i = 0; i < 120; ++i){
      let key = "Q" + String(i+1);
      if(sessionStorage.getItem(key)){
        let choicesObj = JSON.parse(sessionStorage.getItem(key));
        for(var keyChoice in choicesObj){
          if(choicesObj[keyChoice]){
            state.answers[key] = Number(keyChoice[1]);
          }
        }
      }
    }
    if(sessionStorage.getItem("start") && sessionStorage.getItem("end")){
      console.log("here");
      setStart(Number(sessionStorage.getItem("start")));
      setEnd(Number(sessionStorage.getItem("end")));
    }
    setState(function(currentState){
      let nick = currentState.Nick
      let age = currentState.Age;
      let country = currentState.Country;
      let sex = currentState.Sex;
      if(sessionStorage.getItem("Nick")){
        nick = sessionStorage.getItem("Nick");
      }
      if(sessionStorage.getItem("Age")){
        age = sessionStorage.getItem("Age");
      }
      if(sessionStorage.getItem("Country")){
        country = sessionStorage.getItem("Country");
      }
      if(sessionStorage.getItem("Sex")){
        sex = sessionStorage.getItem("Sex");
      }
      return{
        ...currentState,
        Nick: nick,
        Age: age,
        Country: country,
        Sex: sex
      }
    })
  },[]);
  function handleNext(){
    if(topQuizRef.current){
      window.scrollTo({
        behavior: 'smooth',
        top: topQuizRef.current.offsetTop
      })
    }
      if(end + 6 > questions.length){
        setEnd(questions.length)
        sessionStorage.setItem("end",String(questions.length));
      }
      else{
        setEnd(end+6)
        sessionStorage.setItem("end",String(end+6));
      }
      setStart(start+6);
      sessionStorage.setItem("start",String(start+6));
  }
  function handlePrevious(){
    if(start <= 0){
      setStart(0)
      sessionStorage.setItem("start",String(0));
      setEnd(6)
      sessionStorage.setItem("end",String(6));
    }
    else{
      setStart(start-6)
      sessionStorage.setItem("start",String(start-6));
      setEnd(end-6);
      sessionStorage.setItem("end", String(end-6));
    }
  }
  function handleNickChange(e){
    sessionStorage.setItem("Nick",e.target.value);
    setState(function(currentState){
      return{
        ...currentState,
        Nick: e.target.value
      };
    })
  }
  function handleAgeChange(e){
    sessionStorage.setItem("Age",e.target.value)
    setState(function(currentState){
      return{
        ...currentState,
        Age: e.target.value
      }
    })
  }
  function handleCountryChange(e){
    sessionStorage.setItem("Country",e.target.value);
    console.log("Country: " + e.target.value)
    setState(function(currentState){
      return{
        ...currentState,
        Country: e.target.value
      }
    })
  }
  function handleRadioClick(_name, _value){
    let val = _value;
    let name = _name;
    console.log(state.answers);
    if(name === "Sex"){
        setState(function(currentState){
          return{
            ...currentState,
            Sex: val
          }
        });
        sessionStorage.setItem(name,val);
    }
    else{
        state.answers[name] = Number(val);
    }
  }
  return(
    <form ref={topQuizRef}className={styles.personalityForm} autoComplete="off">
    <div className={styles.background}>
    <div className={styles.formInput}>
      <label htmlFor="name"> Nickname </label>
      <input className={styles.textarea} value={state.Nick} onChange={handleNickChange}type="textarea" id="name" />
    </div>
    <div className={styles.formInput}>
      <label htmlFor="age"> Age </label>
      <input className={styles.textarea} value={state.Age} onChange={handleAgeChange} type="textarea" id="age" />
    </div>
    <div className={styles.formInput}>
      <label htmlFor="male" > Male </label>
      <input className={styles.radio} onClick={function(e){return handleRadioClick(e.target.name, e.target.value)}} checked={state.Sex=="Male" ? true : false} name="Sex" type="radio" value="Male" id="male" />
      <label htmlFor="female"> Female </label>
      <input className={styles.radio} onClick={function(e){return handleRadioClick(e.target.name, e.target.value)}} checked={state.Sex=="Female" ? true : false} name="Sex" type="radio" value="Female" id="female"/>
    </div>
    <div className={styles.formInput}>
      <label htmlFor="country"> Country </label>
      <select className={styles.select} onChange={handleCountryChange} value = {state.Country}name="country" id="country">
        {ReactHtmlParser(countries)}
      </select>
    </div>
    <table className={styles.quizTable}>
      <tbody className={styles.quizBody}>
        {(questions.map(function(e, index){
            let temp = `Q${String(index+1)}`;
            console.log("hello");
            if(index >= start && index < end){
              return <Row key={temp} questionNumber={index+1} groupName={temp} content={e} handleRadioClick={handleRadioClick}/>
            }
            else{
              return ""
            }
        }))}
      </tbody>
    </table>
    {end == questions.length ?
    <div>
    <img src="/Pixel-arrow-fixed.png" className={styles.prevButton} onClick={handlePrevious}></img>
    <img src="/Submit.png" className={styles.submitButton} onClick={function(e){
      state.answers["Nick"] = state.Nick;
      state.answers["Age"] = state.Age;
      state.answers["Country"] = state.Country;
      state.answers["Sex"] = state.Sex;
      handleSubmit(e,state.answers)
    }
    } />
    </div>
    :
    <div>
    <img src="/Pixel-arrow-fixed.png" className={styles.prevButton} onClick={handlePrevious}></img>
    <img src="/Pixel-arrow-fixed.png" className={styles.nextButton}  onClick={handleNext}></img>
  </div>
}
</div>
    </form>
  );
}
