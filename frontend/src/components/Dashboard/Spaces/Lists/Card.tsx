import { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import { ICard } from '../../../../interfaces';
export interface ICardProps {
  card: ICard;
}

const Card = ({ card }: ICardProps) => {
  const nodeRef = useRef(null);
  const [isEditShowing, setIsEditShowing] = useState(false);
  return (
    <Draggable nodeRef={nodeRef} grid={[10, 10]}>
      <div
        ref={nodeRef}
        onMouseOver={() => setIsEditShowing(true)}
        onMouseLeave={() => setIsEditShowing(false)}
        className="list-card-container"
      >
        <div className="list-card-label-column">
          {card.label.length > 0 && (
            <p
              className="list-card-label"
              style={{ background: card.color.length > 0 ? card.color : '' }}
            >
              {card.label}
            </p>
          )}

          <p>{card.text}</p>
        </div>
      </div>
    </Draggable>
  );
};

export default Card;
