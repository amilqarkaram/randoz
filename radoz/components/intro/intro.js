import React from "react"
import styles from '../../styles/Intro.module.css'
const intro = React.forwardRef(function(props, ref){
  return(
  <div ref={ref} className={styles.introSection}>
    <div className={styles.navBar}> <h1 className={styles.title}>Video Game Personality Quiz</h1> </div>
    <div className={styles.box}>
    <h1 className={styles.welcome}>Welcome</h1>
    <h3>How To Use</h3>
    <p>Fill out the quiz below, and wait for your results!</p>
    </div>
  </div>
)
});

export default intro;
