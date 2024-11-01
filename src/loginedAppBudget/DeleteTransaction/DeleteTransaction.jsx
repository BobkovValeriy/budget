import styles from "./DeleteTransaction.module.scss";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FiDelete } from "react-icons/fi";
import { deleteRecord } from "../../../src/engine";
import { useDispatch } from "react-redux";
import { setMessage } from "../../store";
import { useState } from "react";

function DeleteTransaction({
  setIsDeleting,
  transactionData,
  budget,
  setBudget,
  username,
  password,
  text,
}) {
  const dispatch = useDispatch()
  let { id } = transactionData;
  const [showAddError, setShowAddError] = useState(false);

  const cancelDeleteRecord = (e) => {
    e.preventDefault();
    setIsDeleting(false);
  };

  function showDeleteErrorFunction(){
    dispatch(setMessage(text.dt_error))
    setTimeout(() => {
      dispatch(setMessage(''))
    }, 3000);
  }
  function showDeleteCompliteFunction(){
    dispatch(setMessage(text.dt_complite))
    setTimeout(() => {
      dispatch(setMessage(''))
    }, 500);
  }

  return (
    <div
      className={styles.delete__transaction}
      onClick={(e) => cancelDeleteRecord(e)}
    >
      <div
        className={styles.delete__transaction__wrapper}
        onClick={(e) => e.stopPropagation()}
      >
        <div>{text.dt_delete}</div>
        <div className={styles.delete__transaction__controls}>
          <div className={styles.delete__transaction__button}>
            <button
              onClick={(e) =>
                deleteRecord(
                  e,
                  id,
                  username,
                  password,
                  setBudget,
                  budget,
                  setIsDeleting,
                  showDeleteErrorFunction,
                  showDeleteCompliteFunction,
                )
              }
            >
              <RiDeleteBin2Fill />
            </button>
          </div>
          <div className={styles.delete__transaction__button}>
            <button onClick={(e) => cancelDeleteRecord(e)}>
              <FiDelete />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteTransaction;
