import { useContext } from 'react';
import { BsListUl } from 'react-icons/bs';
import { UserContext } from '../../../../context/user';
import { IUserContext } from '../../../../interfaces';

export interface IActivityProps {
  readableDate: string;
  listTitle: string;
}

const Activity = ({ readableDate, listTitle }: IActivityProps) => {
  const { user } = useContext(UserContext) as IUserContext;

  return (
    <div className="card-details-activity-container">
      <div className="card-details-activity-title">
        <BsListUl /> <p>Activity</p>
      </div>
      <div className="card-details-activity">
        <div className="card-details-activity-avatar">{user.initials}</div>
        <div>
          <p>
            <span>{user.full_name}</span> added this card to list {listTitle}
          </p>
        </div>
      </div>
      <div className="card-details-activity-date">
        <p>{readableDate}</p>
      </div>
    </div>
  );
};
export default Activity;
