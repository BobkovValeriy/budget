import { sortBudget } from "../engine";
import styles from "./TransactionControls.module.scss";
const TransactionControls = function ({ budget, setBudget, downloadBudget }) {
  return (
    <div className={styles.transaction__controls}>
      <button onClick={() => sortBudget(true, budget, setBudget)}>
        Сначала старые
      </button>
      <button onClick={() => sortBudget(false, budget, setBudget)}>
        Сначала новые
      </button>
      <button onClick={() => downloadBudget()}>Обновить данные</button>
    </div>
  );
};
export default TransactionControls;
