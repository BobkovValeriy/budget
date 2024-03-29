import "./App.css";
import "./editTransaction.scss";
import { useState } from "react";
import TransactionForm from "./TransactionForm";
import axios from "axios";
import { downloadBudget } from "./engine";

function EditTransaction({
  transactionData,
  setReceivedData,
  isEditing,
  setIsEditing,
  setBudget,
  username,
  password,
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
  const apiEndpoint =
    "https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/";
  const closeEditing = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
            amount: parseFloat(dataFormForChange.amount),
            type: dataFormForChange.type,
            transactionType: dataFormForChange.transactionType,
          },
        }
      );

      console.log("Запись успешно обновлена!", updateResponse.data);

      // Получение бюджета после успешного обновления
      downloadBudget(username, password, setBudget, setReceivedData);
    } catch (error) {
      // Обработка ошибок
      console.error("Ошибка при обновлении записи:", error);
      // Дополнительные действия, например, уведомление пользователя об ошибке
    }

    setIsEditing(!isEditing);
  };
  return (
    <div className="editing-transaction">
      <TransactionForm
        handleSubmit={handleSubmit}
        handleChange={changeTransactionData}
        formData={dataFormForChange}
        buttonText="обновить"
        exitButton={
          <div className="exit-button__wrapper">
            <button
              className="exit-button"
              type="button"
              onClick={closeEditing}
            >
              отмена
            </button>
          </div>
        }
      />
    </div>
  );
}
export default EditTransaction;
