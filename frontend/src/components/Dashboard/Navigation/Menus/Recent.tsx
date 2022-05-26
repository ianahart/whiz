import { useContext, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { NavigationContext } from '../../../../context/navigation';
import { INavigationContext } from '../../../../interfaces';
import Menu from './Menu';
const Recent = () => {
  const { activeMenuItem, setActiveMenuItem } = useContext(
    NavigationContext
  ) as INavigationContext;
  return (
    <li>
      <div onClick={() => setActiveMenuItem('recent')}>
        <p>Recent</p>
        <BsChevronDown />
      </div>
      {activeMenuItem === 'recent' && (
        <Menu label="Recent">
          <p>hi im in the menu</p>
        </Menu>
      )}
    </li>
  );
};

export default Recent;
