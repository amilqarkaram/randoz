import React from "react"
import styles from '../../styles/Intro.module.css'
export default function intro(){
  return(
    <div className={styles.introSection}>
      <h1>Welcome</h1>
      <div className={styles.box}>
      <h3>How To Use</h3>
      <p>Fill out the quiz below, and wait for your results!</p>
      </div>
    </div>
  );
}
