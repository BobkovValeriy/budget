import './App.css';
import LoginedApp from './LoginedApp';
import Login from './Login';
import { useState } from 'react';


function App() {
  const [logined, setLogined] = useState(false);
  return (
    <div>
      {logined ? <LoginedApp /> :
        <Login
          logined={logined}
          setLogined={setLogined}
        /> 
      }
    </div>
  )
}

export default App;