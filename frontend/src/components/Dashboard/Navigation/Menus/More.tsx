import { useContext, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { NavigationContext } from '../../../../context/navigation';
import { INavigationContext } from '../../../../interfaces';
import Menu from './Menu';
const More = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);
  const { activeMenuItem, setActiveMenuItem } = useContext(
    NavigationContext
  ) as INavigationContext;
  return (
    <div className="navigation-more-btn">
      <div
        className="navigation-more-btn-group"
        onClick={() => setActiveMenuItem('more')}
      >
        <p>More</p>
        <BsChevronDown />
      </div>
      {activeMenuItem === 'more' && <Menu label="More"></Menu>}
    </div>
  );
};

export default More;
