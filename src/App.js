import './App.css';
import axios from "axios";
import { useState, useEffect } from "react";
import Transaction from "./Transaction";
import TransactionForm from "./TransactionForm"
import EditTransaction from './editTransaction';

function App() {
  const [budget, setBudget] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    amount: 0,
    type: "Доход",
    transactionType: [], // Изменяем на массив для хранения типов транзакций
  });
  const [transactionTypesArray, setTransactionTypesArray] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editTransction, setEditTransaction] = useState();

  const totalIncome = budget.reduce((total, transaction) => {
    return transaction.type === "Доход" ? total + Number(transaction.amount) : total;
  }, 0);

  const totalExpense = budget.reduce((total, transaction) => {
    return transaction.type === "Расход" ? total + Number(transaction.amount) : total;
  }, 0);

  const totalExpensesByType = {};
  function recompileBudget() {
    budget.forEach((transaction) => {
      if (transaction.type === "Расход") {
        transaction.transactionType.forEach((type) => {
          const [typeName, typePrice] = type.split(":").map((item) => item.trim());
          totalExpensesByType[typeName] = (totalExpensesByType[typeName] || 0) + Number(typePrice);
        });
      }
    });
  }
  recompileBudget()
  useEffect(() => {
    recompileBudget()
  }, [budget])


  const remain = totalIncome - totalExpense;



  useEffect(() => {
    // Выполнить GET-запрос при загрузке компонента
    axios.get('https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/getbudget')
      .then((response) => {
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

    axios.post('https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/addrecord', newTransaction,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
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
  const compareDatesAsc = (a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();

    return dateA - dateB;
  };
  const compareDatesDesc = (a, b) => {
    const dateA = new Date(a.date).getTime();
    // console.log(new Date(a.date), dateA)
    const dateB = new Date(b.date).getTime();

    return dateB - dateA;
  };
  const sortBudget = (ascending) => {
    const sortedBudget = [...budget];
    sortedBudget.sort(ascending ? compareDatesAsc : compareDatesDesc);
    setBudget(sortedBudget);
  };

  return (
    <div className="budget">
      <TransactionForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
        buttonText="Добавить"
      />
      <div className="info-container">
        <div className='transactions'>
          <h2>Список транзакций:</h2>
          <button onClick={() => sortBudget(true)}>Сначала старые</button>
          <button onClick={() => sortBudget(false)}>Сначала новые</button>
          <ul>
            {budget.map((transaction, index) => (
              <Transaction
                key={index}
                transaction={transaction}
                setTransactionTypesArray={setTransactionTypesArray}
                setFormData={setFormData}
                handleChange={handleChange}
                setIsEditing={setIsEditing}
                setEditTransaction={setEditTransaction}
                isEditing={isEditing}
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
      {isEditing && <EditTransaction
        transactionData={editTransction}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setBudget={setBudget}
      />}
    </div>
  );
}

export default App;