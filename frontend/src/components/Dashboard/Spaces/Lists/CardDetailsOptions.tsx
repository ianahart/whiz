import { AiOutlineCheckSquare, AiOutlineClockCircle } from 'react-icons/ai';
import { BsPaintBucket, BsTrash, BsTruck } from 'react-icons/bs';
import { useState } from 'react';
import ColorLabels from './ColorLabels';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../../../styles/shared/Mixed.scss';
import { CalendarDate } from '../../../../types/';
import MoveCard from './MoveCard';
import { ICard, ICheckList } from '../../../../interfaces';
import ChecklistTitleForm from './ChecklistTitleForm';

interface CardDetailsOptionsProps {
  removeCard: () => void;
  handleSetLabel: (color: string, value: string) => void;
  handleSetDateIsOpen: (bool: boolean) => void;
  datesIsOpen: boolean;
  closeColorLabel: () => void;
  openColorLabel: () => void;
  colorLabelClosed: boolean;
  hasButton: boolean;
  card: ICard;
  changeLabel: () => void;
  dates: CalendarDate;
  handleDateChange: (value: CalendarDate) => void;
  addCheckList: (checklist: ICheckList) => void;
}

const CardDetailsOptions = ({
  closeColorLabel,
  changeLabel,
  addCheckList,
  card,
  handleSetLabel,
  datesIsOpen,
  handleSetDateIsOpen,
  dates,
  handleDateChange,
  hasButton,
  openColorLabel,
  removeCard,
  colorLabelClosed,
}: CardDetailsOptionsProps) => {
  const [isMoveListOpen, setIsMovelistOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  const handleSetMoveListOpen = (bool: boolean) => setIsMovelistOpen(bool);
  const handleSetChecklistOpen = (bool: boolean) => setIsChecklistOpen(bool);
  const openMoveList = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    handleSetMoveListOpen(true);
  };
  return (
    <div className="card-details-options">
      <p>Add to card</p>
      <div className="card-details-options-add">
        <div className="card-details-option">
          <div className="flex-center" onClick={() => handleSetDateIsOpen(!datesIsOpen)}>
            <AiOutlineClockCircle />
            <p>Dates</p>
          </div>
          {datesIsOpen && (
            <div className="calendar-container">
              <Calendar
                tileClassName="tile"
                view="month"
                selectRange={true}
                onChange={handleDateChange}
                value={dates}
              />
            </div>
          )}
        </div>
        <div className="card-details-option">
          <div onClick={openColorLabel} style={{ display: 'flex', position: 'relative' }}>
            <BsPaintBucket />
            <p>Labels</p>
            {colorLabelClosed && (
              <div className="color-label-wrapper">
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
        <div onClick={() => handleSetChecklistOpen(true)} className="card-details-option">
          <AiOutlineCheckSquare />
          <p>Checklist</p>
          {isChecklistOpen && (
            <ChecklistTitleForm
              card={card}
              addCheckList={addCheckList}
              handleSetChecklistOpen={handleSetChecklistOpen}
            />
          )}
        </div>
      </div>
      <p className="card-details-options-action-title">Actions</p>
      <div className="card-details-options-action">
        <div onClick={removeCard} role="button" className="card-details-option">
          <BsTrash />
          <p>Delete</p>
        </div>
        <div
          style={{ position: 'relative' }}
          onClick={openMoveList}
          role="button"
          className="card-details-option"
        >
          <BsTruck />
          <p>Move</p>
          {isMoveListOpen && (
            <MoveCard card={card} handleSetMoveListOpen={handleSetMoveListOpen} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDetailsOptions;
