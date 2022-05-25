import { useState, useRef, useContext, useEffect } from 'react';
import { BsChevronDown, BsSearch } from 'react-icons/bs';
import { UserContext } from '../../../context/user';
import { IUserContext } from '../../../interfaces';
import NavItem from './NavItem';
import '../../../styles/Navigation.scss';
import Avatar from './Avatar';

const Navigation = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const navigationRef = useRef<HTMLDivElement | null>(null);
  const [isInputShowing, setIsInputShowing] = useState(false);
  const [windowInnerWidth, setWindowInnerWidth] = useState(0);

  const toggleMobileInput = () => {
    if (navigationRef!.current!.clientWidth < 601) {
      setIsInputShowing((prevState) => !prevState);
    }
  };

  const handleResize = (e: UIEvent) => {
    const w = e.target as Window;
    setWindowInnerWidth(w.innerWidth);
    if (w.innerWidth > 601) {
      setIsInputShowing(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={navigationRef} className="navigation-container">
      <h2 className="nav-logo">Whiz</h2>
      <div className="navigation-more-btn">
        <button>More</button>
        <BsChevronDown />
      </div>

      <div className="navigation-left">
        <ul>
          <NavItem label="Spaces" />
          <NavItem label="Recent" />
          <NavItem label="Starred" />
          <li>
            <div className="navigation-create-btn">
              <p>Create</p>
            </div>
          </li>
        </ul>
      </div>
      <div className="navigation-right">
        <div className="navigation-input-container">
          <input
            style={
              isInputShowing && windowInnerWidth < 600
                ? {
                    display: 'block',
                    position: 'absolute',
                    width: '300px',
                    top: '30px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    left: '-260px',
                  }
                : {}
            }
            placeholder="Search"
            type="text"
            name="search"
            id="search"
          />
          <div onClick={toggleMobileInput}>
            <BsSearch />
          </div>
        </div>
        <Avatar />
      </div>
    </div>
  );
};

export default Navigation;
