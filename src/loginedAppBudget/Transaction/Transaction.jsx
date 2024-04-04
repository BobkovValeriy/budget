import styles from "./Transaction.module.scss";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin2Fill } from "react-icons/ri";

function Transaction({
  transaction,
  setTransactionTypesArray,
  editRecord,
  setIsEditing,
  setEditTransaction,
  isEditing,
  setIsDeleting,
}) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransaction, setShowTransaction] = useState(false);

  function transactionDetails(transaction) {
    setSelectedTransaction(transaction);
    setTransactionTypesArray(transaction.transactionType);
    setShowTransaction(!showTransaction);
  }
  function editRecord(e) {
    e.preventDefault();
    setIsEditing(!isEditing);
    setEditTransaction(transaction);
  }
  function deleteRecord(e) {
    e.preventDefault();
    setIsDeleting(true);
    setEditTransaction(transaction);
  }

  return (
    <li
      className={transaction.type === "Доход" ? styles.income : styles.expense}
    >
      <div className={styles.record__wrapper}>
        <button
          onClick={(e) => editRecord(e)}
          className={styles.change__record}
        >
          <FaEdit />
        </button>
        <span
          className={styles.record__sum}
          onClick={(e) => {
            e.stopPropagation();
            transactionDetails(transaction);
          }}
        >
          {" "}
          Дата: {transaction.date}, Сумма: {transaction.amount}
        </span>
        <button
          onClick={(e) => deleteRecord(e)}
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
