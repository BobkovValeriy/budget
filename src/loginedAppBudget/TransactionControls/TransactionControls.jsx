import { sortBudget } from "../../../src/engine.js";
import styles from "./TransactionControls.module.scss";
const TransactionControls = function ({
  setFindTheTransactionType,
  findTheTransactionType,
  budget,
  setBudget,
  downloadBudget,
  text,
}) {
  const changeFindingWord = (e) => {
    setFindTheTransactionType(e.target.value);
  };
  return (
    <div className={styles.transaction__controls}>
      <button onClick={() => sortBudget(true, budget, setBudget)}>
        {text.tr_contrl_oldbegin}
      </button>
      <button onClick={() => sortBudget(false, budget, setBudget)}>
        {text.tr_contrl_newbegin}
      </button>
      <button onClick={() => downloadBudget()}>{text.tr_contrl_reload}</button>
      <input
        type="text"
        id="find-word"
        name="find-word"
        value={findTheTransactionType}
        onChange={changeFindingWord}
        placeholder={text.tr_contrl_find}
      />
    </div>
  );
};
export default TransactionControls;
