import axios from "axios";
import { useState, useEffect } from "react";
import Transaction from "../Transaction";
import TransactionForm from "../TransactionForm";
import EditTransaction from "../editTransaction";
import DeleteTransaction from "../DeleteTransaction";
import { downloadBudget } from "../engine";

function LoginedApp({ username, password }) {
  const now = new Date();
  const formattedDate = now.toISOString().split("T")[0];
  const [budget, setBudget] = useState([]);
  const [receivedData, setReceivedData] = useState(false);
  const [formData, setFormData] = useState({
    date: formattedDate,
    amount: 0,
    type: "Расход",
    transactionType: [],
  });
  const [transactionTypesArray, setTransactionTypesArray] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editTransaction, setEditTransaction] = useState();
  const [totalExpensesByType, setTotalExpenseByType] = useState({});
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [remain, setRemain] = useState(0);

  useEffect(() => {
    setRemain(totalIncome - totalExpense);
  }, [totalIncome, totalExpense]);

  function compileIncome(budget) {
    return budget.reduce((total, transaction) => {
      return transaction.type === "Доход"
        ? total + Number(transaction.amount)
        : total;
    }, 0);
  }

  function compileTotalExpense(budget) {
    return budget.reduce((total, transaction) => {
      return transaction.type === "Расход"
        ? total + Number(transaction.amount)
        : total;
    }, 0);
  }

  function recompileBudget() {
    const newTotalExpensesByType = {};

    budget.forEach((transaction) => {
      if (transaction.type === "Расход") {
        transaction.transactionType.forEach((type) => {
          const [typeName, typePrice] = type
            .split(":")
            .map((item) => item.trim());
          newTotalExpensesByType[typeName] =
            (newTotalExpensesByType[typeName] || 0) + Number(typePrice);
        });
      }
    });

    setTotalIncome(compileIncome(budget));
    setTotalExpense(compileTotalExpense(budget));
    setTotalExpenseByType(newTotalExpensesByType);
  }

  useEffect(() => {
    recompileBudget();
    setRemain(totalIncome - totalExpense);
  }, [budget]);

  useEffect(() => {
    downloadBudget(username, password, setBudget, setReceivedData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "transactionType") {
      const transactionTypesArray = value.split(",");
      let total = parseFloat(0);
      transactionTypesArray.forEach((transaction) => {
        const [typeName, typePrice] = transaction
          .split(":")
          .map((item) => item.trim());
        total += parseFloat(typePrice);
      });
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

    const newTransaction = {
      id: new Date(), // Генерируем номер для новой транзакции
      date: formData.date,
      amount: formData.amount,
      type: formData.type,
      transactionType: formData.transactionType,
    };

    // Добавляем новую транзакцию на сервер
    axios
      .post(
        "https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/addrecord",
        {
          userName: username,
          password: password,
          transaction: newTransaction,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === "success") {
          console.log(response.data.message);
          // Обновляем состояние бюджета после успешного добавления транзакции
          setBudget([...budget, newTransaction]);
        } else {
          console.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Ошибка при добавлении транзакции:", error);
      });

    // Очищаем поля формы после добавления транзакции
    setFormData({
      date: formattedDate,
      amount: "",
      type: "Расход",
      transactionType: [],
    });
  };

  const compareDatesAsc = (a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  };

  const compareDatesDesc = (a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  };

  const sortBudget = (ascending) => {
    const sortedBudget = [...budget];
    sortedBudget.sort(ascending ? compareDatesAsc : compareDatesDesc);
    setBudget(sortedBudget);
  };

  useEffect(() => {
    if (receivedData) {
      sortBudget(false);
    }
  }, [receivedData]);

  return (
    <div className="budget">
      <TransactionForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        formData={formData}
        buttonText="Добавить"
      />
      <div className="info-container">
        <div className="transactions">
          <h2>Список транзакций:</h2>
          <div className="transaction-controls">
            <button onClick={() => sortBudget(true)}>Сначала старые</button>
            <button onClick={() => sortBudget(false)}>Сначала новые</button>
          </div>
          <ul className="transactions-records">
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
                setIsDeleting={setIsDeleting}
              />
            ))}
          </ul>
        </div>
        <div className="summary">
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
      {isEditing && (
        <EditTransaction
          transactionData={editTransaction}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setReceivedData={setReceivedData}
          setBudget={setBudget}
          username={username}
          password={password}
        />
      )}
      {isDeleting && (
        <DeleteTransaction
          setIsDeleting={setIsDeleting}
          transactionData={editTransaction}
          setReceivedData={setReceivedData}
          setBudget={setBudget}
          username={username}
          password={password}
        />
      )}
    </div>
  );
}

export default LoginedApp;
