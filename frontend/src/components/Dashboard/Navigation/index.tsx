import { useState, useRef, useContext, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';
import { debounce } from 'lodash';
import { UserContext } from '../../../context/user';
import { ISpaceMin, IUserContext } from '../../../interfaces';
import '../../../styles/Navigation/Navigation.scss';
import Avatar from './Avatar';
import MenuWrapper from './Menus/MenuWrapper';
import { namePath } from '../../../helpers/utils';
import { AxiosError } from 'axios';
import { http } from '../../../helpers/utils';
import { ISearchResponse } from '../../../interfaces/response';
import SearchDropdown from '../Main/SearchDropdown';

const Navigation = () => {
  const { user } = useContext(UserContext) as IUserContext;
  const navigationRef = useRef<HTMLDivElement | null>(null);
  const [isInputShowing, setIsInputShowing] = useState(false);
  const [windowInnerWidth, setWindowInnerWidth] = useState(0);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [results, setResults] = useState<ISpaceMin[]>([]);
  const [searchIsOpen, setSearchIsOpen] = useState(false);

  const handleSearchIsOpen = (bool: boolean) => setSearchIsOpen(bool);

  const toggleMobileInput = () => {
    if (navigationRef!.current!.clientWidth < 601) {
      setIsInputShowing((prevState) => !prevState);
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    debounceSearch(event.target.value);
  };

  const debounceSearch = useCallback(
    debounce((value) => applySearch(value), 150),
    []
  );

  const applySearch = async (searchTerm: string) => {
    try {
      setResults([]);
      setError('');
      const response = await http.post<ISearchResponse>('/spaces/search/', {
        search_term: searchTerm,
      });
      setResults(response.data.results);
      setValue('');
      if (results.length) {
        handleSearchIsOpen(true);
      }
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        setValue('');
        setError(error.response.data.errors.search_term[0]);
      }
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
  const name = namePath(user.full_name);
  return (
    <div ref={navigationRef} className="navigation-container">
      <Link to={`/${name}`}>
        <h2 className="nav-logo">Whiz</h2>
      </Link>
      <div className="navigation-left">
        <MenuWrapper />
      </div>
      <div className="navigation-right">
        <div className="navigation-input-container">
          <input
            onChange={handleOnChange}
            autoComplete="off"
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
          {results.length > 0 && searchIsOpen && (
            <SearchDropdown
              error={error}
              handleSearchIsOpen={handleSearchIsOpen}
              results={results}
            />
          )}
        </div>
        <Avatar />
      </div>
    </div>
  );
};

export default Navigation;
