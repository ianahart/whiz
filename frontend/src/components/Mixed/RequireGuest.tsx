import { useContext } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { UserContext } from '../../context/user';
import { retrieveTokens, namePath } from '../../helpers/utils';
import { IUserContext } from '../../interfaces';
interface Props {
  children: JSX.Element;
}

const RequireGuest: React.FC<Props> = ({ children }): JSX.Element => {
  const { user } = useContext(UserContext) as IUserContext;
  const location = useLocation();
  const guestRoutes = [
    '/',
    '/sign-up',
    '/sign-in',
    '/forgot-password',
    '/reset-password',
  ];
  const storage = retrieveTokens();
  if (storage === undefined && guestRoutes.includes(location.pathname)) {
    return children;
  } else {
    const name = namePath(user.full_name);
    return <Navigate to={`/${name}`} replace state={{ path: location.pathname }} />;
  }
};

export default RequireGuest;
