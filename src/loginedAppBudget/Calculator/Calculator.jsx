import React, { useState } from "react";
import styles from "./Calculator.module.scss";

const Calculator = () => {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState("");
  const [memory, setMemory] = useState([]);

  const handleOperation = (operator) => {
    if (num1 !== "" && num2 !== "") {
      let res;
      switch (operator) {
        case "+":
          res = parseFloat(num1) + parseFloat(num2);
          break;
        case "-":
          res = parseFloat(num1) - parseFloat(num2);
          break;
        case "*":
          res = parseFloat(num1) * parseFloat(num2);
          break;
        case "/":
          res = parseFloat(num1) / parseFloat(num2);
          break;
        default:
          res = "";
      }
      setResult(res);
      if (memory.length < 5) {
        setMemory([...memory, `${num1} ${operator} ${num2} = ${res}`]);
      } else {
        setMemory([...memory.slice(1), `${num1} ${operator} ${num2} = ${res}`]);
      }
    }
  };

  return (
    <div className={styles.calculator}>
      <input
        type="number"
        value={num1}
        onChange={(e) => setNum1(e.target.value)}
        placeholder="Введите число"
      />
      <input
        type="number"
        value={num2}
        onChange={(e) => setNum2(e.target.value)}
        placeholder="Введите число"
      />
      <div className={styles.operations}>
        <button onClick={() => handleOperation("+")}>+</button>
        <button onClick={() => handleOperation("-")}>-</button>
        <button onClick={() => handleOperation("*")}>*</button>
        <button onClick={() => handleOperation("/")}>/</button>
      </div>
      <div className={styles.result}>Результат: {result}</div>
      <div className={styles.memory}>
        <h3>Память:</h3>
        <ul>
          {memory.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Calculator;
