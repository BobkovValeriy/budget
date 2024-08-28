import { useState, useEffect } from "react";
import styles from "../App.module.scss";
import Transaction from "./Transaction/Transaction";
import TransactionForm from "./TransactionForm/TransactionForm";
import EditTransaction from "./EditTransaction/editTransaction";
import DeleteTransaction from "./DeleteTransaction/DeleteTransaction";
import {
  addRecord,
  downloadBudget,
  recompileBudget,
} from "../../src/engine.js";
import Summary from "./Summary/Summary.jsx";
import LoadingBars from "../preloading/LoadingBars";
import Calculator from "./Calculator/Calculator";
import MobileNavBar from "./MobileNavBar/MobileNavBar";
import TransactionControls from "./TransactionControls/TransactionControls";
import { useSelector } from "react-redux";

function LoginedApp({ username, password}) {
  const text = useSelector((state) => state.langReducer);
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
  const [showCalc, setShowCalc] = useState(true);
  const [showHistory, setShowHistory] = useState(true);
  const [showStatistic, setShowStatistic] = useState(true);
  const [showForm, setShowForm] = useState(true);
  const [findTheTransactionType, setFindTheTransactionType] = useState("");

  useEffect(() => {
    setRemain(totalIncome - totalExpense);
  }, [totalIncome, totalExpense]);

  useEffect(() => {
    recompileBudget(
      budget,
      setTotalIncome,
      setTotalExpense,
      setTotalExpenseByType
    );
    setRemain(totalIncome - totalExpense);
  }, [budget]);

  useEffect(() => {
    downloadBudget(username, password, setBudget);
  }, []);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1010px)");

    const handleMediaQueryChange = (e) => {
      if (e.matches) {
        // При размере экрана <= 768px скрываем все элементы
        setShowCalc(false);
        setShowHistory(false);
        setShowStatistic(false);
        setShowForm(true);
      } else {
        // При размере экрана > 768px показываем все элементы
        setShowCalc(true);
        setShowHistory(true);
        setShowStatistic(true);
        setShowForm(true);
      }
    };

    // Устанавливаем обработчик изменения размера экрана
    mediaQuery.addListener(handleMediaQueryChange);

    // Вызываем функцию для начальной настройки
    handleMediaQueryChange(mediaQuery);

    // Очищаем обработчик при размонтировании компонента
    return () => mediaQuery.removeListener(handleMediaQueryChange);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className={styles.app__wrapper}>
      <MobileNavBar
        setShowCalc={setShowCalc}
        setShowHistory={setShowHistory}
        setShowStatistic={setShowStatistic}
        setShowForm={setShowForm}
        text={text}
      />
      <div className={styles.budget}>
        {(showForm || showCalc) && (
          <div className={styles.form_bar}>
            {showForm && (
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
                buttonText={text.logined_trans_button_text}
                text={text}
              />
            )}
            {showCalc && <Calculator />}
          </div>
        )}
        {budget.length === 0 ? (
          <LoadingBars />
        ) : (
          (showHistory || showStatistic) && (
            <div className={styles.info__container}>
              {showHistory && (
                <div className={styles.transactions}>
                  <h2>{text.logined_trans_list}</h2>
                  <TransactionControls
                    setFindTheTransactionType={setFindTheTransactionType}
                    findTheTransactionType={findTheTransactionType}
                    budget={budget}
                    setBudget={setBudget}
                    downloadBudget={() =>
                      downloadBudget(username, password, setBudget)
                    }
                    text={text}
                  />
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
                        username={username}
                        password={password}
                        setBudget={setBudget}
                        findTheTransactionType={findTheTransactionType}
                        text={text}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {showStatistic && (
                <Summary
                  totalIncome={totalIncome}
                  totalExpense={totalExpense}
                  remain={remain}
                  totalExpensesByType={totalExpensesByType}
                  budget={budget}
                  text={text}
                />
              )}
            </div>
          )
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
            text={text}
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
            text={text}
          />
        )}
      </div>
    </div>
  );
}

export default LoginedApp;
