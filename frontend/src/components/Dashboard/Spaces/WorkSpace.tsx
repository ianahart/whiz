import { AxiosError } from 'axios';
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Workspace.scss';
import { http } from '../../../helpers/utils';
import { UserContext } from '../../../context/user';
import { ISpaceContext, IUserContext } from '../../../interfaces/';
import { SpaceContext } from '../../../context/space';
import { ICreateListResponse } from '../../../interfaces/response';
import Lists from './Lists';

const WorkSpace = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext) as IUserContext;
  const { space, updateTitle, addList } = useContext(SpaceContext) as ISpaceContext;
  const [isAddListOpen, setIsAddListOpen] = useState(false);
  const [listTitle, setListTitle] = useState('');
  const [workSpaceError, setWorkSpaceError] = useState('');
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setListTitle(event.target.value);
  };

  const editTitle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.value.trim().length === 0) {
        setIsTitleEditing(false);
        return;
      }
      if (space.title === event.target.value) {
        return;
      }
      updateTitle(event.target.value);
      const response = await http.patch(`/spaces/${space.id}/`, {
        title: event.target.value,
      });

      setIsTitleEditing(false);
      navigate(`/spaces/${space.id}/${event.target.value}`);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        return;
      }
    }
  };
  const startList = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.stopPropagation();
      setWorkSpaceError('');
      if (listTitle.trim().length > 75) {
        setWorkSpaceError('Ensure this field has no more than 75 characters.');
        return;
      }
      const response = await http.post<ICreateListResponse>('/lists/', {
        space: space.id,
        user: user.id,
        title: listTitle,
      });
      addList(response.data.list);
      setIsAddListOpen(false);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        setWorkSpaceError(error.response.data.errors.title[0]);
      }
    }
  };

  return (
    <div>
      <div className="workspace-add-list-container">
        <div
          onClick={() => setIsAddListOpen(true)}
          className="workspace-add-btn-container"
        >
          <AiOutlinePlus />
          <p>Add another list</p>
        </div>
        {isAddListOpen && (
          <>
            <div className="workspace-input-container">
              {workSpaceError && <p className="workspace-error">{workSpaceError}</p>}
              <input onChange={handleOnChange} type="text" name="title" />
              <div className="workspace-input-add-container">
                <button onClick={startList}>Add</button>
                <div onClick={() => setIsAddListOpen(false)}>
                  <AiOutlineClose />
                </div>
              </div>
            </div>
          </>
        )}
        <div className="workspace-space-title">
          {!isTitleEditing && (
            <h1 onClick={() => setIsTitleEditing(true)}>{space.title}</h1>
          )}
          {isTitleEditing && (
            <div className="workspace-space-title-input">
              <input onBlur={editTitle} type="text" />
            </div>
          )}
        </div>
      </div>
      <Lists />
    </div>
  );
};

export default WorkSpace;
