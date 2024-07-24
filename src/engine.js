import axios from "axios";
export const apiEndpoint =
    "https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/";
export const downloadBudget = function (username, password, setBudget, nowDay) {
    setTimeout(() => {
        axios
            .post(
                `${apiEndpoint}getbudget`,
                { userName: username, password: password, nowDay: nowDay },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                if (response.data.status === "success") {
                    const sortedBudget = [...response.data.resultArray]
                    //changing logic


                    sortedBudget.sort(compareDatesDesc)
                    setBudget(sortedBudget);
                } else {
                    console.error(response.data.message);
                }
            })
            .catch((error) => {
                console.error("Ошибка при получении данных:", error);
            });
    }, 1000)
}
export const deleteRecord = async (e, id, username, password, setBudget, budget, setIsDeleting) => {
    e.preventDefault();
    try {
        // Отправка данных на удаление записи
        const deleteResponse = await axios.post(
            `${apiEndpoint}deletebudgetrecord`,
            { id: id, username: username, password: password },
            { headers: { "Content-Type": "application/json" } }
        );

        console.log("Запись успешно удалена!", deleteResponse.data);

        // Получение бюджета после успешного удаления
        downloadBudget(username, password, setBudget);
    } catch (error) {
        // Обработка ошибок
        console.error("Ошибка при удалении записи:", error);
        // Дополнительные действия, например, уведомление пользователя об ошибке
    }
    setIsDeleting(false);
};
export const addRecord = (e, incomes,
    setIncomes,
    formData,
    username,
    password,
    setBudget,
    budget,
    setFormData,
    formattedDate) => {
    e.preventDefault();
    const arrayToSend = [];
    let total = parseFloat(0);
    incomes.map((income) => {
        if (
            income.target !== "" &&
            !isNaN(income.amount) &&
            typeof income.amount !== "undefined"
        ) {
            total += parseFloat(income.amount);
            arrayToSend.push(income.target + ":" + income.amount);
        }
    });

    const newTransaction = {
        id: new Date(), // Генерируем номер для новой транзакции
        date: formData.date,
        amount: total,
        type: formData.type,
        transactionType: arrayToSend,
    };

    // Добавляем новую транзакцию на сервер
    axios
        .post(
            `${apiEndpoint}addrecord`,
            {
                userName: username,
                password: password,
                transaction: newTransaction,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then((response) => {
            if (response.data.status === "success") {
                setBudget(prevBudget => {
                    const newBudget = [...prevBudget, newTransaction];
                    sortBudget(false, newBudget, setBudget);
                    return newBudget;
                });
            } else {
                console.error(response.data.message);
            }
        })
        .catch((error) => {
            console.error("Ошибка при добавлении транзакции:", error);
        });

    // Очищаем поля формы после добавления транзакции
    setFormData({
        date: formattedDate,
        amount: "",
        type: "Расход",
        transactionType: [],
    });
    setIncomes([{ target: "", amount: parseFloat(0) }]);
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
        const response = await axios.post(
            `${apiEndpoint}add_budget_user`,
            {
                userName: values.username,
                userPass: values.password,
            }
        );

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
        const response = await axios.get(`${apiEndpoint}checklogin`, {
            params: {
                username: values.username,
                password: values.password
            }
        });

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