import './App.css';

function TransactionForm({
  handleSubmit,
  handleChange,
  formData = {},
  buttonText,
}) {
  const { date = "", type = "Доход", transactionType = "" } = formData;

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Дата:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Тип:</label>
          <label>
            <input
              type="radio"
              name="type"
              value="Доход"
              checked={type === "Доход"}
              onChange={handleChange}
            />
            Доход
          </label>
          <label>
            <input
              type="radio"
              name="type"
              value="Расход"
              checked={type === "Расход"}
              onChange={handleChange}
            />
            Расход
          </label>
        </div>
        <div>
          <label htmlFor="transactionType">
            Тип транзакции (разделяйте запятыми):
          </label>
          <textarea
            id="transactionType"
            name="transactionType"
            value={transactionType}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{buttonText}</button>
      </form>
    </div>
  );
}

export default TransactionForm;
