import { useContext, useState } from 'react';
import { UserContext } from '../../../context/user';
import { IUserContext } from '../../../interfaces';
import UserMenu from './UserMenu';
const Avatar = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeUserMenu = () => {
    setIsMenuOpen(false);
  };
  const toggleUserMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsMenuOpen((prevState) => !prevState);
  };

  return (
    <div className="navigation-avatar-container">
      <div onClick={toggleUserMenu} className="navigation-avatar">
        {user?.initials}
      </div>
      {isMenuOpen && <UserMenu closeUserMenu={closeUserMenu} />}
    </div>
  );
};
export default Avatar;
