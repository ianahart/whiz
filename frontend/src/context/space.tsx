import { useState, createContext } from 'react';
import { initialSpaceState } from '../helpers/initialState';
import { ISpaceContext, ISpaceFull, IList } from '../interfaces';

export const SpaceContext = createContext<ISpaceContext | null>(null);

interface IChildren {
  children?: React.ReactNode;
}

const SpaceContextProvider = ({ children }: IChildren) => {
  const [space, setSpace] = useState<ISpaceFull>(initialSpaceState);
  const [lists, setLists] = useState<IList[]>([]);

  const addList = (list: IList) => {
    setLists((prevState) => [...prevState, list]);
  };

  const updateTitle = (title: string) => {
    setSpace((prevState) => ({ ...prevState, title }));
  };

  const updateListTitle = (title: string, id: number) => {
    const updated = lists.map((list) => {
      return list.id === id ? { ...list, title } : list;
    });
    setLists(updated);
  };

  return (
    <SpaceContext.Provider
      value={{ updateListTitle, updateTitle, setLists, lists, addList, setSpace, space }}
    >
      {children}
    </SpaceContext.Provider>
  );
};

export default SpaceContextProvider;
