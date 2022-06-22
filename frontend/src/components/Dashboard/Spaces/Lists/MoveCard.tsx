import { useCallback, useContext, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { SpaceContext } from '../../../../context/space';
import { ICard, ISpaceContext } from '../../../../interfaces';
import { AxiosError } from 'axios';
import { http } from '../../../../helpers/utils';

interface IMoveCardProps {
  handleSetMoveListOpen: (bool: boolean) => void;
  card: ICard;
}

const MoveCard = ({ card, handleSetMoveListOpen }: IMoveCardProps) => {
  const params = useParams();
  const { lists, setLists, fetchSpace } = useContext(SpaceContext) as ISpaceContext;
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClickAway = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      const target = event.target as Element;
      if (menuRef.current !== null) {
        if (!menuRef.current.contains(target)) {
          handleSetMoveListOpen(false);
        }
      }
    },
    [handleSetMoveListOpen]
  );

  const closeMoveList = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    handleSetMoveListOpen(false);
  };

  const handleMove = async (
    event: React.MouseEvent<HTMLParagraphElement>,
    listId: number
  ) => {
    try {
      event.stopPropagation();
      handleSetMoveListOpen(false);
      if (params.id !== undefined && params.title !== undefined) {
        const response = await http.patch(`/cards/${card.id}/move/`, { list: listId });
        fetchSpace(parseInt(params.id), params.title);
        setLists([]);
      }
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        return;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickAway);
    return () => window.removeEventListener('click', handleClickAway);
  }, [handleClickAway]);
  return (
    <div ref={menuRef} className="move-card-container">
      <div className="move-card-list-title">
        <p>Move</p>
        <div onClick={closeMoveList}>
          <AiOutlineClose />
        </div>
      </div>
      <div className="move-card-list-items">
        {lists.map((list) => {
          return (
            <p onClick={(e) => handleMove(e, list.id)} key={list.id}>
              {list.title}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default MoveCard;
