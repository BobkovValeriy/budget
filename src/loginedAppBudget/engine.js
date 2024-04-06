import axios from "axios";
export const apiEndpoint =
    "https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/";
export const downloadBudget = function (username, password, setBudget) {
    setTimeout(() => {
        axios
            .post(
                "https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/getbudget",
                { userName: username, password: password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                if (response.data.status === "success") {
                    setBudget(response.data.transactions);
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
        sortBudget(false, budget, setBudget);
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
                console.log(response.data.message);
                // Обновляем состояние бюджета после успешного добавления транзакции
                setBudget([...budget, newTransaction]);
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
    sortBudget(false, budget, setBudget);
};

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