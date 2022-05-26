import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import UserContextProvider from './context/user';
import NavigationContextProvider from './context/navigation';

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <NavigationContextProvider>
        <App />
      </NavigationContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
