import React from 'react'
import GameResult from "../gameResult/gameResult.js"
import styles from "../../styles/DisplayResults.module.css"
import Loader from '../loader/loader.js'
import { useEffect } from 'react'
export default function displayResult(props){
  return(
    <div className={styles.introSection}>
      <div className={styles.box}>
        {props.loaded ?
        props.topTenArr.map(function(element){
          return <GameResult src={element.imgSrc} desc={element.desc} name={element.name}/>
        })
        :
        <Loader loaderTxt={props.loaderTxt}/>
      }
      </div>
    </div>
  );
}
