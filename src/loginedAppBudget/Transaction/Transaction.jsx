import styles from "./Transaction.module.scss";
import {useEffect, useState, useRef} from "react";
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
  const [checked, setChecked]= useState(false);

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
    const isMatch = transaction.transactionType.some((tr) => {
      let [name] = tr.split(":").map((item) => item.trim());
      return name.includes(findTheTransactionType)&&findTheTransactionType != "";
    });
  
    setChecked(isMatch);
  }, [findTheTransactionType, transaction.transactionType]);
  return (
    <div
    className={`
      ${transaction.type === "Доход" ? 
      (checked ? styles.income_checked : styles.income) : 
      (checked ? styles.expense_checked : styles.expense)} 
      ${!checked && findTheTransactionType ? styles.hidden : ''}
      `}
  >
        <div
          className={styles.record__wrapper}
          onClick={(e) => {
            e.stopPropagation();
            transactionDetails(transaction);
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
              {text.transaction__details}
              {selectedTransaction.transactionType.map((tr, index) => {
                let [name, amount] = tr.split(":").map((item) => item.trim());
                if (!name) return null;
                return (
                  <span 
                    key={index} 
                    className={(name.includes(findTheTransactionType) && findTheTransactionType !== "") ? styles.highlight : ""}
                  >
                    {`${tr}, `}
                  </span>
                );
              })}
            </div>
          )}
      </div>
    );
}
export default Transaction;
