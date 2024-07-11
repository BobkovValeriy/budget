import styles from "./Transaction.module.scss";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { downloadBudget } from "../engine";

function Transaction({
  username,
  password,
  setBudget,
  transaction,
  setIsEditing,
  setEditTransaction,
  isEditing,
  setIsDeleting,
}) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransaction, setShowTransaction] = useState(false);

  function transactionDetails(transaction) {
    setSelectedTransaction(transaction);
    setShowTransaction(!showTransaction);
  }
  function editRecord(e) {
    e.preventDefault();

    if (transaction.summary === true) {
      const nowDay = transaction.date;
      downloadBudget(username, password, setBudget, nowDay);
    } else {
      setIsEditing(!isEditing);
      setEditTransaction(transaction);
    }
  }
  function deleteRecord(e) {
    e.preventDefault();
    if (transaction.summary === true) {
      const nowDay = transaction.date;
      downloadBudget(username, password, setBudget, nowDay);
    } else {
      setIsDeleting(true);
      setEditTransaction(transaction);
    }
  }

  return (
    <li
      className={transaction.type === "Доход" ? styles.income : styles.expense}
    >
      <div
        className={styles.record__wrapper}
        onClick={(e) => {
          e.stopPropagation();
          transactionDetails(transaction);
          console.log(transaction);
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            editRecord(e);
          }}
          className={styles.change__record}
        >
          <FaEdit />
        </button>
        <span className={styles.record__sum}>
          {" "}
          Дата: {transaction.date}, Сумма: {transaction.amount}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteRecord(e);
          }}
          className={styles.delete__record}
        >
          <RiDeleteBin2Fill />
        </button>
      </div>
      {showTransaction &&
        selectedTransaction &&
        selectedTransaction === transaction && (
          <div className={styles.transaction__details}>
            Расшифровка: {selectedTransaction.transactionType.join(", ")}
          </div>
        )}
    </li>
  );
}
export default Transaction;
