import { BsChevronDown } from 'react-icons/bs';
import { useContext } from 'react';
import Menu from './Menu';
import { NavigationContext } from '../../../../context/navigation';
import { INavigationContext } from '../../../../interfaces';
import SpacesDropdown from '../../Main/SpacesDropdown';

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
          <SpacesDropdown />
        </Menu>
      )}
    </li>
  );
};

export default Spaces;
