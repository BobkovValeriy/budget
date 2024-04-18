import React, { useState } from "react";
import styles from "./Calculator.module.scss";

const Calculator = () => {
  const [num1, setNum1] = useState("0");
  const [num2, setNum2] = useState("");
  const [operation, setOperation] = useState("");

  const handleDigitClick = (digit) => {
    if (operation === "") {
      if (num1 === "0") {
        setNum1(digit);
      } else {
        setNum1(num1 + digit);
      }
    } else {
      if (num2 === "") {
        setNum2(digit);
      } else {
        setNum2(num2 + digit);
      }
    }
  };

  const handleDecimalClick = () => {
    if (operation === "") {
      if (!num1.includes(".")) {
        setNum1(num1 + ".");
      }
    } else {
      if (!num2.includes(".")) {
        setNum2(num2 + ".");
      }
    }
  };

  const handleOperationClick = (operator) => {
    setOperation(operator);
  };

  const calculateResult = () => {
    switch (operation) {
      case "+":
        return parseFloat(num1) + parseFloat(num2);
      case "-":
        return parseFloat(num1) - parseFloat(num2);
      case "*":
        return parseFloat(num1) * parseFloat(num2);
      case "/":
        return parseFloat(num1) / parseFloat(num2);
      default:
        return "";
    }
  };

  const handleClearClick = () => {
    setNum1("0");
    setNum2("");
    setOperation("");
  };

  const handleBackspaceClick = () => {
    if (operation === "") {
      setNum1(num1.slice(0, -1));
      if (num1 === "") {
        setNum1("0");
      }
    } else {
      setNum2(num2.slice(0, -1));
    }
  };
  const handleReciveAnswer = () => {
    if (num1 !== "" && num2 !== "") {
      const res = calculateResult();
      setNum1(res);
      setNum2("");
      setOperation("");
    }
  };

  return (
    <div className={styles.calculator}>
      <div className={styles.display}>
        <span>{num1}</span>
        <span>{operation}</span>
        <span>{num2}</span>
      </div>
      <div className={styles.buttons}>
        <button
          onClick={() => handleDigitClick("7")}
          className={styles.small__button}
        >
          7
        </button>
        <button
          onClick={() => handleDigitClick("8")}
          className={styles.small__button}
        >
          8
        </button>
        <button
          onClick={() => handleDigitClick("9")}
          className={styles.small__button}
        >
          9
        </button>
        <button
          onClick={() => handleOperationClick("+")}
          className={styles.small__button}
        >
          +
        </button>

        <button
          onClick={() => handleDigitClick("4")}
          className={styles.small__button}
        >
          4
        </button>
        <button
          onClick={() => handleDigitClick("5")}
          className={styles.small__button}
        >
          5
        </button>
        <button
          onClick={() => handleDigitClick("6")}
          className={styles.small__button}
        >
          6
        </button>
        <button
          onClick={() => handleOperationClick("-")}
          className={styles.small__button}
        >
          -
        </button>

        <button
          onClick={() => handleDigitClick("1")}
          className={styles.small__button}
        >
          1
        </button>
        <button
          onClick={() => handleDigitClick("2")}
          className={styles.small__button}
        >
          2
        </button>
        <button
          onClick={() => handleDigitClick("3")}
          className={styles.small__button}
        >
          3
        </button>
        <button
          onClick={() => handleOperationClick("*")}
          className={styles.small__button}
        >
          *
        </button>

        <button
          onClick={() => handleDecimalClick()}
          className={styles.small__button}
        >
          .
        </button>
        <button
          onClick={() => handleDigitClick("0")}
          className={styles.small__button}
        >
          0
        </button>
        <button
          onClick={() => handleOperationClick("/")}
          className={styles.small__button}
        >
          /
        </button>
        <button onClick={handleClearClick} className={styles.small__button}>
          C
        </button>

        <button onClick={handleBackspaceClick} className={styles.sizedButton}>
          &lt;
        </button>

        <button onClick={handleReciveAnswer} className={styles.sizedButton}>
          =
        </button>
      </div>
    </div>
  );
};

export default Calculator;
