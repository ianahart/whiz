import { useContext, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { NavigationContext } from '../../../../context/navigation';
import { INavigationContext } from '../../../../interfaces';
import SpacesDropdown from '../../Main/SpacesDropdown';
import Menu from './Menu';
const Starred = () => {
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
          <SpacesDropdown type="starred" />
        </Menu>
      )}
    </li>
  );
};

export default Starred;
