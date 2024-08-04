import { sortBudget } from "../../../src/engine.js";
import styles from "./TransactionControls.module.scss";
const TransactionControls = function ({
  budget,
  setBudget,
  downloadBudget,
  text,
}) {
  return (
    <div className={styles.transaction__controls}>
      <button onClick={() => sortBudget(true, budget, setBudget)}>
        {text.tr_contrl_oldbegin}
      </button>
      <button onClick={() => sortBudget(false, budget, setBudget)}>
        {text.tr_contrl_newbegin}
      </button>
      <button onClick={() => downloadBudget()}>{text.tr_contrl_reload}</button>
    </div>
  );
};
export default TransactionControls;
