import './App.css';
import axios from "axios";
import { useState, useEffect } from "react";
import Transaction from "./Transaction";
import TransactionForm from "./TransactionForm"

function App() {
  const [budget, setBudget] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    amount: 0,
    type: "Доход",
    transactionType: [], // Изменяем на массив для хранения типов транзакций
  });
  const [transactionTypesArray, setTransactionTypesArray] = useState([]);

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



  useEffect(() => {
    // Выполнить GET-запрос при загрузке компонента
    axios.get('https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/getbudget')
      .then((response) => {
        console.log(response)
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
      let total = parseFloat(0);
      transactionTypesArray.forEach((transaction) => {
        const [typeName, typePrice] = transaction.split(":").map((item) => item.trim());
        total += parseFloat(typePrice)
      })
      setFormData({
        ...formData,
        [name]: transactionTypesArray,
        amount: total,
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
    console.log(formData)
    axios.post('https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/addrecord', formData)
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
      <TransactionForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
      />
      <div className="info-container">
        <div className='transactions'>
          <h2>Список транзакций:</h2>
          <ul>
            {budget.map((transaction, index) => (
              <Transaction
                key={index}
                transaction={transaction}
                setTransactionTypesArray={setTransactionTypesArray}
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
              />
            ))}
          </ul>
        </div>
        <div className='summary'>
          <div>Всего доход: {totalIncome}</div>
          <div>Всего расход: {totalExpense}</div>
          <div>Остаток: {remain} </div>
          <div>Общие затраты по типам:</div>
          <ul>
            {Object.entries(totalExpensesByType)
              .sort(([, totalA], [, totalB]) => totalB - totalA) // Сортировка по убыванию total
              .map(([type, total]) => (
                <li key={type}>
                  {type}: {total}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;