import LoginedApp from './loginedAppBudget/LoginedApp';
import Login from './registrationAndLogin/Login';
import { useSelector, useDispatch } from 'react-redux';
import { setLogined, setShowLoginMenu, setShowRegisterMenu, setUsername, setPassword } from './store.js';
import Registration from './registrationAndLogin/Registration.jsx';
import { textToRu, textToEn } from "./langReducer.js"
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();
  const currentLocale = navigator.language.split('-')[0];
  const { logined, showLoginMenu, showRegisterMenu, username, password } = useSelector(state => state.app);
  const text = useSelector((state) => state.langReducer);

  useEffect(() => {
    if (currentLocale === "ru") {
      dispatch(textToRu())
    } else {
      dispatch(textToEn())
    }
  }, [currentLocale, dispatch]);

  return (
    <div>
      {logined ? <LoginedApp username={username} password={password} text={text} /> : null}
      {showLoginMenu ? (
        <Login
          text={text}
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
          text={text}
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
