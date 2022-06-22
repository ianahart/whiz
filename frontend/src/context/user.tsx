import { useState, createContext } from 'react';
import { initialUserState, initialTokenState } from '../helpers/initialState';
import { IUserContext, IUser, ITokens } from '../interfaces';

export const UserContext = createContext<IUserContext | null>(null);

interface IChildren {
  children?: React.ReactNode;
}

const UserContextProvider = ({ children }: IChildren) => {
  const [user, setUser] = useState<IUser>(initialUserState);
  const [tokens, setTokens] = useState<ITokens>(initialTokenState);

  const logout = () => {
    localStorage.removeItem('tokens');
    setUser(initialUserState);
    setTokens(initialTokenState);
  };

  const syncTokens = (tokens: ITokens) => {
    setTokens(tokens);
    storeTokens(tokens);
  };

  const storeTokens = (tokens: ITokens) => {
    localStorage.setItem('tokens', JSON.stringify(tokens));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        tokens,
        syncTokens,
        setTokens,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
