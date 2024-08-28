import LoginedApp from './loginedAppBudget/LoginedApp';
import Login from './registrationAndLogin/Login';
import { useSelector, useDispatch } from 'react-redux';
import { setLogined, setShowLoginMenu, setShowRegisterMenu, setUsername, setPassword } from './store.js';
import Registration from './registrationAndLogin/Registration.jsx';
import { textTranslate} from "./langagueSwitch/langReducer.js"
import { useEffect, useState } from 'react';
import { getCountryCode } from './engine.js';

function App() {
  
  const dispatch = useDispatch();
  const [currentLocale, setCurrentLocale] = useState("");
  const { logined, showLoginMenu, showRegisterMenu, username, password } = useSelector(state => state.app);

  useEffect(() => {
    async function fetchCountryCode() {
      const countryCode = await getCountryCode();
      setCurrentLocale(countryCode);
    }
  
    fetchCountryCode();
  }, []);

  useEffect(() => {
      dispatch(textTranslate(currentLocale))
  }, [currentLocale]);

  return (
    <div>
      {logined ? <LoginedApp username={username} password={password}/> : null}
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
