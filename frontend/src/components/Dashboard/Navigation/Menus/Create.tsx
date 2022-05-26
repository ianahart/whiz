import { useContext, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { NavigationContext } from '../../../../context/navigation';
import { INavigationContext } from '../../../../interfaces';
import Menu from './Menu';
const Create = () => {
  const { activeMenuItem, setActiveMenuItem } = useContext(
    NavigationContext
  ) as INavigationContext;
  return (
    <li>
      <div className="navigation-create-btn" onClick={() => setActiveMenuItem('create')}>
        <p>Create</p>
      </div>
      {activeMenuItem === 'create' && (
        <Menu label="Create">
          <p>hi im in the create menu</p>
        </Menu>
      )}
    </li>
  );
};

export default Create;
