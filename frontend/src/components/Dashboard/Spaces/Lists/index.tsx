import { useContext } from 'react';
import { SpaceContext } from '../../../../context/space';
import { ISpaceContext } from '../../../../interfaces';
import List from './List';
import '../../../../styles/List.scss';
import { useDragControls, Reorder } from 'framer-motion';

const Lists = () => {
  const { lists, setLists } = useContext(SpaceContext) as ISpaceContext;
  const controls = useDragControls();

  return (
    <Reorder.Group
      axis="x"
      values={lists}
      onReorder={setLists}
      className="lists-container overflow-scroll"
    >
      {lists.map((list) => {
        return (
          <Reorder.Item
            dragListener={false}
            dragControls={controls}
            key={list.id}
            value={list}
          >
            <List list={list} controls={controls} />
          </Reorder.Item>
        );
      })}
    </Reorder.Group>
  );
};

export default Lists;
