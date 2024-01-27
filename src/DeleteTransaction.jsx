import "./App.css";
import "./editTransaction.scss";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FiDelete } from "react-icons/fi";
import axios from "axios";

function DeleteTransaction({ setIsDeleting, transactionData, setBudget }) {
  let { _id } = transactionData;
  console.log(_id);
  const apiEndpoint =
    "https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/";
  const deleteRecord = async (e) => {
    e.preventDefault();
    try {
      // Отправка данных на удаление записи
      const updateResponse = await axios.post(
        `${apiEndpoint}deletebudgetrecord`,
        { _id: _id },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Запись успешно удалена!", updateResponse.data);

      // Получение бюджета после успешного обновления
      const budgetResponse = await axios.get(apiEndpoint + "getbudget");
      setBudget(budgetResponse.data);
    } catch (error) {
      // Обработка ошибок
      console.error("Ошибка при удалении записи:", error);
      // Дополнительные действия, например, уведомление пользователя об ошибке
    }
    setIsDeleting(false);
  };
  function cancelDeleteRecord(e) {
    e.preventDefault();
    setIsDeleting(false);
  }
  return (
    <div className="delete-transaction">
      <div className="delete-transaction__wrapper">
        <div>Вы желаете удалить запись?</div>
        <div className="delete-transaction__controls">
          {" "}
          <button onClick={(e) => deleteRecord(e)}>
            {" "}
            <RiDeleteBin2Fill />
          </button>
          <button onClick={(e) => cancelDeleteRecord(e)}>
            {" "}
            <FiDelete />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTransaction;
