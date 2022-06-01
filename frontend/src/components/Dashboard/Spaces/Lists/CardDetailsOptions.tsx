import { AiOutlineClockCircle } from 'react-icons/ai';
import { BsPaintBucket, BsTrash } from 'react-icons/bs';
import ColorLabels from './ColorLabels';

interface CardDetailsOptionsProps {
  removeCard: () => void;
  handleSetLabel: (color: string, value: string) => void;
  closeColorLabel: () => void;
  openColorLabel: () => void;
  colorLabelClosed: boolean;
  hasButton: boolean;
  changeLabel: () => void;
}

const CardDetailsOptions = ({
  closeColorLabel,
  changeLabel,
  handleSetLabel,
  hasButton,
  openColorLabel,
  removeCard,
  colorLabelClosed,
}: CardDetailsOptionsProps) => {
  return (
    <div className="card-details-options">
      <p>Add to card</p>
      <div className="card-details-options-add">
        <div className="card-details-option">
          <AiOutlineClockCircle />
          <p>Dates</p>
        </div>
        <div className="card-details-option">
          <div onClick={openColorLabel} style={{ display: 'flex', position: 'relative' }}>
            <BsPaintBucket />
            <p>Labels</p>
            {colorLabelClosed && (
              <div style={{ position: 'absolute', top: '-34px' }}>
                <ColorLabels
                  changeLabel={changeLabel}
                  handleSetLabel={handleSetLabel}
                  hasButton={hasButton}
                  closeColorLabel={closeColorLabel}
                />
              </div>
            )}
          </div>
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
