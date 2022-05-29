import { useRef } from 'react';
import Draggable from 'react-draggable';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { IList } from '../../../../interfaces';

export interface IListProps {
  list: IList;
}

const List = ({ list }: IListProps) => {
  const nodeRef = useRef(null);

  return (
    <Draggable nodeRef={nodeRef} grid={[50, 50]} axis="x">
      <div ref={nodeRef} className="list-container">
        <div className="list-title">
          <p>{list.title}</p>
          <BsThreeDots />
        </div>
        <div className="list-add-card-trigger">
          <AiOutlinePlus />
          <p>Add a card</p>
        </div>
      </div>
    </Draggable>
  );
};

export default List;
