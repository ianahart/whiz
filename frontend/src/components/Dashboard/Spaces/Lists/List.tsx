import { AxiosError } from 'axios';
import { useCallback, useState, useEffect, useRef, useContext } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { SpaceContext } from '../../../../context/space';
import { http } from '../../../../helpers/utils';
import { ICard, IList, ISpaceContext } from '../../../../interfaces';
import { ICreateCardResponse, ICardsResponse } from '../../../../interfaces/response';
import AddCard from './AddCard';
import Card from './Card';
import CardDetails from './CardDetails';
import ListActions from './ListActions';
import { DraggableProvided } from 'react-beautiful-dnd';

export interface IListProps {
  list: IList;
  provided: DraggableProvided;
}

const List = ({ list, provided }: IListProps) => {
  const nodeRef = useRef(null);
  const { updateListTitle, addCardToList } = useContext(SpaceContext) as ISpaceContext;
  const [isListTitleEditing, setIsListTitleEditing] = useState(false);
  const [card, setCard] = useState('');
  const [label, setLabel] = useState({ color: '', value: '' });
  const [errors, setErrors] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [cards, setCards] = useState<ICard[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<null | number>(null);
  const [listActionsOpen, setListActionsOpen] = useState(false);

  const handleListActionsOpen = (bool: boolean) => setListActionsOpen(bool);

  const openModal = (id: number) => {
    setActiveCard(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveCard(null);
  };

  const toggleIsFormOpen = (bool: boolean) => {
    setIsFormOpen(bool);
  };

  const handleSetCard = (card: string) => setCard(card);

  const handleAddCard = async () => {
    try {
      if (card.trim().length === 0) {
        return;
      }
      const response = await http.post<ICreateCardResponse>('/cards/', {
        text: card,
        color: label.color,
        label: label.value,
        space: list.space,
        list: list.id,
        user: list.user,
      });
      clearLabel();
      setCard('');
      setCards((prevState) => [...cards, response.data.card]);
      toggleIsFormOpen(false);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        const { errors } = error.response.data;
        const newErrors = [];
        for (error in errors) {
          newErrors.push(errors[error as keyof typeof errors][0]);
        }
        setErrors(newErrors);
      }
    }
  };

  const fetchCards = useCallback(async () => {
    try {
      const response = await http.get<ICardsResponse>(`/lists/${list.id}/cards/`);
      setCards(response.data.cards);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        const { errors } = error.response.data;
        const newErrors = [];
      }
    }
  }, [list.id]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const clearLabel = () => {
    setLabel({ color: '', value: '' });
  };

  const handleSetLabel = (color: string, value: string) => {
    setLabel((prevState) => ({ ...prevState, color, value }));
  };

  const handleRemoveCard = (id: number) => {
    const filtered = cards.filter((card) => card.id !== id);
    setCards(filtered);
  };

  const editListTitle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.value.trim().length === 0) {
        setIsListTitleEditing(false);
      }
      const response = await http.patch(`/lists/${list.id}/`, {
        title: event.target.value,
      });
      setIsListTitleEditing(false);
      updateListTitle(event.target.value, list.id);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        return;
      }
    }
  };

  const editCardTitle = async (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    try {
      event.stopPropagation();
      if (event.target.value.trim().length === 0) {
        return;
      }
      const response = await http.patch(`/cards/${id}/`, {
        details: { ...cards.find((card) => card.id === id), text: event.target.value },
      });

      setCards(
        cards.map((card) => {
          return card.id === id ? { ...card, text: event.target.value } : card;
        })
      );
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        return;
      }
    }
  };

  const handleOnDragEnd = async (result: any) => {
    try {
      if (!result.destination) return;

      const items = Array.from(cards);
      const [reorderedItem] = items.splice(result.source.index, 1);
      reorderedItem.index = result.destination.index;
      items.splice(result.destination.index, 0, reorderedItem);
      setCards(items);
      await http.post('/cards/reorder/', {
        cards: items.map(({ id }, index) => ({ id, index })),
      });
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="list-container"
    >
      {isModalOpen && (
        <div className="list-modal">
          <CardDetails
            handleRemoveCard={handleRemoveCard}
            activeCard={activeCard}
            closeModal={closeModal}
            fetchCards={fetchCards}
          />
        </div>
      )}

      <div className="list-title">
        {isListTitleEditing ? (
          <div className="list-title-input-container">
            <input onBlur={editListTitle} />
          </div>
        ) : (
          <div className="list-title-trigger">
            <p onClick={() => setIsListTitleEditing(true)}>{list.title}</p>
            <div className="list-actions-container">
              <div onClick={() => handleListActionsOpen(true)}>
                <BsThreeDots />
              </div>
              {listActionsOpen && (
                <ListActions
                  listId={list.id}
                  handleListActionsOpen={handleListActionsOpen}
                />
              )}
            </div>
          </div>
        )}
      </div>
      {cards.length > 0 && (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="lists" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {' '}
                {cards.map((card, index) => {
                  return (
                    <Draggable
                      key={card.id}
                      draggableId={card.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          provided={provided}
                          key={card.id}
                          editCardTitle={editCardTitle}
                          card={card}
                          openModal={openModal}
                        />
                      )}
                    </Draggable>
                  );
                })}{' '}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <AddCard
        card={card}
        errors={errors}
        label={label}
        isFormOpen={isFormOpen}
        toggleIsFormOpen={toggleIsFormOpen}
        handleSetLabel={handleSetLabel}
        handleAddCard={handleAddCard}
        handleSetCard={handleSetCard}
        clearLabel={clearLabel}
      />
    </div>
  );
};

export default List;
