import React, { useEffect, useState } from "react";
import styles from "./Summary.module.scss";
import Graphik from "./Ggraphik/Graphik";

const Summary = function ({
  totalIncome,
  totalExpense,
  remain,
  totalExpensesByType,
  budget,
  text,
}) {
  const [summaryExpenses, setSummaryExpenses] = useState([]);
  const [searchingWord, setSearchingWord] = useState("");
  const [selectedTypesForGraphic, setSelectedTypesForGraphic] = useState({});
  const [graphickData, setGraphickData] = useState({});

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
          selectedTypesForGraphic[typeName] &&
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
    setSelectedTypesForGraphic((prevState) => {
      if (isChecked) {
        return {
          ...prevState,
          [type]: { ...prevState[type], checked: true },
        };
      } else {
        const { [type]: _, ...newState } = prevState; // Деструктуризация для удаления свойства
        return newState;
      }
    });
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
        {text.sum_total_income}{" "}
        <span className={styles.income}>{totalIncome}</span>
      </div>
      <div>
        {text.sum_total_expence}{" "}
        <span className={styles.expense}>{totalExpense}</span>
      </div>
      <div>
        {text.sum_total_remain} <span className={styles.remain}>{remain}</span>
      </div>

      <div>
        <label>{text.sum_search_in_budget}</label>
        <form onSubmit={searchInBudget} className={styles.searchInBudget}>
          <input
            type="text"
            className={styles.searchInBudget__field}
            onChange={changeSearchingWord}
            value={searchingWord}
          />
          <button type="submit" className={styles.darkButton}>
            {text.sum_search}
          </button>
        </form>
      </div>
      <div>{text.sum_summary_expenses_bytype}</div>
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
      <Graphik graphickData={graphickData} />
    </div>
  );
};

export default Summary;
