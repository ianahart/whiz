import { AxiosError } from 'axios';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { UserContext } from '../../../../context/user';
import { http } from '../../../../helpers/utils';
import { IUserContext, ICard, ICheckList } from '../../../../interfaces';
import { ICreateChecklistResponse } from '../../../../interfaces/response';

interface IChecklistTitleFormProps {
  handleSetChecklistOpen: (bool: boolean) => void;
  card: ICard;
  addCheckList: (checklist: ICheckList) => void;
}

const ChecklistTitleForm = ({
  card,
  handleSetChecklistOpen,
  addCheckList,
}: IChecklistTitleFormProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState('Checklist');
  const [error, setError] = useState('');
  const { user } = useContext(UserContext) as IUserContext;

  const handleClickAway = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      const target = event.target as Element;
      if (menuRef.current !== null) {
        if (!menuRef.current.contains(target)) {
          handleSetChecklistOpen(false);
        }
      }
    },
    [handleSetChecklistOpen]
  );

  const handleClose = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    handleSetChecklistOpen(false);
  };

  useEffect(() => {
    window.addEventListener('click', handleClickAway);
    return () => window.removeEventListener('click', handleClickAway);
  }, [handleClickAway]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      event.stopPropagation();
      setError('');
      const response = await http.post<ICreateChecklistResponse>('/checklists/', {
        title,
        card: card.id,
        user: user.id,
      });
      addCheckList(response.data.checklist);
      handleSetChecklistOpen(false);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        if (error.response.status === 400) {
          setError(error.response.data.errors.title[0]);
        }
      }
    }
  };

  return (
    <div className="card-add-checklist-container" ref={menuRef}>
      <div className="card-add-checklist-header">
        <p>Checklist</p>
        <div onClick={handleClose}>
          <AiOutlineClose />
        </div>
      </div>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="checklist">Title</label>
        <input
          id="checklist"
          name="checklist"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(event.target.value)
          }
          value={title}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default ChecklistTitleForm;
