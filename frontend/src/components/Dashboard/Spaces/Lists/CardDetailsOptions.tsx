import { AiOutlineClockCircle } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';

interface CardDetailsOptionsProps {
  removeCard: () => void;
}

const CardDetailsOptions = ({ removeCard }: CardDetailsOptionsProps) => {
  return (
    <div className="card-details-options">
      <p>Add to card</p>
      <div className="card-details-options-add">
        <div className="card-details-option">
          <AiOutlineClockCircle />
          <p>Dates</p>
        </div>
      </div>
      <p className="card-details-options-action-title">Actions</p>
      <div className="card-details-options-action">
        <div onClick={removeCard} role="button" className="card-details-option">
          <BsTrash />
          <p>Delete</p>
        </div>
      </div>
    </div>
  );
};

export default CardDetailsOptions;
