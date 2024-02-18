import { useState } from "react";
import "./Login.css";
import axios from "axios";

  async function checkLogin(username, password, setLogined) {
    try {
      console.log(username, password);
      const apiEndpoint = `https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/checklogin?username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`;

      const response = await axios.get(apiEndpoint);

      console.log(response); // Выводим ответ сервера в консоль

      // Проверяем, успешен ли запрос и код в ответе равен "logined"
      if (response.data.login === "logined") {
        return setLogined(true);
      } else if (response.data.login === "notlogined") {
        console.error("Неверные учетные данные");
        return { error: "Неверные учетные данные" };
      } else {
        console.error("Некорректный ответ от сервера", response.data);
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
