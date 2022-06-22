import { useState, useRef, useContext } from 'react';
import { DraggableProvided } from 'react-beautiful-dnd';
import { AiOutlineClockCircle, AiOutlineClose } from 'react-icons/ai';
import { GoPencil } from 'react-icons/go';
import { SpaceContext } from '../../../../context/space';
import { ICard, ISpaceContext } from '../../../../interfaces';
export interface ICardProps {
  card: ICard;
  openModal: (id: number) => void;
  editCardTitle: (event: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  provided: DraggableProvided;
}

const Card = ({ openModal, card, editCardTitle, provided }: ICardProps) => {
  const { removeCard } = useContext(SpaceContext) as ISpaceContext;
  const [isEditIcon, setIsEditIcon] = useState(false);
  const [isTitleInput, setIsTitleInput] = useState(false);
  const nodeRef = useRef(null);

  const handleOnBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    editCardTitle(event, card.id);
    setIsTitleInput(false);
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="list-card-container"
    >
      <div style={{ position: 'relative' }} className="list-card-label-column">
        <p
          className="list-card-label"
          style={{
            background: card.color.length > 0 ? card.color : '',
          }}
        >
          {card.label.length ? card.label : ''}
        </p>
        <div
          onMouseOver={() => setIsEditIcon(true)}
          onMouseLeave={() => setIsEditIcon(false)}
          style={{ justifyContent: 'space-between' }}
          className="flex-center"
        >
          {isTitleInput ? (
            <input
              onBlur={handleOnBlur}
              className="edit-card-title"
              placeholder="New title.."
            />
          ) : (
            <p onClick={() => openModal(card.id)}>{card.text}</p>
          )}
          {isEditIcon && (
            <div onClick={() => setIsTitleInput(!isTitleInput)}>
              <GoPencil />
            </div>
          )}
        </div>
        <div id="card-date-range">
          <AiOutlineClockCircle />
          <p>{card.start_date === card.end_date ? '' : card.date_range}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
