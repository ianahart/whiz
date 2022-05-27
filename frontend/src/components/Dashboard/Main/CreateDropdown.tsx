import { useEffect, useCallback, useState } from 'react';
import { BsCheck, BsThreeDots } from 'react-icons/bs';
import { AxiosError } from 'axios';
import { http } from '../../../helpers/utils';
import '../../../styles/Navigation/Dropdowns/Create.scss';
import { colors } from '../../../helpers/initialState';
import { IBackgroundResponse } from '../../../interfaces/response';
import { IBackground } from '../../../interfaces';
import CreateSubMenu from './CreateSubMenu';
import Backgrounds from './Backgrounds';

const CreateDropdown = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState('');
  const [backgrounds, setBackgrounds] = useState<IBackground[]>([]);

  const handleSetMenuIsOpen = (bool: boolean) => {
    setIsMenuOpen(bool);
  };

  const handleSelectedBackground = (src: string) => setSelectedBackground(src);

  const toggleSubMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsMenuOpen((prevState) => !prevState);
  };
  const fetchBackgrounds = useCallback(async () => {
    try {
      const response = await http.get<IBackgroundResponse>('/background/');
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
    setSelectedBackground(color);
  };

  return (
    <>
      <div className="create-dropdown-background">
        {selectedBackground && selectedBackground.includes('http') ? (
          <div className="create-dropdown-hero-background">
            <img src={selectedBackground} alt="background of space" />
          </div>
        ) : (
          <div
            style={{ background: selectedBackground }}
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
                {color.color === selectedBackground && (
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
    </>
  );
};

export default CreateDropdown;
