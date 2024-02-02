import { useState } from "react";
import "./Login.css";
import axios from "axios";

async function checkLogin(username, password, setLogined) {
  try {
    const apiEndpoint =
      "https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/checklogin";

    // Выполняем запрос к API
    const response = await axios.post(apiEndpoint, {
      username: username,
      password: password,
    });

    // Проверяем, успешен ли запрос
    if (response.status === 204) {
      // Статус 204 - успешный запрос без возвращаемых данных
      return setLogined(true); // Возвращаем результат успешной проверки
    } else {
      console.error("Некорректный ответ от сервера");
      return { error: "Некорректный ответ от сервера" };
    }
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error.message);
    return { error: error.message };
  }
}

function Login({ logined, setLogined }) {
  const [userName, setUserName] = useState("");
  const [userPass, setUserPass] = useState("");

  async function verification(e) {
    e.preventDefault();
    await checkLogin(userName, userPass, setLogined);
  }

  function userNameChange(e) {
    setUserName(e.target.value);
  }

  function userPassChange(e) {
    setUserPass(e.target.value);
  }

  return (
    <div className="login">
      <form className="login-form" onSubmit={verification}>
        <label htmlFor="username">Имя пользователя:</label>
        <input
          type="text"
          id="username"
          name="username"
          onChange={userNameChange}
        />

        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={userPassChange}
        />

        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default Login;
