import React from 'react'
import styles from '../../styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
export default function testForm(){
  const iframeContainer = useRef(null);
    const [data,setData] = useState("");
  function handleSubmit(e){
    e.preventDefault();
    axios.post("/api/server/",data).then(function(responseOne){
      // axios.get("/api/server/").then(function(responseTwo){
      //   alert(JSON.stringify(responseTwo.data));
      // });
      alert(JSON.stringify(responseOne.data));
    }).catch(function(error){
      alert(error);
    });
    setData("");
  }
  function handleChange(e){
    setData(e.target.value);
  }
  return(
    <div>
      <iframe className={styles.iframeContainer}
        id="inlineFrameExample"
        title="Inline Frame Example"
        width="1200"
        height="500"
        src="http://www.personal.psu.edu/~j5j/IPIP/"
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
  </div>
)
}
