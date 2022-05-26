import { useState, createContext } from 'react';
import { INavigationContext } from '../interfaces';

export const NavigationContext = createContext<INavigationContext | null>(null);

interface IChildren {
  children?: React.ReactNode;
}

const NavigationContextProvider = ({ children }: IChildren) => {
  const [activeMenuItem, setActiveMenuItem] = useState('');

  return (
    <NavigationContext.Provider value={{ activeMenuItem, setActiveMenuItem }}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContextProvider;
