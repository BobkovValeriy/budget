import styles from "./Login.module.scss";
import axios from "axios";
import { useState } from "react";

function Login({
  setLogined,
  setUsername,
  setPassword,
  username,
  pass,
  setShowLoginMenu,
  setShowRegisterMenu,
}) {
  const [message, setMessage] = useState([]);
  function addErrorMessage(mess) {
    setMessage((prev) => [...prev, mess]);
  }
  async function checkLogin(username, password, setLogined, setShowLoginMenu) {
    try {
      const apiEndpoint = `https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/checklogin?username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`;

      const response = await axios.get(apiEndpoint);

      // Проверяем, успешен ли запрос и код в ответе равен "logined"
      if (response.data.login === "logined") {
        // Устанавливаем состояния в соответствии с успешным входом
        setLogined(true);
        setShowLoginMenu(false);
        // Возвращаем null, так как нет данных для возврата
        return null;
      } else if (response.data.login === "notlogined") {
        console.error("Неверные учетные данные");
        addErrorMessage("Неверные учетные данные");
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
  async function verification(e) {
    e.preventDefault();
    setMessage([]);
    await checkLogin(username, pass, setLogined, setShowLoginMenu);
  }

  function userNameChange(e) {
    setUsername(e.target.value);
  }

  function userPassChange(e) {
    setPassword(e.target.value);
  }
  function showRegistrationMenu(e) {
    e.preventDefault();
    setShowLoginMenu(false);
    setShowRegisterMenu(true);
  }

  return (
    <div className={styles.login}>
      <div className={styles.login_container}>
        <button
          type="button"
          onClick={showRegistrationMenu}
          className={styles.login__nav_button}
        >
          Регистрация
        </button>
        <form className={styles.login_form} onSubmit={verification}>
          <label htmlFor="username">Имя пользователя:</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={userNameChange}
            className={styles.input_field}
          />

          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={userPassChange}
            className={styles.input_field}
          />

          <button type="submit">Войти</button>
        </form>
        <div className={styles.error_message}>
          {message.map((mess, index) => {
            return <div key={index}>{mess}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

export default Login;
