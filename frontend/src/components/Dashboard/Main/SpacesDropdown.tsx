import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import '../../../styles/shared/Mixed.scss';
import { http } from '../../../helpers/utils';
import { ISpaceMin } from '../../../interfaces';
import { ISpacesResponse } from '../../../interfaces/response';

interface ISpacesDropdownProps {
  type: string;
}

const SpacesDropdown = ({ type }: ISpacesDropdownProps) => {
  const [page, setPage] = useState(1);
  const [spaces, setSpaces] = useState<ISpaceMin[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState('');
  const fetchYourSpaces = useCallback(async () => {
    try {
      const response = await http.get<ISpacesResponse>(`/spaces/?page=0&type=${type}`);
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
      const response = await http.get<ISpacesResponse>(
        `/spaces/?page=${page}&type=${type}`
      );
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
    <div className="dropdown-container">
      <div>
        {spaces.map((space) => {
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
      {error && <p className="spaces-dropdown-error">{error}</p>}
      {!error && hasNext && (
        <div className="dropdown-btn-container">
          <button onClick={paginate}>See more</button>
        </div>
      )}
    </div>
  );
};

export default SpacesDropdown;
