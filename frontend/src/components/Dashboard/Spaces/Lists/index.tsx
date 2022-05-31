import { useContext} from 'react';
import { SpaceContext } from '../../../../context/space';
import { ISpaceContext } from '../../../../interfaces';
import List from './List';
import '../../../../styles/List.scss';

const Lists = () => {
  const { lists } = useContext(SpaceContext) as ISpaceContext;

  return (
    <div className="lists-container overflow-scroll">
      {lists.map((list) => {
        return <List key={list.id} list={list} />;
      })}
    </div>
  );
};

export default Lists;
