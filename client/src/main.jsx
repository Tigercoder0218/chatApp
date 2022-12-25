import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ContextProvider from './Context/Context';
import axios from 'axios';

// axios.defaults.baseURL = 'http://192.168.0.102:5000/';
axios.defaults.baseURL = 'https://xrecon.onrender.com/';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>,
)
