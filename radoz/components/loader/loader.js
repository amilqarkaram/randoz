import React from 'react'
import styles from '../../styles/Loader.module.css'
import { useState, useEffect} from 'react'
export default function loader(props){
  const [loaderTxt,setLoaderTxt] = useState("");
  const [loaderTxtArr, setLoaderTxtArr] = useState(props.loaderTxt);
  const [loadingDots, setLoadingDots] = useState(".");
  function changeText(){
    let randomNum = Math.floor(Math.random() * loaderTxtArr.length);
    let randResult = loaderTxtArr[randomNum];
    setLoaderTxtArr(loaderTxtArr.slice(randResult,randResult + 1));
    console.log("set loader text printed");
    console.log(loaderTxt.length);
    setLoaderTxt(randResult);
  }
  function changeDots(loadingDots){
    console.log("dots: " +loadingDots)
    if(loadingDots == "..."){
      console.log("im ere");
      setLoadingDots(".");
    }
    else if(loadingDots == ".."){
      setLoadingDots("...");
    }
    else if(loadingDots == "."){
      setLoadingDots("..")
    }
    console.log("changedots")
  }
  useEffect(function(){
    let timer = setTimeout(function(){changeDots(loadingDots)},1000);
    return()=>{
      clearTimeout(timer)
    }
  },[loadingDots]);
  useEffect(function(){
    setLoaderTxtArr(props.loaderTxt);
    let timer1 = setInterval(changeText,10000);
    let timer2 = setTimeout(setLoadingDots(".."),1000);
    return ()=>{
      clearInterval(timer1);
      clearTimeout(timer2);
    }
  },[]);
  return(
    <div>
      <h1 className={styles.welcome}>Loading Your Result</h1>
      <p>{loadingDots}</p>
      <p>This may take a few minutes</p>
      <p className={styles.busyText}>{loaderTxt}</p>
    </div>
  );
}
