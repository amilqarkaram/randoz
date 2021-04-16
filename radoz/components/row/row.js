import React from "react";
import styles from '../../styles/Quiz.module.css'
import { useState } from "react";
export default function Row(props) {
  const [checked, setChecked] = useState(false);
  return (
    <tr>
      <th>Question #</th>
      <th>{props.content}</th>
      <td className="MC">
        <p>Very<br />Innaccurate</p>
        <input
          type="radio"
          name={props.groupName}
          onClick={props.handleRadioClick}
          value="1"
          className= {styles.MC}
        />
      </td>
      <td className="MC">
        <p>Moderately<br />Accurate</p>
        <input
          type="radio"
          name={props.groupName}
          onClick={props.handleRadioClick}
          value="2"
          className={styles.MC}
        />
      </td>
      <td className="MC">
        <p>Neither Accurate<br />Nor Innaccurate</p>
        <input
          type="radio"
          name={props.groupName}
          onClick={props.handleRadioClick}
          value="3"
          className={styles.MC}
        />
      </td>
      <td className="MC">
        <p>Moderately<br />Accurate</p>
        <input
          type="radio"
          name={props.groupName}
          onClick={props.handleRadioClick}
          value="4"
          className={styles.MC}
        />
      </td>
      <td className="MC">
        <p>Very<br />Accurate</p>
        <input
          type="radio"
          name={props.groupName}
          onClick={props.handleRadioClick}
          value="5"
          className={styles.MC}
        />
      </td>
    </tr>
  );
}
