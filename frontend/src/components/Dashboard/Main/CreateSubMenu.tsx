import { useEffect, useRef, useState, useCallback } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { IBackground } from '../../../interfaces';
import { IBackgroundResponse } from '../../../interfaces/response';
import { AxiosError } from 'axios';
import { http } from '../../../helpers/utils';
import Backgrounds from './Backgrounds';
export interface ICreateSubMenuProps {
  handleSetMenuIsOpen: (bool: boolean) => void;
  handleSelectedBackground: (src: string) => void;
  selectedBackground: string;
}

const CreateSubMenu = ({
  handleSetMenuIsOpen,
  handleSelectedBackground,
  selectedBackground,
}: ICreateSubMenuProps) => {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [nextBackgroundPage, setNextBackgroundPage] = useState(2);
  const [backgrounds, setBackgrounds] = useState<IBackground[]>([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const handleClickAway = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      const target = event.target as Element;
      if (menuRef.current !== null) {
        if (!menuRef.current.contains(target)) {
          handleSetMenuIsOpen(false);
        }
      }
    },
    [handleSetMenuIsOpen]
  );

  useEffect(() => {
    window.addEventListener('click', handleClickAway);
    return () => window.removeEventListener('click', handleClickAway);
  }, [handleClickAway]);

  const fetchBackgrounds = useCallback(async () => {
    try {
      setIsLoaded(false);
      const response = await http.get<IBackgroundResponse>(`/background/?page=2`);
      setNextBackgroundPage(response.data.page);
      setBackgrounds((prevState) => [...prevState, ...response.data.backgrounds]);
      setIsLoaded(true);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        setIsLoaded(true);
      }
    }
  }, []);

  const paginate = async () => {
    try {
      setIsLoaded(false);
      const response = await http.get<IBackgroundResponse>(
        `/background/?page=${nextBackgroundPage}`
      );
      setBackgrounds((prevState) => [...prevState, ...response.data.backgrounds]);
      setNextBackgroundPage(response.data.page);
      setIsLoaded(true);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        setIsLoaded(true);
      }
    }
  };

  useEffect(() => {
    fetchBackgrounds();
  }, [fetchBackgrounds]);

  return (
    <div ref={menuRef} className="create-dropdown-sub-menu">
      <p>Backgrounds</p>
      {isLoaded ? (
        <Backgrounds
          selectedBackground={selectedBackground}
          handleSelectedBackground={handleSelectedBackground}
          backgrounds={backgrounds}
        />
      ) : (
        <div className="create-dropdown-sub-menu-loader">
          <FaSpinner />
        </div>
      )}

      <h5 onClick={paginate}>See more</h5>
    </div>
  );
};

export default CreateSubMenu;
