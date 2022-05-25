import { useLocation, Navigate } from 'react-router-dom';
import { retrieveTokens } from '../../helpers/utils';
interface Props {
  children: JSX.Element;
}

const RequireGuest: React.FC<Props> = ({ children }): JSX.Element => {
  const location = useLocation();
  const guestRoutes = ['/sign-up', '/sign-in'];
  const storage = retrieveTokens();
  if (storage === undefined && guestRoutes.includes(location.pathname)) {
    return children;
  } else {
    return <Navigate to="/" replace state={{ path: location.pathname }} />;
  }
};

export default RequireGuest;
