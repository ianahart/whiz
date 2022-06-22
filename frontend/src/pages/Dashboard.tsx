import { useState, useCallback, useMemo, useEffect, useContext } from 'react';
import { AxiosError } from 'axios';
import { Link } from 'react-router-dom';
import Navigation from '../components/Dashboard/Navigation';
import '../styles/Dashboard.scss';
import { http } from '../helpers/utils';
import { ISpaceContext, ISpaceMin, IUserContext } from '../interfaces';
import { ISpacesResponse } from '../interfaces/response';
import { SpaceContext } from '../context/space';
import { UserContext } from '../context/user';
import { makePossesiveName, makeFirstInitial } from '../helpers/utils';

const Dashboard = () => {
  const { space } = useContext(SpaceContext) as ISpaceContext;
  const { user } = useContext(UserContext) as IUserContext;
  const [page, setPage] = useState(1);
  const [spaces, setSpaces] = useState<ISpaceMin[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState('');
  const fetchYourSpaces = useCallback(async () => {
    try {
      const response = await http.get<ISpacesResponse>(`/spaces/?page=0&type=""`);
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
      const response = await http.get<ISpacesResponse>(`/spaces/?page=${page}&type=""`);
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

  const firstInitial = useMemo(() => {
    return makeFirstInitial(user.full_name);
  }, [user.full_name]);

  const possesiveName = useMemo(() => {
    return makePossesiveName(user.full_name);
  }, [user.full_name]);
  return (
    <div>
      <Navigation />
      <div className="dashboard-page-container">
        <p className="dashboard-page-title">Your spaces</p>
        <div className="dashboard-page-subtitle">
          <div className="dashboard-page-initial">{firstInitial}</div>
          <p>
            <span>{possesiveName}'s</span> spaces
          </p>
        </div>
        <div className="dashboard-container">
          {spaces.map((space) => {
            return (
              <Link to={`/spaces/${space.id}/${space.title}`} key={space.id}>
                <div className="dashboard-item">
                  {space.has_background && space.thumbnail ? (
                    <div
                      style={{ backgroundImage: `url(${space.thumbnail})` }}
                      className="dashboard-image-background"
                    >
                      <p className="dashboard-item-title">{space.title}</p>
                    </div>
                  ) : (
                    <div
                      className="dashboard-color-background"
                      style={{ background: space.color } as React.CSSProperties}
                    >
                      <p className="dashboard-item-title">{space.title}</p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        {hasNext && (
          <div className="dropdown-btn-container">
            <button onClick={paginate}>See more</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
