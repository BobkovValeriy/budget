import styles from "./editTransaction.module.scss";
import { useState,useEffect } from "react";
import TransactionForm from "../TransactionForm/TransactionForm";
import axios from "axios";
import { downloadBudget, apiEndpoint } from "../../../src/engine";

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
  text,
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

    setDataFormForChange((prevData) => {
        if (name === "date" && value instanceof Date) {
            // Если обновляется дата
            return {
                ...prevData,
                date: value,
            };
        } else if (name === "transactionType") {
            // Если обновляется transactionType
            const transactionTypesArray = value.split(",");
            let total = 0;

            transactionTypesArray.forEach((transaction) => {
                const [, typePrice] = transaction.split(":").map((item) => item.trim());
                total += parseFloat(typePrice);
            });

            return {
                ...prevData,
                [name]: transactionTypesArray,
                amount: total,
            };
        } else {
            // Для всех остальных случаев
            return {
                ...prevData,
                [name]: value,
            };
        }
    });
  };

  const closeEditing = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e, incomes, showAddErrorFunction) => {
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
      console.log("edit transaction")
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
      // console.log("Запись успешно обновлена!", updateResponse.data);
      setIsEditing(!isEditing);
    } catch (error) {
      // Обработка ошибок
      showAddErrorFunction()
      console.error("Ошибка при обновлении записи:", error);
      // Дополнительные действия, например, уведомление пользователя об ошибке
    }
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
          buttonText={text.et_update}
          exitButton={
            <div className={styles.exit__button__wrapper}>
              <button
                className={styles.exit__button}
                type="button"
                onClick={closeEditing}
              >
                {text.et_cancel}
              </button>
            </div>
          }
          text={text}
        />
      </div>
    </div>
  );
}
export default EditTransaction;
