import { ISpaceMin } from '../../../interfaces';
import { Link } from 'react-router-dom';
import { useCallback, useRef, useEffect } from 'react';
interface ISearchDropdownProps {
  error: string;
  results: ISpaceMin[];
  handleSearchIsOpen: (bool: boolean) => void;
}

const SearchDropdown = ({ handleSearchIsOpen, error, results }: ISearchDropdownProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickAway = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      const target = event.target as Element;
      if (menuRef.current !== null) {
        if (!menuRef.current.contains(target)) {
          handleSearchIsOpen(false);
        }
      }
    },
    [handleSearchIsOpen]
  );

  useEffect(() => {
    window.addEventListener('click', handleClickAway);
    return () => window.removeEventListener('click', handleClickAway);
  }, [handleClickAway]);

  return (
    <div className="search-dropdown-container" ref={menuRef}>
      <div className="search-dropdown-title">
        <p>Results ({results.length})</p>
      </div>

      {results.map((space) => {
        return (
          <Link to={`/spaces/${space.id}/${space.title}`} key={space.id}>
            <div className="dropdown-item">
              {space.has_background && space.thumbnail ? (
                <img
                  className="dropdown-image-background"
                  src={space.thumbnail}
                  alt="space background"
                />
              ) : (
                <div
                  className="dropdown-color-background"
                  style={{ background: space.color } as React.CSSProperties}
                ></div>
              )}
              <p>{space.title}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default SearchDropdown;
