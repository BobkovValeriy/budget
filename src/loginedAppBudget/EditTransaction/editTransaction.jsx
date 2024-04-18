import styles from "./editTransaction.module.scss";
import { useState } from "react";
import TransactionForm from "../TransactionForm/TransactionForm";
import axios from "axios";
import { downloadBudget, sortBudget, apiEndpoint } from "../engine";

function EditTransaction({
  transactionData,
  setReceivedData,
  isEditing,
  setIsEditing,
  budget,
  setBudget,
  username,
  password,
  setFormData,
  formattedDate,
}) {
  let { amount, date, transactionType, type, id } = transactionData;
  const [dataFormForChange, setDataFormForChange] = useState({
    date: date,
    amount: amount,
    type: type,
    transactionType: transactionType,
  });
  const changeTransactionData = (e) => {
    const { name, value } = e.target;
    if (name === "transactionType") {
      const transactionTypesArray = value.split(","); //.map((item) => item.trim())
      let total = parseFloat(0);
      transactionTypesArray.forEach((transaction) => {
        const [typeName, typePrice] = transaction
          .split(":")
          .map((item) => item.trim());
        total += parseFloat(typePrice);
      });
      setDataFormForChange({
        ...dataFormForChange,
        [name]: transactionTypesArray,
        amount: total,
      });
    } else {
      setDataFormForChange({
        ...dataFormForChange,
        [name]: value,
      });
    }
  };
  const closeEditing = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e, incomes) => {
    e.preventDefault();
    const arrayToSend = [];
    let total = parseFloat(0);
    incomes.map((income) => {
      if (
        income.target !== "" &&
        !isNaN(income.amount) &&
        typeof income.amount !== "undefined"
      ) {
        total += parseFloat(income.amount);
        arrayToSend.push(income.target + ":" + income.amount);
      }
    });

    try {
      // Отправка данных на обновление записи
      const updateResponse = await axios.post(
        `${apiEndpoint}changeBudgetRecord`,
        {
          userName: username,
          password: password,
          transaction: {
            id: id,
            date: dataFormForChange.date,
            amount: total,
            type: dataFormForChange.type,
            transactionType: arrayToSend,
          },
        }
      );
      downloadBudget(username, password, setBudget, setReceivedData);
      sortBudget(false, budget, setBudget);
      console.log("Запись успешно обновлена!", updateResponse.data);
    } catch (error) {
      // Обработка ошибок
      console.error("Ошибка при обновлении записи:", error);
      // Дополнительные действия, например, уведомление пользователя об ошибке
    }
    setIsEditing(!isEditing);
  };
  return (
    <div className={styles.editing__transaction} onClick={closeEditing}>
      <div
        className={styles.edititng__wrapper}
        onClick={(e) => e.stopPropagation()}
      >
        <TransactionForm
          handleSubmit={handleSubmit}
          handleChange={changeTransactionData}
          formData={dataFormForChange}
          username={username}
          password={password}
          setBudget={setBudget}
          budget={budget}
          setFormData={setFormData}
          formattedDate={formattedDate}
          buttonText="обновить"
          exitButton={
            <div className={styles.exit__button__wrapper}>
              <button
                className={styles.exit__button}
                type="button"
                onClick={closeEditing}
              >
                отмена
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
}
export default EditTransaction;
