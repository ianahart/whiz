import { useState, useRef, useContext } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { SpaceContext } from '../../../../context/space';
import { ICard, ISpaceContext } from '../../../../interfaces';
export interface ICardProps {
  card: ICard;
  openModal: (id: number) => void;
}

const Card = ({ openModal, card }: ICardProps) => {
  const { removeCard } = useContext(SpaceContext) as ISpaceContext;
  const nodeRef = useRef(null);
  return (
    <div ref={nodeRef} className="list-card-container">
      <div style={{ position: 'relative' }} className="list-card-label-column">
        <p
          className="list-card-label"
          style={{
            background: card.color.length > 0 ? card.color : '',
          }}
        >
          {card.label.length ? card.label : ''}
        </p>
        <p onClick={() => openModal(card.id)}>{card.text}</p>

        {/* <button onClick={() => removeCard(card.id, card.list)}>remove</button>*/}
      </div>
    </div>
  );
};

export default Card;
