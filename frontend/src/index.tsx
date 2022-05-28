import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import UserContextProvider from './context/user';
import NavigationContextProvider from './context/navigation';
import SpaceContextProvider from './context/space';

ReactDOM.render(
  <React.StrictMode>
    <UserContextProvider>
      <NavigationContextProvider>
        <SpaceContextProvider>
          <App />
        </SpaceContextProvider>
      </NavigationContextProvider>
    </UserContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
