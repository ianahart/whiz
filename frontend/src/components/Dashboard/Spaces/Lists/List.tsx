import { AxiosError } from 'axios';
import { useState, useRef, useContext } from 'react';
import Draggable from 'react-draggable';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { SpaceContext } from '../../../../context/space';
import { http } from '../../../../helpers/utils';
import { IList, ISpaceContext } from '../../../../interfaces';

export interface IListProps {
  list: IList;
}

const List = ({ list }: IListProps) => {
  const nodeRef = useRef(null);
  const { updateListTitle } = useContext(SpaceContext) as ISpaceContext;
  const [isListTitleEditing, setIsListTitleEditing] = useState(false);

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
            <div
              onClick={() => setIsListTitleEditing(true)}
              className="list-title-trigger"
            >
              <p>{list.title}</p>
              <BsThreeDots />
            </div>
          )}
        </div>
        <div className="list-add-card-trigger">
          <AiOutlinePlus />
          <p>Add a card</p>
        </div>
      </div>
    </Draggable>
  );
};

export default List;
