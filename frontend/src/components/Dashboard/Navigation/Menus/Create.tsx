import { useContext } from 'react';
import { NavigationContext } from '../../../../context/navigation';
import { INavigationContext } from '../../../../interfaces';
import Menu from './Menu';
import CreateDropdown from '../../Main/CreateDropdown';
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
          <CreateDropdown />
        </Menu>
      )}
    </li>
  );
};

export default Create;
