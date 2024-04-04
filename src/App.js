import './App.css';
import LoginedApp from './loginedAppBudget/LoginedApp';
import Login from './registrationAndLogin/Login';
import { useState } from 'react';
import Registration from './registrationAndLogin/Registration.jsx';


function App() {
  const [logined, setLogined] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(true);
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div>
      {logined ? <LoginedApp username={username} password={password} /> : null}
      {showLoginMenu ? <Login
        logined={logined}
        setLogined={setLogined}
        setUsername={setUsername}
        setPassword={setPassword}
        username={username} pass={password}
        setShowLoginMenu={setShowLoginMenu}
        setShowRegisterMenu={setShowRegisterMenu} /> : null
      }
      {showRegisterMenu ? <Registration
        logined={logined}
        setLogined={setLogined}
        setUsername={setUsername}
        setPassword={setPassword}
        username={username} password={password}
        setShowLoginMenu={setShowLoginMenu}
        setShowRegisterMenu={setShowRegisterMenu}
      /> : null}
    </div>
  )
}

export default App;