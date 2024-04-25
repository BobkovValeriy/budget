import React, { useEffect, useState, useRef } from "react";
import styles from "./Summary.module.scss";

const Summary = function ({
  totalIncome,
  totalExpense,
  remain,
  totalExpensesByType,
  budget,
}) {
  const [summaryExpenses, setSummaryExpenses] = useState([]);
  const [searchingWord, setSearchingWord] = useState("");
  const [selectedTypesForGraphic, setSelectedTypesForGraphic] = useState({});
  const [graphickData, setGraphickData] = useState({});
  const canvasRef = useRef(null);

  useEffect(() => {
    const sortedExpenses = Object.entries(totalExpensesByType).sort(
      ([, totalA], [, totalB]) => totalB - totalA
    );
    setSummaryExpenses(sortedExpenses);
  }, [totalExpensesByType]);

  function changeSearchingWord(event) {
    setSearchingWord(event.target.value);
  }

  useEffect(() => {
    const types = Object.keys(selectedTypesForGraphic);
    const groupedExpenses = {};

    budget.forEach((transaction) => {
      const month = transaction.date.slice(0, 7);
      transaction.transactionType.forEach((expenseType) => {
        const [typeName, typePrice] = expenseType
          .split(":")
          .map((item) => item.trim());
        if (
          types.includes(typeName) &&
          selectedTypesForGraphic[typeName].checked
        ) {
          if (!groupedExpenses[month]) {
            groupedExpenses[month] = {};
          }
          if (!groupedExpenses[month][typeName]) {
            groupedExpenses[month][typeName] = {
              total: 0,
              color: selectedTypesForGraphic[typeName].color || "#000000",
            };
          }
          groupedExpenses[month][typeName].total += parseFloat(typePrice);
        }
      });
    });
    console.log(graphickData);
    setGraphickData(groupedExpenses);
  }, [selectedTypesForGraphic, budget]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Очистим canvas перед отрисовкой новых данных
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Массив месяцев для отображения
    const months = Object.keys(graphickData);

    // Размеры canvas
    const width = canvas.width;
    const height = canvas.height;

    // Максимальная сумма трат для определения масштаба графика
    const maxExpense = Math.max(
      ...Object.values(graphickData).flatMap((month) =>
        Object.values(month).map((type) => type.total)
      )
    );

    // Масштабы по осям X и Y
    const scaleX = width / (months.length - 1);
    const scaleY = height / maxExpense;

    // Отрисовка оси X
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, height);
    ctx.stroke();

    // Отрисовка оси Y
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, height);
    ctx.stroke();

    // Отрисовка линий для каждого типа траты
    Object.entries(graphickData).forEach(([month, expenses]) => {
      let prevX, prevY; // Объявляем переменные здесь

      let x = months.indexOf(month) * scaleX;
      let y = height;

      Object.entries(expenses).forEach(([type, info]) => {
        const { total, color } = info;
        const expenseY = total * scaleY;

        // Рисуем точку
        ctx.beginPath();
        ctx.arc(x, expenseY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();

        // Соединяем точку с предыдущей, если она есть
        if (prevX !== undefined && prevY !== undefined) {
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, expenseY);
          ctx.strokeStyle = color;
          ctx.stroke();
        }

        // Сохраняем предыдущие координаты
        prevX = x;
        prevY = expenseY;

        // Сдвигаемся к следующей точке
        x += scaleX;
      });
    });
  }, [graphickData]);

  function searchInBudget(event) {
    event.preventDefault();
    if (searchingWord.trim() === "") {
      const sortedExpenses = Object.entries(totalExpensesByType).sort(
        ([, totalA], [, totalB]) => totalB - totalA
      );
      setSummaryExpenses(sortedExpenses);
    } else {
      const filteredExpenses = Object.entries(totalExpensesByType).filter(
        ([type]) => type.toLowerCase().includes(searchingWord.toLowerCase())
      );
      const sortedExpenses = filteredExpenses.sort(
        ([, totalA], [, totalB]) => totalB - totalA
      );
      setSummaryExpenses(sortedExpenses);
    }
  }
  const handleCheckboxChange = (event, type) => {
    const isChecked = event.target.checked;
    setSelectedTypesForGraphic((prevState) => ({
      ...prevState,
      [type]: isChecked ? { ...prevState[type], checked: true } : undefined,
    }));
  };

  const handleColorChange = (type, color) => {
    setSelectedTypesForGraphic((prevState) => ({
      ...prevState,
      [type]: {
        ...prevState[type],
        color,
      },
    }));
  };

  return (
    <div className={styles.summary}>
      <div>
        Всего доход: <span className={styles.income}>{totalIncome}</span>
      </div>
      <div>
        Всего расход: <span className={styles.expense}>{totalExpense}</span>
      </div>
      <div>
        Остаток: <span className={styles.remain}>{remain}</span>
      </div>

      <div>
        <label>Поиск по тратам:</label>
        <form onSubmit={searchInBudget} className={styles.searchInBudget}>
          <input
            type="text"
            className={styles.searchInBudget__field}
            onChange={changeSearchingWord}
            value={searchingWord}
          />
          <button type="submit" className={styles.darkButton}>
            Поиск
          </button>
        </form>
      </div>
      <div>Общие затраты по типам:</div>
      <ul className={styles.expenciesByType}>
        {summaryExpenses.map(([type, total]) => (
          <li key={type}>
            <input
              type="checkbox"
              checked={selectedTypesForGraphic[type] || false}
              onChange={(event) => handleCheckboxChange(event, type)}
              className={styles.expenciesByTypeCheck}
            />
            {type}: {total}
            {selectedTypesForGraphic[type] && (
              <input
                type="color"
                value={selectedTypesForGraphic[type].color || "#000000"}
                onChange={(event) =>
                  handleColorChange(type, event.target.value)
                }
                className={styles.expenciesByTypeColor}
              />
            )}
          </li>
        ))}
      </ul>
      <canvas
        ref={canvasRef}
        width={"auto"}
        max-height={20 + "vh"}
        style={{ border: "1px solid black" }}
      />
    </div>
  );
};

export default Summary;
