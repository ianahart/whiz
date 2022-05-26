import { useRef, useEffect, useCallback, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import '../../../styles/Navigation/Dropdowns/Create.scss';
import { colors } from '../../../helpers/initialState';

const CreateDropdown = () => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState('');
  const handleClickAway = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    const target = event.target as Element;
    if (menuRef.current !== null) {
      const menuChildren = Array.from(menuRef.current.children);
      if (!menuRef.current.contains(target)) {
        setIsMenuOpen(false);
      }
    }
  }, []);

  const toggleSubMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsMenuOpen((prevState) => !prevState);
  };

  useEffect(() => {
    window.addEventListener('click', handleClickAway);
    return () => window.removeEventListener('click', handleClickAway);
  }, [handleClickAway]);

  return (
    <>
      <div className="create-dropdown-background">
        <p className="create-dropdown-label">Background</p>
        <div className="create-dropdown-colors">
          {colors.map((color) => {
            return (
              <div
                onClick={() => setSelectedBackground(color.color)}
                style={{ background: color.color }}
                key={color.id}
                className="create-dropdown-color"
              ></div>
            );
          })}
        </div>
        <div className="create-dropdown-sub-menu-trigger" onClick={toggleSubMenu}>
          <BsThreeDots />
        </div>
      </div>
      {isMenuOpen && (
        <div ref={menuRef} className="create-dropdown-sub-menu">
          <p>create sub menu</p>
        </div>
      )}
    </>
  );
};

export default CreateDropdown;
