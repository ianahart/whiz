import { useState, createContext } from 'react';
import { initialSpaceState } from '../helpers/initialState';
import { ISpaceContext, ISpaceFull } from '../interfaces';

export const SpaceContext = createContext<ISpaceContext | null>(null);

interface IChildren {
  children?: React.ReactNode;
}

const SpaceContextProvider = ({ children }: IChildren) => {
  const [space, setSpace] = useState<ISpaceFull>(initialSpaceState);

  return (
    <SpaceContext.Provider value={{ setSpace, space }}>{children}</SpaceContext.Provider>
  );
};

export default SpaceContextProvider;
