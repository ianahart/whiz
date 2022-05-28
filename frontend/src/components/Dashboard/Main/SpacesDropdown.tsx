import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import '../../../styles/Navigation/Dropdowns/Space.scss';
import { http } from '../../../helpers/utils';
import { ISpaceMin } from '../../../interfaces';
import { ISpacesDropdownResponse } from '../../../interfaces/response';

const SpacesDropdown = () => {
  const [page, setPage] = useState(1);
  const [spaces, setSpaces] = useState<ISpaceMin[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState('');
  const fetchYourSpaces = useCallback(async () => {
    try {
      const response = await http.get<ISpacesDropdownResponse>(`/spaces/?page=0`);
      setPage(response.data.page);
      setSpaces(response.data.spaces);
      setHasNext(response.data.has_next);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
      }
    }
  }, []);

  const paginate = async () => {
    try {
      if (!hasNext) {
        return;
      }
      const response = await http.get<ISpacesDropdownResponse>(`/spaces/?page=${page}`);
      setPage(response.data.page);
      setHasNext(response.data.has_next);
      setSpaces((prevState) => [...prevState, ...response.data.spaces]);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        setError(error.response.data.errors);
      }
    }
  };

  useEffect(() => {
    fetchYourSpaces();
  }, [fetchYourSpaces]);

  return (
    <div className="spaces-dropdown-container">
      <div>
        {spaces.map((space) => {
          return (
            <Link to={`/spaces/${space.id}/${space.title}`} key={space.id}>
              <div className="spaces-dropdown-item">
                {space.has_background && space.thumbnail ? (
                  <img
                    className="space-dropdown-image-background"
                    src={space.thumbnail}
                    alt="space background"
                  />
                ) : (
                  <div
                    className="space-dropdown-color-background"
                    style={{ background: space.color } as React.CSSProperties}
                  ></div>
                )}
                <p>{space.title}</p>
              </div>
            </Link>
          );
        })}
      </div>
      {error && <p className="spaces-dropdown-error">{error}</p>}
      {!error && hasNext && (
        <div className="spaces-dropdown-btn-container">
          <button onClick={paginate}>See more</button>
        </div>
      )}
    </div>
  );
};

export default SpacesDropdown;
