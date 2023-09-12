import './App.css';
import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [budget, setBudget] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    type: "Доход",
    transactionType: [], // Изменяем на массив для хранения типов транзакций
  });

  const totalIncome = budget.reduce((total, transaction) => {
    return transaction.type === "Доход" ? total + Number(transaction.amount) : total;
  }, 0);

  const totalExpense = budget.reduce((total, transaction) => {
    return transaction.type === "Расход" ? total + Number(transaction.amount) : total;
  }, 0);

  const totalExpensesByType = {};
  budget.forEach((transaction) => {
    if (transaction.type === "Расход") {
      transaction.transactionType.forEach((type) => {
        const [typeName, typePrice] = type.split(":").map((item) => item.trim());
        totalExpensesByType[typeName] = (totalExpensesByType[typeName] || 0) + Number(typePrice);
      });
    }
  });

  const remain = totalIncome - totalExpense;

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionTypesArray, setTransactionTypesArray] = useState([]);

  useEffect(() => {
    // Выполнить GET-запрос при загрузке компонента
    axios.get('/api/get-records')
      .then((response) => {
        // Установить данные из ответа в состояние
        setBudget(response.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении данных из базы данных:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "transactionType") {
      const transactionTypesArray = value.split(","); //.map((item) => item.trim())
      setFormData({
        ...formData,
        [name]: transactionTypesArray,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Создаем новую транзакцию и добавляем ее к массиву budget
    const newTransaction = {
      date: formData.date,
      amount: formData.amount,
      type: formData.type,
      transactionType: formData.transactionType, // Отправляем массив типов транзакций
    };
    setBudget([...budget, newTransaction]);

    // Отправляем данные на сервер
    axios.post('/api/add-record', formData)
      .then(response => {
        console.log("Запись успешно добавлена.");
      })
      .catch(error => {
        console.error("Ошибка при добавлении записи:", error);
      });

    // Очищаем поля формы после добавления записи
    setFormData({
      date: "",
      amount: "",
      type: "Доход",
      transactionType: [], // Очищаем массив типов транзакций
    });
  };

  return (
    <div className="budget">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="date">Дата:</label>
            <input
              type="text"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="amount">Сумма:</label>
            <input
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Тип:</label>
            <label>
              <input
                type="radio"
                name="type"
                value="Доход"
                checked={formData.type === "Доход"}
                onChange={handleChange}
              />
              Доход
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="Расход"
                checked={formData.type === "Расход"}
                onChange={handleChange}
              />
              Расход
            </label>
          </div>
          <div>
            <label htmlFor="transactionType">Тип транзакции (разделяйте запятыми):</label>
            <textarea
              id="transactionType"
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Добавить запись</button>
        </form>
      </div>
      <div className="info-container">
        <div className='transactions'>
          <h2>Список транзакций:</h2>
          <ul>
            {budget.map((transaction, index) => (
              <li
                key={index}
                className={transaction.type === "Доход" ? "income" : "expense"}
                onClick={() => {
                  setSelectedTransaction(transaction);
                  setTransactionTypesArray(transaction.transactionType);
                }}
              >
                Дата: {transaction.date}, Сумма: {transaction.amount}
                {selectedTransaction && selectedTransaction === transaction && (
                  <div className="transaction-details">
                    Расшифровка: {selectedTransaction.transactionType.join(", ")}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className='summary'>
          <div>Всего доход: {totalIncome}</div>
          <div>Всего расход: {totalExpense}</div>
          <div>Остаток: {remain} </div>
          <div>Общие затраты по типам:</div>
          <ul>
            {Object.entries(totalExpensesByType).map(([type, total]) => (
              <li key={type}>
                Трата: {type}, Общая сумма: {total};
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;