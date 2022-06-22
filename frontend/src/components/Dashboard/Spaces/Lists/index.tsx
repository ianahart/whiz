import { useContext } from 'react';
import { SpaceContext } from '../../../../context/space';
import { ISpaceContext } from '../../../../interfaces';
import { nanoid } from 'nanoid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import List from './List';
import '../../../../styles/List.scss';
import { http } from '../../../../helpers/utils';
import { AxiosError } from 'axios';

const Lists = () => {
  const { lists, setLists } = useContext(SpaceContext) as ISpaceContext;

  const handleOnDragEnd = async (result: any) => {
    try {
      if (!result.destination) return;

      const items = Array.from(lists);
      const [reorderedItem] = items.splice(result.source.index, 1);
      reorderedItem.index = result.destination.index;
      items.splice(result.destination.index, 0, reorderedItem);
      setLists(items);
      await http.post('/lists/reorder/', {
        lists: items.map(({ id }, index) => ({ id, x_coordinate: index })),
      });
    } catch (err: unknown | AxiosError) {
      if (err instanceof AxiosError && err.response) {
        console.log(err.response);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="lists" direction="horizontal">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="lists-container overflow-scroll"
          >
            {lists.map((list, index) => {
              return (
                <Draggable key={list.id} draggableId={list.id.toString()} index={index}>
                  {(provided) => <List provided={provided} list={list} />}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Lists;
