import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import ColorLabels from './ColorLabels';

export interface IAddCardProps {
  label: { color: string; value: string };
  card: string;
  isFormOpen: boolean;
  errors: string[];
  handleSetCard: (card: string) => void;
  handleAddCard: () => void;
  toggleIsFormOpen: (bool: boolean) => void;
  handleSetLabel: (color: string, value: string) => void;
  clearLabel: () => void;
}

const AddCard = ({
  handleSetLabel,
  label,
  errors,
  card,
  clearLabel,
  handleSetCard,
  toggleIsFormOpen,
  isFormOpen,
  handleAddCard,
}: IAddCardProps) => {
  const [isColorLabelOpen, setIsColorLabelOpen] = useState(false);

  const closeColorLabel = () => setIsColorLabelOpen(false);

  return (
    <>
      {!isFormOpen ? (
        <div onClick={() => toggleIsFormOpen(true)} className="list-add-card-trigger">
          <AiOutlinePlus />
          <p>Add a card</p>
        </div>
      ) : (
        <div className="list-add-card-input-container">
          {errors.map((error, index) => {
            return (
              <p key={index} className="form-error">
                {error}
              </p>
            );
          })}
          <div className="list-input-wrapper">
            <div className="list-input-label-wrapper">
              <div style={{ width: '80%', minHeight: '30px', background: label.color }}>
                <p>{label.value}</p>
              </div>
              <div onClick={clearLabel}>
                <AiOutlineClose />
              </div>
            </div>
            <textarea
              value={card}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleSetCard(e.target.value)
              }
            ></textarea>
          </div>
          <div className="list-add-card-btn-container">
            <div>
              <button onClick={handleAddCard}>Add</button>
              <div style={{ display: 'inline' }} onClick={() => toggleIsFormOpen(false)}>
                <AiOutlineClose />
              </div>
            </div>
            <div onClick={() => setIsColorLabelOpen(true)}>
              <BsThreeDots />
            </div>
            {isColorLabelOpen && (
              <ColorLabels
                handleSetLabel={handleSetLabel}
                closeColorLabel={closeColorLabel}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default AddCard;
