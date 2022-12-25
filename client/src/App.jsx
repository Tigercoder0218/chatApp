import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Browser, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useContextData } from './hooks/useContextData';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import PWA from './Utils/PWA';

import Content from './Components/Content';
import Dashboard from './Components/Dashboard/Dashboard';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import ChatBox from './Components/ChatBox/ChatBox';
import ChatProfile from './Components/ChatBox/ChatProfile';
import AddContact from './Components/AddContact/AddContact';
import Settings from './Components/Settings/Settings';
import NotFound from './Pages/NotFound/NotFound';

function App() {
  const { token, setToken, setUser } = useContextData();
  axios.defaults.headers.common['Authorization'] = token;
  const { connectID } = useParams();

  useEffect(() => {
    //Redirect if userToken exists
    let getUser = localStorage.getItem('xrecon-user-token');
    getUser = JSON.parse(getUser);

    if (getUser) {
      setUser(getUser.user);
      setToken(getUser.token);
    }

    if (connectID) {
      console.log(connectID);
    }

    PWA();
  }, [setToken, setUser, connectID]);


  return (
    <div className="App">
      <Browser>
        <Routes>
          {token ? <Route element={<Content />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat/:username" element={<ChatBox />} />
            <Route path="/chat/:username/profile" element={<ChatProfile />} />
            <Route path="/connect/" element={<AddContact />} />
            <Route path="/connect/:connectID" element={<AddContact />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
            :
            <Route path="/" element={<Navigate to={"/login"} />} />}


          <Route path="/login" element={!token ? <Login /> : <Navigate to={"/"} />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to={"/"} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Browser>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar="false"
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
        theme="dark"
      />
    </div>
  );
}

export default App;