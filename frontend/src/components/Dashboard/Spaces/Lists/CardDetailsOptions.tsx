import { AiOutlineClockCircle } from 'react-icons/ai';
import { BsPaintBucket, BsTrash } from 'react-icons/bs';
import ColorLabels from './ColorLabels';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../../../styles/shared/Mixed.scss';
import { CalendarDate } from '../../../../types/';

interface CardDetailsOptionsProps {
  removeCard: () => void;
  handleSetLabel: (color: string, value: string) => void;
  handleSetDateIsOpen: (bool: boolean) => void;
  datesIsOpen: boolean;
  closeColorLabel: () => void;
  openColorLabel: () => void;
  colorLabelClosed: boolean;
  hasButton: boolean;
  changeLabel: () => void;
  dates: CalendarDate;
  handleDateChange: (value: CalendarDate) => void;
}

const CardDetailsOptions = ({
  closeColorLabel,
  changeLabel,
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
