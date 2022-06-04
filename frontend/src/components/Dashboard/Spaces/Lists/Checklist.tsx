import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { AiOutlineCheckSquare } from 'react-icons/ai';
import { http } from '../../../../helpers/utils';
import { ICardDetails, ICheckList, ICheckListItem } from '../../../../interfaces';
import '../../../../styles/Checklist.scss';
import ChecklistItem from './ChecklistItem';

interface IChecklistProps {
  rerender: boolean;
  checklist: ICheckList;
  addChecklistItem: (item: ICheckListItem) => void;
  updateChecklistItem: (checked: boolean, item: ICheckListItem) => void;
  removeChecklist: (id: number) => void;
}

const Checklist = ({
  addChecklistItem,
  rerender,
  checklist,
  updateChecklistItem,
  removeChecklist,
}: IChecklistProps) => {
  const [isFormShowing, setIsFormShowing] = useState(false);
  const [listItemValue, setListItemValue] = useState('');
  const [progressBar, setProgressBar] = useState(0);
  const [error, setError] = useState('');
  const [hideComplete, setHideComplete] = useState(false);

  const getProgressBar = useCallback(() => {
    let total = 0;
    for (const item of checklist.checklist_checklist_items) {
      if (item.is_complete) {
        total += 1;
      }
      setProgressBar(
        Math.floor((total / checklist.checklist_checklist_items.length) * 100)
      );
    }
  }, [checklist]);
  useEffect(() => {
    getProgressBar();
  }, [rerender, getProgressBar]);

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

  const hideCheckedItems = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setHideComplete((prevState) => !prevState);
  };

  const handleRemoveChecklist = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    removeChecklist(checklist.id);
  };

  return (
    <div className="checklist-wrapper">
      <div className="checklist-hide-checked-items">
        <button className="checklist-action" onClick={hideCheckedItems}>
          {hideComplete ? 'Show checked items' : 'Hide checked items'}
        </button>
      </div>
      <div className="flex-center">
        <p className="progress-indicator">{`${progressBar}%`}</p>
        <div className="checklist-progress-bar-container">
          <div
            style={{ width: `${progressBar}%` }}
            className="checklist-progress-bar"
          ></div>
        </div>
      </div>
      <div className="check-list-title-container card-details-checklists-title">
        <div className="checklist-title">
          <AiOutlineCheckSquare />
          <p>{checklist.title}</p>
        </div>
        <div>
          <button onClick={handleRemoveChecklist} className="checklist-action">
            Delete
          </button>
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
        {hideComplete &&
          checklist.checklist_checklist_items
            .filter((list) => !list.is_complete)
            .map((checklistItem) => {
              return (
                <ChecklistItem
                  item={checklistItem}
                  updateChecklistItem={updateChecklistItem}
                  key={checklistItem.id}
                />
              );
            })}
        {!hideComplete &&
          checklist.checklist_checklist_items.map((checklistItem) => {
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
