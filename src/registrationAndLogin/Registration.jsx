import styles from "./Registration.module.scss";
import { registration } from "../engine";
import { useFormik } from "formik";
import * as Yup from "yup";
import LangSwitch from "../langagueSwitch/langSwitch";

const Registration = ({
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
      passCheck: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(4, text.bevare_name_length)
        .matches(/^[a-zA-Z0-9]+$/, text.bevare_name_matches)
        .required(text.required),
      password: Yup.string()
        .min(4, text.bevare_pass_length)
        .matches(/^[a-zA-Z0-9]+$/, text.bevare_pass_matches)
        .required(text.required),
      passCheck: Yup.string()
        .oneOf([Yup.ref("password"), null], text.bevare_pass_check)
        .required(text.required),
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
        {text.reg_to_log}
      </button>
      <form className={styles.register__form} onSubmit={formik.handleSubmit}>
        <LangSwitch />
        <label htmlFor="username">{text.reg_username}</label>
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

        <label htmlFor="password">{text.reg_pass}</label>
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

        <label htmlFor="passCheck">{text.check_pass}</label>
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
          {text.reg_button}
        </button>
      </form>

      {formik.errors && formik.errors.general && (
        <div className={styles.error__message}>{formik.errors.general}</div>
      )}
    </div>
  );
};

export default Registration;
