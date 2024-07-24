import styles from "./Registration.module.scss";
import { registration } from "../engine";
import { useFormik } from "formik";
import * as Yup from "yup";

const Registration = ({
  setLogined,
  setShowLoginMenu,
  setShowRegisterMenu,
  setUsername,
  setPassword,
}) => {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      passCheck: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(4, "Имя пользователя должно содержать не менее 4 символов.")
        .matches(
          /^[a-zA-Z0-9]+$/,
          "Имя пользователя может содержать только буквы и цифры."
        )
        .required("Required"),
      password: Yup.string()
        .min(4, "Пароль не должен быть меньше 4х символов.")
        .matches(
          /^[a-zA-Z0-9]+$/,
          "Пароль может содержать только буквы и цифры."
        )
        .required("Required"),
      passCheck: Yup.string()
        .oneOf([Yup.ref("password"), null], "Пароли не совпадают.")
        .required("Required"),
    }),
    onSubmit: (values) => {
      registration(
        values,
        setLogined,
        setShowLoginMenu,
        setShowRegisterMenu,
        setUsername,
        setPassword,
        formik.setErrors
      );
    },
  });

  function showLogin(e) {
    e.preventDefault();
    setShowLoginMenu(true);
    setShowRegisterMenu(false);
  }

  return (
    <div className={styles.register}>
      <button
        type="button"
        onClick={showLogin}
        className={styles.register__nav__button}
      >
        Вход
      </button>
      <form className={styles.register__form} onSubmit={formik.handleSubmit}>
        <label htmlFor="username">Имя пользователя:</label>
        <input
          type="text"
          id="username"
          name="username"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
        />
        {formik.touched.username && formik.errors.username ? (
          <div className={styles.error__message}>{formik.errors.username}</div>
        ) : null}

        <label htmlFor="password">Пароль:</label>
        <input
          type="password"
          id="password"
          name="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password ? (
          <div className={styles.error__message}>{formik.errors.password}</div>
        ) : null}

        <label htmlFor="passCheck">Повторите пароль:</label>
        <input
          type="password"
          id="passCheck"
          name="passCheck"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.passCheck}
        />
        {formik.touched.passCheck && formik.errors.passCheck ? (
          <div className={styles.error__message}>{formik.errors.passCheck}</div>
        ) : null}

        <button type="submit" className={styles.submit__button}>
          Регистрация
        </button>
      </form>

      {formik.errors && formik.errors.general && (
        <div className={styles.error__message}>{formik.errors.general}</div>
      )}
    </div>
  );
};

export default Registration;
