import styles from "./Login.module.scss";
import { checkLogin } from "../engine";
import { useFormik } from "formik";
import * as Yup from "yup";
import LangSwitch from "../langagueSwitch/langSwitch";

const Login = ({
  text,
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
    },
    validationSchema: Yup.object({
      username: Yup.string().required(text.log_required),
      password: Yup.string().required(text.log_required),
    }),
    onSubmit: async (values) => {
      await checkLogin(
        values,
        setLogined,
        setShowLoginMenu,
        setUsername,
        setPassword,
        formik.setErrors
      );
    },
  });

  function showRegistrationMenu(e) {
    e.preventDefault();
    setShowLoginMenu(false);
    setShowRegisterMenu(true);
  }

  return (
    <div className={styles.login}>
      <div className={styles.login_container}>
        <div className={styles.greeting}>{text.greeting}</div>
        <button
          type="button"
          onClick={showRegistrationMenu}
          className={styles.login__nav_button}
        >
          {text.registration}
        </button>
        <form className={styles.login_form} onSubmit={formik.handleSubmit}>
          <LangSwitch />
          <label htmlFor="username">{text.username}</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            className={styles.input_field}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className={styles.error_message}>{formik.errors.username}</div>
          ) : null}

          <label htmlFor="password">{text.pass}</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className={styles.input_field}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className={styles.error_message}>{formik.errors.password}</div>
          ) : null}

          <button type="submit">{text.in}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
