import styles from "./DeleteTransaction.module.scss";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FiDelete } from "react-icons/fi";
import { deleteRecord } from "../../../src/engine";

function DeleteTransaction({
  setIsDeleting,
  transactionData,
  budget,
  setBudget,
  username,
  password,
}) {
  let { id } = transactionData;

  const cancelDeleteRecord = (e) => {
    e.preventDefault();
    setIsDeleting(false);
  };

  return (
    <div
      className={styles.delete__transaction}
      onClick={(e) => cancelDeleteRecord(e)}
    >
      <div
        className={styles.delete__transaction__wrapper}
        onClick={(e) => e.stopPropagation()}
      >
        <div>Вы желаете удалить запись?</div>
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
                  setIsDeleting
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
