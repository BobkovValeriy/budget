import { useState, useEffect, useRef } from "react";
import styles from "./TransactionFormStyles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import { Russian } from "flatpickr/dist/l10n/ru.js"; 
import { French } from "flatpickr/dist/l10n/fr.js"; 
import { German } from "flatpickr/dist/l10n/de.js"; 
import { setMessage } from "../../store";

function TransactionForm({
  handleSubmit,
  handleChange,
  formData = {},
  username,
  password,
  setBudget,
  budget,
  setFormData,
  formattedDate,
  buttonText,
  exitButton = null,
  text,
}) {
  const dispatch = useDispatch()
  const { date = "", type = "Доход", transactionType = [] } = formData;
  const lang = useSelector((state) => state.langReducer.langague);
  const datePickerRef = useRef(null);
  const Ukrainian = {
    weekdays: {
      shorthand: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      longhand: [
        "Неділя",
        "Понеділок",
        "Вівторок",
        "Середа",
        "Четвер",
        "П’ятниця",
        "Субота",
      ],
    },
    months: {
      shorthand: [
        "Січ",
        "Лют",
        "Бер",
        "Квіт",
        "Трав",
        "Черв",
        "Лип",
        "Серп",
        "Вер",
        "Жовт",
        "Лист",
        "Груд",
      ],
      longhand: [
        "Січень",
        "Лютий",
        "Березень",
        "Квітень",
        "Травень",
        "Червень",
        "Липень",
        "Серпень",
        "Вересень",
        "Жовтень",
        "Листопад",
        "Грудень",
      ],
    },
    firstDayOfWeek: 1, // Понедельник — первый день недели
  };
  const localeMapping = {
    RU: Russian,
    FR: French,
    DE: German,
    UA: Ukrainian,
    EN: null,
  };
  useEffect(() => {
    const locale = localeMapping[lang] || null;

    if (datePickerRef.current?._flatpickr) {
        datePickerRef.current._flatpickr.destroy();
    }

    flatpickr(datePickerRef.current, {
        locale: locale,
        dateFormat: "Y-m-d",
        defaultDate: date, // Актуальное значение
        onChange: ([selectedDate]) => {
            const updatedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
            handleChange({
                target: { name: "date", value: updatedDate },
              });
          },
      });
    }, [lang, date]);

  function showAddErrorFunction(){
    dispatch(setMessage(text.tf_error))
    setTimeout(() => {
      dispatch(setMessage(''))
    }, 3000);
  }
  function showAddCompliteFunction(){
    dispatch(setMessage(text.tf_complite))
    setTimeout(() => {
      dispatch(setMessage(''))
    }, 500);
  }
  useEffect(() => {
    if (Array.isArray(transactionType) && transactionType.length > 0) {
      const incomeObjects = transactionType.map((item) => {
        const [target, amount] = item
          .split(":")
          .map((subItem) => subItem.trim());
        return { target, amount: parseFloat(amount) };
      });
      setIncomes([...incomeObjects, { target: "", amount: parseFloat(0) }]);
    }
  }, []);
  const [incomes, setIncomes] = useState([
    { target: "", amount: parseFloat(0) },
  ]);
  const handleIncomesChange = (e, index) => {
    const { name, value } = e.target;
    const updatedIncomes = [...incomes];
    updatedIncomes[index] = { ...updatedIncomes[index], [name]: value };
    setIncomes(updatedIncomes);
    if (
      index === updatedIncomes.length - 1 &&
      updatedIncomes[index].target &&
      updatedIncomes[index].amount
    ) {
      setIncomes([...updatedIncomes, { target: "", amount: "" }]);
    }
  };

  return (
    <div className={styles.form__container}>
      {exitButton}
      <form
        onSubmit={(e) =>
          handleSubmit(
            e,
            incomes,
            showAddErrorFunction,
            showAddCompliteFunction,
            setIncomes,
            formData,
            username,
            password,
            setBudget,
            setFormData,
            formattedDate,
            budget,
          )
        }
      >
        <div>
          <label htmlFor="date">{text.tf_data}</label>
          <input
            type="text"
            id="date"
            name="date"
            ref={datePickerRef}
            // onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>{text.tf_type}</label>
          <input
            type="radio"
            name="type"
            value="Расход"
            id="expense"
            checked={type === "Расход"}
            onChange={handleChange}
          />
          <label htmlFor="expense">{text.tf_expence}</label>
          <input
            type="radio"
            name="type"
            value="Доход"
            id="income"
            checked={type === "Доход"}
            onChange={handleChange}
          />
          <label htmlFor="income">{text.tf_income}</label>
        </div>
        <div className={styles.incomes}>
          {incomes.map((detail, index) => (
            <div key={index} className={styles.income}>
              <input
                type="text"
                id={`target-${index}`}
                name="target"
                value={detail.target}
                placeholder={text.tf_placeholder_target}
                onChange={(e) => handleIncomesChange(e, index)}
                className={styles.income__target}
              />
              <input
                type="number"
                id={`amount-${index}`}
                name="amount"
                value={detail.amount}
                placeholder={text.tf_placeholder_amount}
                onChange={(e) => handleIncomesChange(e, index)}
                className={styles.income__amount}
              />
            </div>
          ))}
        </div>
        <button type="submit">{buttonText}</button>
      </form>
    </div>
  );
}

export default TransactionForm;
