import LoginedApp from './loginedAppBudget/LoginedApp';
import Login from './registrationAndLogin/Login';
import { useSelector, useDispatch } from 'react-redux';
import { setLogined, setShowLoginMenu, setShowRegisterMenu, setUsername, setPassword, setLocale } from './store.js';
import Registration from './registrationAndLogin/Registration.jsx';
import { useEffect } from 'react';
import text from './locales/text.js';

function App() {
  const dispatch = useDispatch();
  const currentLocale = navigator.language.split('-')[0];
  const { logined, showLoginMenu, showRegisterMenu, locale, username, password } = useSelector(state => state.app);
  useEffect(() => {
    if (currentLocale === "ru" || currentLocale === "en") {
      dispatch(setLocale(currentLocale))
    }
  }, [])
  useEffect(() => {
    async function loadLocaleData(locale) {
      try {
        const localeData = await import(`./locales/${locale}.js`);
        Object.assign(text, localeData.default); // Обновляем объект text
      } catch (error) {
        console.error(`Ошибка загрузки локализации для ${locale}:`, error);
      }
    }

    loadLocaleData(locale);
  }, [locale]);

  return (
    <div>
      {logined ? <LoginedApp username={username} password={password} /> : null}
      {showLoginMenu ? (
        <Login
          logined={logined}
          setLogined={(value) => dispatch(setLogined(value))}
          setUsername={(value) => dispatch(setUsername(value))}
          setPassword={(value) => dispatch(setPassword(value))}
          setShowLoginMenu={(value) => dispatch(setShowLoginMenu(value))}
          setShowRegisterMenu={(value) => dispatch(setShowRegisterMenu(value))}
        />
      ) : null}
      {showRegisterMenu ? (
        <Registration
          logined={logined}
          setLogined={(value) => dispatch(setLogined(value))}
          setUsername={(value) => dispatch(setUsername(value))}
          setPassword={(value) => dispatch(setPassword(value))}
          setShowLoginMenu={(value) => dispatch(setShowLoginMenu(value))}
          setShowRegisterMenu={(value) => dispatch(setShowRegisterMenu(value))}
        />
      ) : null}
    </div>
  );
}

export default App;