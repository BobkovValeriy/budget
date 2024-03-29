import "./App.css";
import "./editTransaction.scss";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FiDelete } from "react-icons/fi";
import axios from "axios";
import { downloadBudget } from "./engine";

function DeleteTransaction({
  setIsDeleting,
  transactionData,
  setReceivedData,
  setBudget,
  username,
  password,
}) {
  let { id } = transactionData; // Используем поле id для идентификации записи
  const apiEndpoint =
    "https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/";

  const deleteRecord = async (e) => {
    e.preventDefault();
    try {
      // Отправка данных на удаление записи
      const deleteResponse = await axios.post(
        `${apiEndpoint}deletebudgetrecord`,
        { id: id, username: username, password: password },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Запись успешно удалена!", deleteResponse.data);

      // Получение бюджета после успешного удаления
      downloadBudget(username, password, setBudget, setReceivedData);
    } catch (error) {
      // Обработка ошибок
      console.error("Ошибка при удалении записи:", error);
      // Дополнительные действия, например, уведомление пользователя об ошибке
    }
    setIsDeleting(false);
  };

  const cancelDeleteRecord = (e) => {
    e.preventDefault();
    setIsDeleting(false);
  };

  return (
    <div className="delete-transaction">
      <div className="delete-transaction__wrapper">
        <div>Вы желаете удалить запись?</div>
        <div className="delete-transaction__controls">
          <button onClick={(e) => deleteRecord(e)}>
            <RiDeleteBin2Fill />
          </button>
          <button onClick={(e) => cancelDeleteRecord(e)}>
            <FiDelete />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTransaction;
