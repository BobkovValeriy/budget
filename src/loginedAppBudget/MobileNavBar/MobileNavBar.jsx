import { useState } from "react";
import styles from "./MobileNavBar.module.scss";
import { SlArrowDown } from "react-icons/sl";
const MobileNavBar = function ({
  setShowCalc,
  setShowHistory,
  setShowStatistic,
  setShowForm,
}) {
  const [showNav, setShowNav] = useState(false);
  function showNavOnClick() {
    setShowNav((prev) => !prev);
    if (showNav) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
    setShowCalc(false);
    setShowHistory(false);
    setShowStatistic(false);
  }
  function showCalculator() {
    setShowNav((prev) => !prev);
    setShowCalc(true);
    setShowHistory(false);
    setShowStatistic(false);
    setShowForm(false);
  }
  function showTransactionHistory() {
    setShowNav((prev) => !prev);
    setShowCalc(false);
    setShowHistory(true);
    setShowStatistic(false);
    setShowForm(false);
  }
  function showTransactionForm() {
    setShowNav((prev) => !prev);
    setShowCalc(false);
    setShowHistory(false);
    setShowStatistic(false);
    setShowForm(true);
  }
  function showTransactionStatistic() {
    setShowNav((prev) => !prev);
    setShowCalc(false);
    setShowHistory(false);
    setShowStatistic(true);
    setShowForm(false);
  }
  return (
    <div
      className={
        showNav
          ? styles.MobileNavBarWrapper__active
          : styles.MobileNavBarWrapper
      }
    >
      {showNav && (
        <div
          className={styles.MobileNavBarWrapper_button}
          onClick={showTransactionForm}
        >
          новая транзакция
        </div>
      )}
      {showNav && (
        <div
          className={styles.MobileNavBarWrapper_button}
          onClick={showTransactionStatistic}
        >
          статистика транзакций
        </div>
      )}
      {showNav && (
        <div
          className={styles.MobileNavBarWrapper_button}
          onClick={showTransactionHistory}
        >
          история транзакций
        </div>
      )}
      {showNav && (
        <div
          className={styles.MobileNavBarWrapper_button}
          onClick={showCalculator}
        >
          калькулятор
        </div>
      )}
      <div onClick={showNavOnClick}>
        <SlArrowDown
          className={
            showNav
              ? styles.MobileNavBarWrapper_hide
              : styles.MobileNavBarWrapper_show
          }
        />
      </div>
    </div>
  );
};

export default MobileNavBar;
