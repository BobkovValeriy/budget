import React from "react";
import styles from "./LoadingBars.module.scss";

const LoadingBars = () => {
  return (
    <div className={styles.pl}>
      <div className={styles["pl__bubble"]}>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
      </div>
      <div className={styles["pl__bubble"]}>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
      </div>
      <div className={styles["pl__bubble"]}>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
        <div className={styles["pl__bubble-drop"]}></div>
      </div>
    </div>
  );
};

export default LoadingBars;
