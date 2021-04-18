import React from "react";
import styles from '../../styles/Quiz.module.css'
import { useState } from "react";
export default function Row(props) {
  const [isRadioClicked, setRadioClick] = useState(false);
  return (
    <div>
    <tr>
    <th className={styles.qContent}>{props.questionNumber + ". " + props.content}</th>
    </tr>
    <tr className={styles.row}>
      <td className="MC">
      <div className={styles.tableData}>
        <p>Very<br />Innaccurate</p>
        <input
          type="radio"
          name={props.groupName}
          onClick={props.handleRadioClick}
          value="1"
          className= {styles.MC}
        />
        <span className={styles.buttonStyle}></span>
        <span className={styles.customRadio}></span>
        </div>
      </td>
      <td>
      <div className={styles.tableData}>
        <p>Moderately<br />Innaccurate</p>
        <input
          type="radio"
          name={props.groupName}
          value="2"
          className={styles.MC}
          onClick={props.handleRadioClick}
        />
        <span className={styles.buttonStyle}></span>
        <span className={styles.customRadio}></span>
        </div>
      </td>
      <td className="MC">
      <div className={styles.tableData}>
        <p>Neither<br />Option</p>
        <input
          type="radio"
          name={props.groupName}
          onClick={props.handleRadioClick}
          value="3"
          className={styles.MC}
        />
        <span className={styles.buttonStyle}></span>
        <span className={styles.customRadio}></span>
        </div>
      </td>
      <td className="MC">
      <div className={styles.tableData}>
        <p>Moderately<br />Accurate</p>
        <input
          type="radio"
          name={props.groupName}
          onClick={props.handleRadioClick}
          value="4"
          className={styles.MC}
        />
        <span className={styles.buttonStyle}></span>
        <span className={styles.customRadio}></span>
        </div>
      </td>
      <td className="MC">
      <div className={styles.tableData}>
        <p>Very<br />Accurate</p>
        <input
          type="radio"
          name={props.groupName}
          onClick={props.handleRadioClick}
          value="5"
          className={styles.MC}
        />
        <span className={styles.buttonStyle}></span>
        <span className={styles.customRadio}></span>
        </div>
      </td>
    </tr>
    </div>
  );
}
