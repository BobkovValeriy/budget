import './App.css';
import { useState } from "react";

function Transaction({
  transaction,
  setTransactionTypesArray,
  editRecord,
  setIsEditing,
  setEditTransaction,
  isEditing,
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

  return (
    <li className={transaction.type === "Доход" ? "income" : "expense"}>
      <div className="record-wrapper">
        <button onClick={(e) => editRecord(e)} className="change-record">
          {" "}
          Редактировать
        </button>
        <span
          className="record-sum"
          onClick={(e) => {
            e.stopPropagation();
            transactionDetails(transaction);
          }}
        >
          {" "}
          Дата: {transaction.date}, Сумма: {transaction.amount}
        </span>
      </div>
      {showTransaction &&
        selectedTransaction &&
        selectedTransaction === transaction && (
          <div className="transaction-details">
            Расшифровка: {selectedTransaction.transactionType.join(", ")}
          </div>
        )}
    </li>
  );
}
export default Transaction;