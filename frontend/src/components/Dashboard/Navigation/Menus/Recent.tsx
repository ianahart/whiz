import { useContext } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { NavigationContext } from '../../../../context/navigation';
import { INavigationContext } from '../../../../interfaces';
import SpacesDropdown from '../../Main/SpacesDropdown';

import Menu from './Menu';
const Recent = () => {
  const { activeMenuItem, setActiveMenuItem } = useContext(
    NavigationContext
  ) as INavigationContext;
  return (
    <li>
      <div className="nav-item-trigger" onClick={() => setActiveMenuItem('recent')}>
        <p>Recent</p>
        <BsChevronDown />
      </div>
      {activeMenuItem === 'recent' && (
        <Menu label="Recent">
          <SpacesDropdown type="recent" />
        </Menu>
      )}
    </li>
  );
};

export default Recent;
