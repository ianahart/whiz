import { useCallback, useContext, useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import './styles/index.scss';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import { http, retrieveTokens } from './helpers/utils';
import { IStoreUserResponse } from './interfaces/response';
import { UserContext } from './context/user';
import { IUserContext } from './interfaces/';
import Dashboard from './pages/Dashboard';
import RequireAuth from './components/Mixed/RequireAuth';
import RequireGuest from './components/Mixed/RequireGuest';
import WithAxios from './helpers/WithAxios';
const App = () => {
  const { setUser } = useContext(UserContext) as IUserContext;
  const [isLoaded, setIsLoaded] = useState(false);
  const storeUser = useCallback(async () => {
    try {
      const tokens = retrieveTokens();
      const response = await http.get<IStoreUserResponse>('/account/', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      setUser(response.data.user);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        return;
      }
    }
  }, [setUser]);

  useEffect(() => {
    storeUser();
  }, [storeUser]);
  return (
    <div className="App">
      <Router>
        <WithAxios>
          <div className="site">
            <div className="site-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/sign-in"
                  element={
                    <RequireGuest>
                      <Login />
                    </RequireGuest>
                  }
                />
                <Route
                  path="/sign-up"
                  element={
                    <RequireGuest>
                      <CreateAccount />
                    </RequireGuest>
                  }
                />
                <Route
                  path="/:name"
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  }
                />
              </Routes>
            </div>
          </div>
        </WithAxios>
      </Router>
    </div>
  );
};

export default App;
