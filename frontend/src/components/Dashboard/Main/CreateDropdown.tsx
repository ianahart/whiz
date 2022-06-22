import { useEffect, useCallback, useState, useContext } from 'react';
import { BsCheck, BsThreeDots } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { http } from '../../../helpers/utils';
import '../../../styles/Navigation/Dropdowns/Create.scss';
import { colors } from '../../../helpers/initialState';
import { IBackgroundResponse, ICreateSpaceResponse } from '../../../interfaces/response';
import { IBackground, INavigationContext, ISpaceMin } from '../../../interfaces';
import CreateSubMenu from './CreateSubMenu';
import Backgrounds from './Backgrounds';
import { NavigationContext } from '../../../context/navigation';

const CreateDropdown = () => {
  const navigate = useNavigate();
  const { setActiveMenuItem } = useContext(NavigationContext) as INavigationContext;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState({
    background: '',
    thumbnail: '',
  });
  const [backgrounds, setBackgrounds] = useState<IBackground[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [space, setSpace] = useState<ISpaceMin | null>(null);
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);

    if (title.trim().length > 1) {
      setIsButtonActive(true);
      return;
    }
    setIsButtonActive(false);
  };

  const handleSetMenuIsOpen = (bool: boolean) => {
    setIsMenuOpen(bool);
  };

  const handleSelectedBackground = (background: string, thumbnail: string) => {
    setSelectedBackground((prevState) => ({
      ...prevState,
      background,
      thumbnail,
    }));
  };

  const toggleSubMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsMenuOpen((prevState) => !prevState);
  };
  const fetchBackgrounds = useCallback(async () => {
    try {
      const response = await http.get<IBackgroundResponse>('/spaces/background/');
      setBackgrounds((prevState) => [...prevState, ...response.data.backgrounds]);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        let { errors } = error.response.data;
        errors = Object.entries(errors);
      }
    }
  }, []);

  useEffect(() => {
    fetchBackgrounds();
  }, [fetchBackgrounds]);

  const handleSelectColor = (event: React.MouseEvent<HTMLDivElement>, color: string) => {
    event.stopPropagation();
    setSelectedBackground({ background: color, thumbnail: '' });
  };

  const handleOnClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.stopPropagation();
      setError('');
      if (title.trim().length === 0 || selectedBackground.background.length === 0) {
        setError('Please choose a background for your space and a title.');
        return;
      }
      const response = await http.post<ICreateSpaceResponse>('/spaces/', {
        title,
        background: selectedBackground.background,
        thumbnail: selectedBackground.thumbnail,
      });
      setSpace(response.data.space);
      setIsLoaded(true);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        const { errors } = error.response.data;
        setError(errors);
        setIsLoaded(true);
      }
    }
  };

  useEffect(() => {
    if (isLoaded && space !== null) {
      setActiveMenuItem('');
      navigate(`/spaces/${space.id}/${space.title}`);
    }
  }, [isLoaded, setActiveMenuItem, navigate, space]);

  return (
    <>
      <div className="create-dropdown-background">
        {selectedBackground && selectedBackground.background.includes('http') ? (
          <div className="create-dropdown-hero-background">
            <img src={selectedBackground.background} alt="background of space" />
          </div>
        ) : (
          <div
            style={{ background: selectedBackground.background }}
            className="create-dropdown-hero-background"
          ></div>
        )}
        <p className="create-dropdown-label">Background</p>
        <Backgrounds
          selectedBackground={selectedBackground}
          backgrounds={backgrounds}
          handleSelectedBackground={handleSelectedBackground}
        />
        <div className="create-dropdown-colors">
          {colors.map((color) => {
            return (
              <div className="create-dropdown-background-container-item" key={color.id}>
                <div
                  onClick={(e) => handleSelectColor(e, color.color)}
                  style={{ background: color.color }}
                  key={color.id}
                  className="create-dropdown-color"
                ></div>
                {color.color === selectedBackground.background && (
                  <div className="create-dropdown-background-overlay">
                    <BsCheck />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="create-dropdown-sub-menu-trigger" onClick={toggleSubMenu}>
          <BsThreeDots />
        </div>
      </div>
      {isMenuOpen && (
        <CreateSubMenu
          selectedBackground={selectedBackground}
          handleSelectedBackground={handleSelectedBackground}
          handleSetMenuIsOpen={handleSetMenuIsOpen}
        />
      )}
      <div className="create-dropdown-form">
        <div className="create-dropdown-form-group">
          <label htmlFor="space">Space title:</label>
          <input onChange={handleOnChange} type="text" name="space" id="space" />
          {error && <p className="form-error">{error}</p>}
        </div>
        <div className="create-dropdown-button-container">
          <button
            onClick={handleOnClick}
            disabled={isButtonActive ? false : true}
            style={{ background: isButtonActive ? '#2f7db9' : '#cacbcb' }}
          >
            Create
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateDropdown;
