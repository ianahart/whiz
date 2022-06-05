import { useCallback, useEffect, useRef, useState } from 'react';

import { AiOutlineClose } from 'react-icons/ai';
import ListConsent from './ListConsent';

interface IListActionsProps {
  handleListActionsOpen: (bool: boolean) => void;
  listId: number;
}

const ListActions = ({ listId, handleListActionsOpen }: IListActionsProps) => {
  const [listConsentOpen, setListConsentOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleListConsentOpen = (bool: boolean) => setListConsentOpen(false);

  const clickAway = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      const target = event.target as Element;
      if (menuRef.current !== null) {
        if (!menuRef.current.contains(target)) {
          handleListActionsOpen(false);
        }
      }
    },
    [handleListActionsOpen]
  );

  useEffect(() => {
    window.addEventListener('click', clickAway);
    return () => window.removeEventListener('click', clickAway);
  }, [clickAway]);

  return (
    <div ref={menuRef} className="list-actions">
      <div className="list-actions-title">
        <p>Options</p>
        <div onClick={() => handleListActionsOpen(false)}>
          <AiOutlineClose />
        </div>
      </div>
      <ul>
        <li onClick={() => setListConsentOpen(true)}>Delete</li>
        {listConsentOpen && (
          <ListConsent listId={listId} handleListConsentOpen={handleListConsentOpen} />
        )}
      </ul>
    </div>
  );
};

export default ListActions;
