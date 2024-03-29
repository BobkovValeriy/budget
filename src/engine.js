import axios from "axios";
export const downloadBudget = function (username, password, setBudget, setReceivedData) {
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
                setReceivedData(true);
            } else {
                console.error(response.data.message);
            }
        })
        .catch((error) => {
            console.error("Ошибка при получении данных:", error);
        });
}