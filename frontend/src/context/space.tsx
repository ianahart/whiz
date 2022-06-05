import { useCallback, useState, createContext } from 'react';
import { initialSpaceState } from '../helpers/initialState';
import { ISpaceContext, ISpaceFull, IList, ICard } from '../interfaces';
import { http } from '../helpers/utils';
import { IRetreiveSpaceResponse } from '../interfaces/response';
import { AxiosError } from 'axios';

export const SpaceContext = createContext<ISpaceContext | null>(null);

interface IChildren {
  children?: React.ReactNode;
}

const SpaceContextProvider = ({ children }: IChildren) => {
  const [space, setSpace] = useState<ISpaceFull>(initialSpaceState);
  const [lists, setLists] = useState<IList[]>([]);

  const fetchSpace = useCallback(async (id: number, title: string) => {
    try {
      if (id === undefined) {
        return;
      }
      const response = await http.get<IRetreiveSpaceResponse>(
        `/spaces/${id}/?title=${title}`
      );
      setSpace(response.data.space);
      setLists(response.data.lists);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        const { errors } = error.response.data;
      }
    }
  }, []);

  const addList = (list: IList) => {
    setLists((prevState) => [...prevState, list]);
  };

  const removeList = (id: number) => {
    setLists(lists.filter((list) => list.id !== id));
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

  const addCardToList = (card: ICard) => {
    const updated = lists.map((list) => {
      if (list.id === card.list) {
        list.cards = [...list.cards, card];
        return list;
      }
      return list;
    });
    setLists(updated);
  };

  const removeCard = (card_id: number, list_id: number) => {
    const updated = lists.map((list) => {
      if (list.id === list_id) {
        const filtered = list.cards.filter((card) => card.id !== card_id);
        list.cards = [...filtered];
      }
      return list;
    });
    setLists(updated);
  };

  return (
    <SpaceContext.Provider
      value={{
        removeCard,
        updateListTitle,
        addCardToList,
        fetchSpace,
        updateTitle,
        setLists,
        lists,
        addList,
        removeList,
        setSpace,
        space,
      }}
    >
      {children}
    </SpaceContext.Provider>
  );
};

export default SpaceContextProvider;
