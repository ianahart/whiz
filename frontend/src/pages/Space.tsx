import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Navigation from '../components/Dashboard/Navigation/';
import '../styles/Space.scss';
import { SpaceContext } from '../context/space';
import { ISpaceContext } from '../interfaces';
import WorkSpace from '../components/Dashboard/Spaces/WorkSpace';

const Space = () => {
  const params = useParams();
  const { fetchSpace, space } = useContext(SpaceContext) as ISpaceContext;

  useEffect(() => {
    if (params.id !== undefined && params.title !== undefined) {
      fetchSpace(parseInt(params.id), params.title);
    }
  }, [fetchSpace, params.id, params.title]);

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
