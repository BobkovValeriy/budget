import styles from "./Transaction.module.scss";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { downloadBudget } from "../../../src/engine";

function Transaction({
  username,
  password,
  setBudget,
  transaction,
  setIsEditing,
  setEditTransaction,
  isEditing,
  setIsDeleting,
  findTheTransactionType,
  text,
}) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransaction, setShowTransaction] = useState(false);
  const [highlight, setHighlight] = useState(false);

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
  useEffect(() => {
    setHighlight(transaction.transactionType.includes(findTheTransactionType));
  }, [findTheTransactionType, transaction.transactionType]);

  return (
    <li
      className={`${
        transaction.type === "Доход" ? styles.income : styles.expense
      } ${highlight ? styles.highlight : ""}`}
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
          {text.transaction_date} {transaction.date}, {text.transaction_amount}{" "}
          {transaction.amount}
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
            {text.transaction__details}{" "}
            {selectedTransaction.transactionType.join(", ")}
          </div>
        )}
    </li>
  );
}
export default Transaction;
