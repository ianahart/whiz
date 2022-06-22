import { ICheckListItem } from '../../../../interfaces/';

interface ICheckListItemProps {
  item: ICheckListItem;
  updateChecklistItem: (checked: boolean, item: ICheckListItem) => void;
}

const ChecklistItem = ({ updateChecklistItem, item }: ICheckListItemProps) => {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateChecklistItem(event.target.checked, item);
  };

  return (
    <div className="checklist-item">
      <label>
        <input
          onChange={handleOnChange}
          defaultChecked={item.is_complete}
          className="custom-checkbox"
          type="checkbox"
        />
        <span>{item.title}</span>
      </label>
    </div>
  );
};
export default ChecklistItem;
