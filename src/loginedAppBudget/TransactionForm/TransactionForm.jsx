import { useState, useEffect } from "react";
import styles from "./TransactionFormStyles.module.scss";

function TransactionForm({
  handleChange,
  handleSubmit,
  formData = {},
  username,
  password,
  setBudget,
  budget,
  setFormData,
  formattedDate,
  buttonText,
  exitButton = null,
}) {
  const { date = "", type = "Доход", transactionType = [] } = formData;
  useEffect(() => {
    if (Array.isArray(transactionType) && transactionType.length > 0) {
      const incomeObjects = transactionType.map((item) => {
        const [target, amount] = item
          .split(":")
          .map((subItem) => subItem.trim());
        return { target, amount: parseFloat(amount) };
      });
      setIncomes(incomeObjects);
    }
  }, []);
  const [incomes, setIncomes] = useState([
    { target: "", amount: parseFloat(0) },
  ]);
  const handleIncomesChange = (e, index) => {
    const { name, value } = e.target;
    const updatedIncomes = [...incomes];
    updatedIncomes[index] = { ...updatedIncomes[index], [name]: value };
    setIncomes(updatedIncomes);
    if (
      index === updatedIncomes.length - 1 &&
      updatedIncomes[index].target &&
      updatedIncomes[index].amount
    ) {
      setIncomes([...updatedIncomes, { target: "", amount: "" }]);
    }
  };

  return (
    <div className={styles.form__container}>
      {exitButton}
      <form
        onSubmit={(e) =>
          handleSubmit(
            e,
            incomes,
            setIncomes,
            formData,
            username,
            password,
            setBudget,
            budget,
            setFormData,
            formattedDate
          )
        }
      >
        <div>
          <label htmlFor="date">Дата:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Тип:</label>
          <input
            type="radio"
            name="type"
            value="Расход"
            id="expense"
            checked={type === "Расход"}
            onChange={handleChange}
          />
          <label htmlFor="expense">Расход</label>
          <input
            type="radio"
            name="type"
            value="Доход"
            id="income"
            checked={type === "Доход"}
            onChange={handleChange}
          />
          <label htmlFor="income">Доход</label>
        </div>
        <div className={styles.incomes}>
          {incomes.map((detail, index) => (
            <div key={index} className={styles.income}>
              <input
                type="text"
                id={`target-${index}`}
                name="target"
                value={detail.target}
                placeholder="Цель траты"
                onChange={(e) => handleIncomesChange(e, index)}
                className={styles.income__target}
              />
              <input
                type="number"
                id={`amount-${index}`}
                name="amount"
                value={detail.amount}
                placeholder="Сумма"
                onChange={(e) => handleIncomesChange(e, index)}
                className={styles.income__amount}
              />
            </div>
          ))}
        </div>
        <button type="submit">{buttonText}</button>
      </form>
    </div>
  );
}

export default TransactionForm;
