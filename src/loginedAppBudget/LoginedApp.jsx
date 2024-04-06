import { useState, useEffect } from "react";
import styles from "../App.module.scss";
import Transaction from "./Transaction/Transaction";
import TransactionForm from "./TransactionForm/TransactionForm";
import EditTransaction from "./EditTransaction/editTransaction";
import DeleteTransaction from "./DeleteTransaction/DeleteTransaction";
import { addRecord, downloadBudget, sortBudget } from "./engine";
import LoadingBars from "../preloading/LoadingBars";

function LoginedApp({ username, password }) {
  const now = new Date();
  const formattedDate = now.toISOString().split("T")[0];
  const [budget, setBudget] = useState([]);
  const [formData, setFormData] = useState({
    date: formattedDate,
    amount: 0,
    type: "Расход",
    transactionType: [],
  });
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
    downloadBudget(username, password, setBudget);
    sortBudget(false, budget, setBudget);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className={styles.budget}>
      <TransactionForm
        handleChange={handleChange}
        handleSubmit={addRecord}
        formData={formData}
        username={username}
        password={password}
        setBudget={setBudget}
        budget={budget}
        setFormData={setFormData}
        formattedDate={formattedDate}
        buttonText="Добавить"
      />
      {budget.length === 0 ? (
        <LoadingBars />
      ) : (
        <div className={styles.info__container}>
          <div className={styles.transactions}>
            <>
              <h2>Список транзакций:</h2>
              <div className={styles.transaction__controls}>
                <button onClick={() => sortBudget(true, budget, setBudget)}>
                  Сначала старые
                </button>
                <button onClick={() => sortBudget(false, budget, setBudget)}>
                  Сначала новые
                </button>
              </div>
              <ul className={styles.transactions__records}>
                {budget.map((transaction, index) => (
                  <Transaction
                    key={index}
                    transaction={transaction}
                    setFormData={setFormData}
                    handleChange={handleChange}
                    setIsEditing={setIsEditing}
                    setEditTransaction={setEditTransaction}
                    isEditing={isEditing}
                    setIsDeleting={setIsDeleting}
                  />
                ))}
              </ul>
            </>
          </div>

          <div className={styles.summary}>
            <div>
              Всего доход:
              <span className={styles.income}>{totalIncome}</span>
            </div>
            <div>
              Всего расход:
              <span className={styles.expense}>{totalExpense}</span>
            </div>
            <div>
              Остаток: <span className={styles.remain}>{remain}</span>
            </div>
            <div>Общие затраты по типам:</div>
            <ul>
              {Object.entries(totalExpensesByType)
                .sort(([, totalA], [, totalB]) => totalB - totalA)
                .map(([type, total]) => (
                  <li key={type}>
                    {type}: {total}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {isEditing && (
        <EditTransaction
          transactionData={editTransaction}
          formData={formData}
          username={username}
          password={password}
          setBudget={setBudget}
          budget={budget}
          setFormData={setFormData}
          formattedDate={formattedDate}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}
      {isDeleting && (
        <DeleteTransaction
          setIsDeleting={setIsDeleting}
          transactionData={editTransaction}
          budget={budget}
          setBudget={setBudget}
          username={username}
          password={password}
        />
      )}
    </div>
  );
}

export default LoginedApp;
