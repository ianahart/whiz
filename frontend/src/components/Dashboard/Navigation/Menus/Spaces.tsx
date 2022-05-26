import { BsChevronDown } from 'react-icons/bs';
import { useContext, useState } from 'react';
import Menu from './Menu';
import { NavigationContext } from '../../../../context/navigation';
import { INavigationContext } from '../../../../interfaces';

const Spaces = () => {
  const { activeMenuItem, setActiveMenuItem } = useContext(
    NavigationContext
  ) as INavigationContext;
  return (
    <li>
      <div className="nav-item-trigger" onClick={() => setActiveMenuItem('spaces')}>
        <p>Spaces</p>
        <BsChevronDown />
      </div>
      {activeMenuItem === 'spaces' && (
        <Menu label="Spaces">
          <p>hi im in the menu</p>
        </Menu>
      )}
    </li>
  );
};

export default Spaces;
