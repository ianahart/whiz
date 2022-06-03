import { AxiosError } from 'axios';
import { useState } from 'react';
import { AiOutlineCheckSquare } from 'react-icons/ai';
import { http } from '../../../../helpers/utils';
import { ICheckList, ICheckListItem } from '../../../../interfaces';
import '../../../../styles/Checklist.scss';
import ChecklistItem from './ChecklistItem';

interface IChecklistProps {
  checklist: ICheckList;
  addChecklistItem: (item: ICheckListItem) => void;
  updateChecklistItem: (checked: boolean, item: ICheckListItem) => void;
}

const Checklist = ({
  addChecklistItem,
  checklist,
  updateChecklistItem,
}: IChecklistProps) => {
  const [isFormShowing, setIsFormShowing] = useState(false);
  const [listItemValue, setListItemValue] = useState('');
  const [error, setError] = useState('');

  const openForm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsFormShowing(true);
  };

  const cancel = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsFormShowing(false);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setListItemValue(event.target.value);
  };

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setError('');
      const response = await http.post('/checklists/items/', {
        title: listItemValue,
        user: checklist.user,
        card: checklist.card,
        checklist: checklist.id,
      });
      addChecklistItem(response.data.checklist_item);
      setIsFormShowing(false);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        setError(error.response.data.errors?.title[0]);
      }
    }
  };

  return (
    <div className="checklist-wrapper">
      <div className="checklist-progress-bar"></div>
      <div className="check-list-title-container card-details-checklists-title">
        <div className="checklist-title">
          <AiOutlineCheckSquare />
          <p>{checklist.title}</p>
        </div>
        <div>
          <button className="checklist-action">Delete</button>
        </div>
      </div>
      <div className="checklist-item-form">
        {isFormShowing ? (
          <form onSubmit={handleOnSubmit}>
            {error && <p className="form-error">{error}</p>}
            <textarea onChange={handleOnChange} value={listItemValue}></textarea>
            <div className="checklist-form-actions">
              <button type="submit">Add</button>
              <button onClick={cancel}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="checklist-item-trigger">
            <button onClick={openForm} className="checklist-action">
              Add item
            </button>
          </div>
        )}
      </div>
      <div className="check-list-items-container">
        {checklist.checklist_checklist_items.map((checklistItem) => {
          return (
            <ChecklistItem
              item={checklistItem}
              updateChecklistItem={updateChecklistItem}
              key={checklistItem.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Checklist;
