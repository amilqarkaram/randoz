import React from 'react'
import styles from '../../styles/GameResult.module.css'
import ReactHtmlParser from 'react-html-parser'
export default function gameResult(props){
  const [readState,setReadState] = React.useState({
    displayButton: true,
    readMore: false,
  });
  function handleReadMore(e){
    setReadState({
      displayButton: true,
      readMore: !readState.readMore,
    });
  }
  React.useEffect(function(){
    if(props.desc){
      if(props.desc.length <= 600){
        setReadState(function(currentState){
          return{
            ...currentState,
            displayButton: false
          }
        })
      }
    }
  },[]);
  return(
    <div className={styles.gameResultContainer}>
      <img className={styles.gameImg} src={props.src} alt={props.name} />
      <div className={styles.gameInfo}>
      <h1 className={styles.gameName}>{props.name}</h1>
      <div className={styles.gameDesc}>
      {readState.readMore ? ReactHtmlParser(props.desc) : ReactHtmlParser(props.desc.slice(0,600))}
      {readState.displayButton ?
         (readState.readMore ?
            <img className={styles.readImg} src="/ReadLess.png" onClick={handleReadMore}></img> :
            <img className={styles.readImg} src="/ReadMoreOrigin.png" onClick={handleReadMore}></img>
        )
       : <div></div>}
      </div>
      </div>
      {
      //put the image
      //title of game next to the image
      //description of the game underneath the title
      //Show More... after a certain number of characters
      //Available on... with icons of places to buy the game
      //all the way to the right, we want a button that gives option to switch out the game a few times
    }
    </div>
  );
}
