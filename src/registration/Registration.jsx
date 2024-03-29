import { useEffect, useState } from "react";
import styles from "./Registration.module.scss";
// import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

function Registration({
  setLogined,
  setUsername,
  setPassword,
  username,
  password,
  setShowLoginMenu,
  setShowRegisterMenu,
}) {
  const [passCheck, setPassCheck] = useState("");
  const [canRegister, setCanRegister] = useState(false);
  const [message, setMessage] = useState([]);
  const [captchaValue, setCaptchaValue] = useState(null);

  const onChangeCapthca = (value) => {
    setCaptchaValue(value);
  };

  async function handleRegistration(e) {
    e.preventDefault();
    console.log("Try to register");
    if (canRegister) {
      try {
        setMessage([]);
        const response = await axios.post(
          "https://eu-central-1.aws.data.mongodb-api.com/app/data-yjqvx/endpoint/add_budget_user",
          {
            userName: username,
            userPass: password,
            // passCheck: passCheck,
            // captchaValue: captchaValue,
          }
        );
        console.log(response);
        if (response.data.success) {
          // Регистрация прошла успешно
          setLogined(true);
          setShowLoginMenu(false);
          setShowRegisterMenu(false);
        } else {
          // Ошибка при регистрации
          console.error("Ошибка при регистрации:", response.data.error);
          const errorMessageString = response.data.error;
          const errorMessagesArray = errorMessageString.split(".");
          errorMessagesArray.forEach((err) => {
            if (err.trim() !== "") {
              err.trim();
              addErrorMessage(err + "."); // Добавляем сообщение в массив message
            }
          });
        }
      } catch (error) {
        // Ошибка при выполнении запроса
        console.error("Ошибка при выполнении запроса:", error.message);
      }
    }
  }
  function addErrorMessage(mess) {
    setMessage((prev) => [...prev, mess]);
  }

  function userNameChange(e) {
    e.preventDefault();
    setUsername(e.target.value);
  }

  function userPassChange(e) {
    e.preventDefault();
    setPassword(e.target.value);
  }

  function passCheckChange(e) {
    e.preventDefault();
    setPassCheck(e.target.value);
  }

  function showLogin(e) {
    e.preventDefault();
    setShowLoginMenu(true);
    setShowRegisterMenu(false);
  }

  useEffect(() => {
    setCanRegister(false);
    setMessage([]);
    const specialChars = /^[a-zA-Z0-9]+$/;
    if (!specialChars.test(username)) {
      addErrorMessage("Имя пользователя может содержать только буквы и цифры.");
    }
    if (username.length < 4) {
      addErrorMessage("Имя пользователя должно содержать не менее 4 символов.");
    }
    if (password.length < 4) {
      addErrorMessage("Пароль не должен быть меньше 4х символов.");
    }
    if (password !== passCheck) {
      addErrorMessage("Пароли не совпадают.");
    }
    if (!specialChars.test(password)) {
      addErrorMessage("Пароль может содержать только буквы и цифры.");
    }
    // if (!captchaValue) {
    //   addErrorMessage("Докажите что вы не робот.");
    // }
    if (message.length === 0) {
      setCanRegister(true);
    }
  }, [passCheck, password, username, captchaValue]);

  return (
    <div className={styles.register}>
      <button
        type="button"
        onClick={showLogin}
        className={styles.register__nav__button}
      >
        Вход
      </button>
      <form className={styles.register__form} onSubmit={handleRegistration}>
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

        <label htmlFor="passwordCheck">Повторите пароль:</label>
        <input
          type="password"
          id="passwordCheck"
          name="passwordCheck"
          onChange={passCheckChange}
        />

        {/* <div className="recaptcha-container">
          <ReCAPTCHA
            sitekey="6Lf_l58pAAAAAK9rxsWT8fLox4tPWf2ioDn5D9lV"
            onChange={onChangeCapthca}
          />
        </div> */}

        <button type="submit" className={styles.submit__button}>
          Регистрация
        </button>
      </form>

      <div className={styles.error__message}>
        {message.map((mess, index) => {
          return <div key={index}>{mess}</div>;
        })}
      </div>
    </div>
  );
}

export default Registration;
