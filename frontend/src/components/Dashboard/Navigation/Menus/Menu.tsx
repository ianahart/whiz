import { useCallback, useContext, useEffect, useRef } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { NavigationContext } from '../../../../context/navigation';
import { INavigationContext } from '../../../../interfaces';

export interface INavMenuProps {
  children?: React.ReactNode;
  label: string;
}

const Menu = ({ children, label }: INavMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { setActiveMenuItem } = useContext(NavigationContext) as INavigationContext;

  const handleClickAway = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    const target = event.target as Element;
    if (menuRef.current !== null) {
      const menuChildren = Array.from(menuRef.current.children);
      if (!menuRef.current.contains(target)) {
        setActiveMenuItem('');
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleClickAway);
    return () => window.removeEventListener('click', handleClickAway);
  }, [handleClickAway]);

  return (
    <>
      <div ref={menuRef} className="nav-item-menu">
        <div className="nav-item-menu-title">
          <p>{label}</p>
          <div className="nav-item-menu-close" onClick={() => setActiveMenuItem('')}>
            <AiOutlineClose />
          </div>
        </div>
        {children}
      </div>
      <div></div>
    </>
  );
};

export default Menu;
