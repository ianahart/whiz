import { AxiosError } from 'axios';
import { useState, useCallback, useContext, useEffect } from 'react';
import { http } from '../helpers/utils';
import { useParams } from 'react-router-dom';

import Navigation from '../components/Dashboard/Navigation/';
import '../styles/Space.scss';
import { IRetreiveSpaceResponse } from '../interfaces/response';
import { SpaceContext } from '../context/space';
import { ISpaceContext } from '../interfaces';
import WorkSpace from '../components/Dashboard/Spaces/WorkSpace';

const Space = () => {
  const params = useParams();
  const { setSpace, space, setLists } = useContext(SpaceContext) as ISpaceContext;

  const fetchSpace = useCallback(async () => {
    try {
      if (params.id === undefined) {
        return;
      }
      const response = await http.get<IRetreiveSpaceResponse>(
        `/spaces/${parseInt(params.id)}/?title=${params.title}`
      );
      setSpace(response.data.space);
      setLists(response.data.lists);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        const { errors } = error.response.data;
      }
    }
  }, [params.id, params.title, setSpace, setLists]);

  useEffect(() => {
    fetchSpace();
  }, [fetchSpace]);

  const background = () => {
    if (space.has_background) {
      return {
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundImage: `url(${space.background})`,
      } as React.CSSProperties;
    }
    if (space.color !== undefined || space.color !== null) {
      return { background: space.color } as React.CSSProperties;
    }
  };

  return (
    <div style={background()} className="space-container">
      <Navigation />
      <WorkSpace />
    </div>
  );
};

export default Space;
