import axios from "axios";
export const apiEndpoint =
    "https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/";
const sendRequest = async (url, method = 'post', data = {}, headers = {}) => {
  try {
    const response = await axios({
      method: method,
      url: `${apiEndpoint}${url}`,
      data: data,
      headers: { "Content-Type": "application/json", ...headers },
    });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при выполнении запроса к ${url}:`, error.message);
    throw error;
  }
};
export const downloadBudget = async (username, password, setBudget, nowDay) => {
    try {
      const response = await sendRequest('getbudget', 'post', { userName: username, password: password, nowDay: nowDay });
      if (response.status === "success") {
        const sortedBudget = [...response.resultArray].sort(compareDatesDesc);
        setBudget(sortedBudget);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
};
export const deleteRecord = async (e, id, username, password, setBudget, setIsDeleting, showDeleteErrorFunction, showDeleteCompliteFunction) => {
    e.preventDefault();
    try {
      await sendRequest('deletebudgetrecord', 'post', { id: id, username: username, password: password });
      await downloadBudget(username, password, setBudget);
      setIsDeleting(false);
      showDeleteCompliteFunction();
    } catch (error) {
      showDeleteErrorFunction();
    }
  };
export const addRecord = async (e, incomes, showAddErrorFunction, showAddCompliteFunction, setIncomes, formData, username, password, setBudget, setFormData, formattedDate) => {
  e.preventDefault();

  const arrayToSend = incomes
    .filter(income => income.target !== "" && !isNaN(income.amount))
    .map(income => `${income.target}:${income.amount}`);

  const total = incomes.reduce((sum, income) => sum + parseFloat(income.amount || 0), 0);

  const newTransaction = {
    id: new Date(), 
    date: formData.date,
    amount: total,
    type: formData.type,
    transactionType: arrayToSend,
  };

  try {
    const response = await sendRequest('addrecord', 'post', {
      userName: username,
      password: password,
      transaction: newTransaction,
    });

    if (response.status === "success") {
      setBudget(prevBudget => {
        const newBudget = [...prevBudget, newTransaction].sort(compareDatesDesc);
        return newBudget;
      });
      setFormData({ date: formattedDate, amount: "", type: "Расход", transactionType: [] });
      showAddCompliteFunction();
      setIncomes([{ target: "", amount: 0 }]);
    } else {
      console.error(response.message);
    }
  } catch (error) {
    showAddErrorFunction();
  }
};
export function compileIncome(budget) {
    return budget.reduce((total, transaction) => {
        return transaction.type === "Доход"
            ? total + Number(transaction.amount)
            : total;
    }, 0);
}

export function compileTotalExpense(budget) {
    return budget.reduce((total, transaction) => {
        return transaction.type === "Расход"
            ? total + Number(transaction.amount)
            : total;
    }, 0);
}
export function recompileBudget(budget, setTotalIncome, setTotalExpense, setTotalExpenseByType) {
    const newTotalExpensesByType = {};

    budget.forEach((transaction) => {
        if (transaction.type === "Расход") {
            transaction.transactionType.forEach((type) => {
                const [typeName, typePrice] = type
                    .split(":")
                    .map((item) => item.trim());
                newTotalExpensesByType[typeName] =
                    (newTotalExpensesByType[typeName] || 0) + Number(typePrice);
            });
        }
    });

    setTotalIncome(compileIncome(budget));
    setTotalExpense(compileTotalExpense(budget));
    setTotalExpenseByType(newTotalExpensesByType);
}
export const compareDatesAsc = (a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
};

export const compareDatesDesc = (a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
};

export const sortBudget = (ascending, budget, setBudget) => {
    const sortedBudget = [...budget];
    sortedBudget.sort(ascending ? compareDatesAsc : compareDatesDesc);
    setBudget(sortedBudget);
};
export async function registration(values,
    setLogined,
    setShowLoginMenu,
    setShowRegisterMenu,
    setUsername,
    setPassword,
    setErrors) {

    try {
        const response = await sendRequest('add_budget_user', 'post', { userName: values.username, userPass: values.password });

        if (response.data.success) {
            setUsername(values.username);
            setPassword(values.password);
            setLogined(true);
            setShowLoginMenu(false);
            setShowRegisterMenu(false);
        } else {
            // Ошибка при регистрации
            console.error("Ошибка при регистрации:", response.data.error);
            const errorMessageString = response.data.error;
            const errorMessagesArray = errorMessageString.split(".");

            // Создаём объект с ошибками для Formik
            const formErrors = {};

            errorMessagesArray.forEach((err) => {
                if (err.trim() !== "") {
                    const [field, message] = err.trim().split(':'); // Предполагаем, что сообщение ошибки имеет формат 'field: message'
                    if (field && message) {
                        formErrors[field] = (formErrors[field] || '') + message.trim() + ".";
                    }
                }
            });

            setErrors(formErrors);
        }
    } catch (error) {
        // Ошибка при выполнении запроса
        console.error("Ошибка при выполнении запроса:", error.message);
    }
}
export async function checkLogin(values,
    setLogined,
    setShowLoginMenu,
    setUsername,
    setPassword,
    setErrors
) {

    try {
        const response = await sendRequest('checklogin', 'get', null, { username: values.username, password: values.password });
        // Проверяем, успешен ли запрос и код в ответе равен "logined"
        if (response.data.login === "logined") {
            // Устанавливаем состояния в соответствии с успешным входом
            setUsername(values.username);
            setPassword(values.password);
            setLogined(true);
            setShowLoginMenu(false);
            // Возвращаем null, так как нет данных для возврата
            return null;
        } else if (response.data.login === "notlogined") {
            console.error("Неверные учетные данные");
            // Устанавливаем ошибку в Formik
            setErrors({ username: "Неверные учетные данные", password: "Неверные учетные данные" });
            return { error: "Неверные учетные данные" };
        } else {
            console.error("Некорректный ответ от сервера", response.data);
            // Устанавливаем ошибку в Formik
            setErrors({ username: "Некорректный ответ от сервера", password: "Некорректный ответ от сервера" });
            return { error: "Некорректный ответ от сервера" };
        }
    } catch (error) {
        console.error("Ошибка при выполнении запроса:", error.message);
        // Устанавливаем ошибку в Formik
        setErrors({ username: error.message, password: error.message });
        return { error: error.message };
    }
}
export  async function getCountryCode() {
    try {
        const response = await fetch('https://ipapi.co/country/');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const countryCode = await response.text();
        return countryCode;
    } catch (error) {
        return navigator.language.split('-')[0].toUpperCase();; // Значение по умолчанию
    }
  }