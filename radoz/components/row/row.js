import React from "react";
import styles from '../../styles/Quiz.module.css'
import { useState, useEffect } from "react";
export default function Row(props) {
  const [isRadioClicked, setRadioClick] = useState({});
  useEffect(function(){
    if(sessionStorage.getItem(props.groupName)){
      console.log("exists: " + sessionStorage.getItem(props.groupName))
    setRadioClick(JSON.parse(sessionStorage.getItem(props.groupName)))
  }
  else{
    console.log("doesn't exist")
    console.log("props.groupName: " + props.groupName)
    setRadioClick({})
  }
},[])
  function handleRadioClick(e){
    let name = "C1";
    switch(e.target.value){
      case "1":
        name = "C1"
        break;
      case "2":
        name = "C2"
        break;
      case "3":
        name = "C3"
        break;
      case "4":
        name = "C4"
        break;
      case "5":
        name = "C5"
        break;
      default:
        name = "C1"
    }
    console.log("name " + name);
    let obj = {
      C1: false,
      C2: false,
      C3: false,
      C4: false,
      C5: false
    }
    obj[name] = true;
    setRadioClick(obj);
    sessionStorage.setItem(props.groupName,JSON.stringify(obj));
    props.handleRadioClick(e);
  }
  return (
    <div>
    <tr>
    <th className={styles.qContent}>{props.questionNumber + ". " + props.content}</th>
    </tr>
    <tr className={styles.row}>
      <td className="MC">
      <div className={styles.tableData}>
        <p>Very<br />Innaccurate</p>
        <div className={styles.radioContainer} >
        <input
          type="radio"
          name={props.groupName}
          onClick={handleRadioClick}
          value="1"
          className= {styles.MC}
          checked={isRadioClicked ? isRadioClicked.C1 : false}
        />
        <span className={styles.buttonStyle}></span>
        <span className={styles.customRadio}></span>
        </div>
        </div>
      </td>
      <td>
      <div className={styles.tableData}>
        <p>Moderately<br />Innaccurate</p>
        <div className={styles.radioContainer}>
        <input
          type="radio"
          name={props.groupName}
          value="2"
          className={styles.MC}
          onClick={handleRadioClick}
          checked={isRadioClicked ? isRadioClicked.C2 : false}
        />
        <span className={styles.buttonStyle}></span>
        <span className={styles.customRadio}></span>
        </div>
        </div>
      </td>
      <td className="MC">
      <div className={styles.tableData}>
        <p>Neither<br />Option</p>
        <div className={styles.radioContainer}>
        <input
          type="radio"
          name={props.groupName}
          onClick={handleRadioClick}
          value="3"
          className={styles.MC}
          checked={isRadioClicked ? isRadioClicked.C3 : false}
        />
          <span className={styles.buttonStyle}></span>
          <span className={styles.customRadio}></span>
        </div>
        </div>
      </td>
      <td className="MC">
      <div className={styles.tableData}>
        <p>Moderately<br />Accurate</p>
        <div className={styles.radioContainer}>
        <input
          type="radio"
          name={props.groupName}
          onClick={handleRadioClick}
          value="4"
          className={styles.MC}
          checked={isRadioClicked ? isRadioClicked.C4 : false}
        />
        <span className={styles.buttonStyle}></span>
        <span className={styles.customRadio}></span>
        </div>
        </div>
      </td>
      <td className="MC">
      <div className={styles.tableData}>
        <p>Very<br />Accurate</p>
        <div className={styles.radioContainer}>
        <input
          type="radio"
          name={props.groupName}
          onClick={handleRadioClick}
          value="5"
          className={styles.MC}
          checked={isRadioClicked ? isRadioClicked.C5 : false}
        />
        <span className={styles.buttonStyle}></span>
        <span className={styles.customRadio}></span>
        </div>
        </div>
      </td>
    </tr>
    </div>
  );
}
