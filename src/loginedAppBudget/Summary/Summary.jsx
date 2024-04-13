import styles from "./Summary.module.scss";
const Summary = function ({
  totalIncome,
  totalExpense,
  remain,
  totalExpensesByType,
}) {
  return (
    <div className={styles.summary}>
      <div>
        Всего доход:
        <span className={styles.income}>{totalIncome}</span>
      </div>
      <div>
        Всего расход:
        <span className={styles.expense}>{totalExpense}</span>
      </div>
      <div>
        Остаток: <span className={styles.remain}>{remain}</span>
      </div>
      <div>Общие затраты по типам:</div>
      <ul>
        {Object.entries(totalExpensesByType)
          .sort(([, totalA], [, totalB]) => totalB - totalA)
          .map(([type, total]) => (
            <li key={type}>
              {type}: {total}
            </li>
          ))}
      </ul>
    </div>
  );
};
export default Summary;
