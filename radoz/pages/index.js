import Head from 'next/head'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { useEffect, useRef, useState } from 'react'
export default function Home() {
  const [data,setData] = useState("");
  const iframeContainer = useRef(null);
  useEffect(()=>{
    //alert(iframeContainer.current)
  },[]);
  function handleLoad(){
    //alert(document.getElementById("inlineFrameExample").contentWindow);
  }
  function handleSubmit(e){
    e.preventDefault();
    axios.post("/api/server/",data).then(function(responseOne){
      axios.get("/api/server/").then(function(responseTwo){
        alert(JSON.stringify(responseTwo.data));
      });
      alert(responseOne.data);
    }).catch(function(error){
      alert(error);
    });
    setData("");
  }
  function handleChange(e){
    setData(e.target.value);
  }
  return (
    <div className={styles.container}>
    <h1 className={styles.title}>Video Game Personality Quiz</h1>
      <main>
        <iframe className={styles.iframeContainer}
          id="inlineFrameExample"
          title="Inline Frame Example"
          width="1200"
          height="500"
          src="http://www.personal.psu.edu/~j5j/IPIP/"
          ref={iframeContainer}
          onLoad={handleLoad}
          >
        </iframe>
        <form onSubmit={handleSubmit}>
          <textarea
            className={styles.textContainer}
            rows="30"
            cols="160"
            onChange={handleChange}
            value={data}
            name="data"
          />
          <input
            type="submit"
            value="Send to Machine"
          />
        </form>
      </main>
    </div>
  )
}
