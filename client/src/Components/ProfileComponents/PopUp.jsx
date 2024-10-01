import React from 'react'
import styles from "../../styles/AccountSubs.module.css";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

function PopUp(props) {
  return ( props.trigger ) ? (
    <div className={styles.popup}>
        <div className={styles.popupInner}>
        <button className={styles.closeBtn} onClick={() => props.setTrigger(false)}>X</button>
        <br />
        { props.children }
        <br />

        </div>
    </div>
  ) : "";
}

export default PopUp
