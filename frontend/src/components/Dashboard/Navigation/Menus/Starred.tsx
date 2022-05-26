import { useContext, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { NavigationContext } from '../../../../context/navigation';
import { INavigationContext } from '../../../../interfaces';
import Menu from './Menu';
const Starred = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const { activeMenuItem, setActiveMenuItem } = useContext(
    NavigationContext
  ) as INavigationContext;
  return (
    <li>
      <div className="nav-item-trigger" onClick={() => setActiveMenuItem('starred')}>
        <p>Starred</p>
        <BsChevronDown />
      </div>
      {activeMenuItem === 'starred' && (
        <Menu label="Starred">
          <p>hi im in the menu</p>
        </Menu>
      )}
    </li>
  );
};

export default Starred;
