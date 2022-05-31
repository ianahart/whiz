import { AxiosError } from 'axios';
import { useState, useRef, useContext } from 'react';
import Draggable from 'react-draggable';
import { BsThreeDots } from 'react-icons/bs';
import { SpaceContext } from '../../../../context/space';
import { http } from '../../../../helpers/utils';
import { IList, ISpaceContext } from '../../../../interfaces';
import { ICreateCardResponse } from '../../../../interfaces/response';
import AddCard from './AddCard';
import Card from './Card';

export interface IListProps {
  list: IList;
}

const List = ({ list }: IListProps) => {
  const nodeRef = useRef(null);
  const { updateListTitle, addCardToList } = useContext(SpaceContext) as ISpaceContext;
  const [isListTitleEditing, setIsListTitleEditing] = useState(false);
  const [card, setCard] = useState('');
  const [label, setLabel] = useState({ color: '', value: '' });
  const [errors, setErrors] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
      addCardToList(response.data.card);
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

  const clearLabel = () => {
    setLabel({ color: '', value: '' });
  };

  const handleSetLabel = (color: string, value: string) => {
    setLabel((prevState) => ({ ...prevState, color, value }));
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

  return (
    <Draggable nodeRef={nodeRef} grid={[50, 50]} axis="x">
      <div ref={nodeRef} className="list-container">
        <div className="list-title">
          {isListTitleEditing ? (
            <div className="list-title-input-container">
              <input onBlur={editListTitle} />
            </div>
          ) : (
            <div className="list-title-trigger">
              <p onClick={() => setIsListTitleEditing(true)}>{list.title}</p>
              <BsThreeDots />
            </div>
          )}
        </div>

        {list.cards?.map((card) => {
          return <Card key={card.id} card={card} />;
        })}

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
    </Draggable>
  );
};

export default List;
