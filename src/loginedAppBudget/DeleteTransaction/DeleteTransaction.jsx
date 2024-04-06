import styles from "./DeleteTransaction.module.scss";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FiDelete } from "react-icons/fi";
import { deleteRecord } from "../engine";

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
    <div className={styles.delete__transaction}>
      <div className={styles.delete__transaction__wrapper}>
        <div>Вы желаете удалить запись?</div>
        <div className={styles.delete__transaction__controls}>
          <button
            onClick={(e) =>
              deleteRecord(
                (e) => e,
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
          <button onClick={(e) => cancelDeleteRecord(e)}>
            <FiDelete />
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteTransaction;
