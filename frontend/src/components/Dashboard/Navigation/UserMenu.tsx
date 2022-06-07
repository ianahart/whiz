import { useEffect, useRef, useCallback, useContext } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { IUserContext } from '../../../interfaces';
import { UserContext } from '../../../context/user';
import Logout from '../../Auth/Logout';
import { Link } from 'react-router-dom';

interface IUserMenuProps {
  closeUserMenu: () => void;
}

const UserMenu = ({ closeUserMenu }: IUserMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(UserContext) as IUserContext;
  const handleClickAway = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLButtonElement;
      if (menuRef.current !== null) {
        const children = Array.from(menuRef.current.children);
        if (!children?.includes(target) && target.className !== 'user-menu') {
          closeUserMenu();
        }
      }
    },
    [closeUserMenu]
  );

  useEffect(() => {
    window.addEventListener('click', handleClickAway);
    return () => window.removeEventListener('click', handleClickAway);
  }, [handleClickAway]);

  return (
    <div ref={menuRef} className="user-menu">
      <div className="close-menu">
        <div onClick={closeUserMenu}>
          <AiOutlineClose />
        </div>
      </div>
      <header className="user-menu-header">
        <div className="user-menu-row">
          {user?.initials && (
            <div className=" navigation-avatar user-menu-initials">{user.initials}</div>
          )}
          <p>{user.full_name}</p>
        </div>
        <div className="user-menu-email">
          <p>{user.email}</p>
        </div>
      </header>
      <div className="user-menu-column">
        <Logout />
      </div>
      <div className="user-menu-column delete-account">
        <Link to="/delete-account">Delete Account</Link>
      </div>
    </div>
  );
};
export default UserMenu;
