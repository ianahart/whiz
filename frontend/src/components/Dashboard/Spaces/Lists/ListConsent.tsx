import { AxiosError } from 'axios';
import { useContext, useCallback, useEffect, useRef } from 'react';
import { SpaceContext } from '../../../../context/space';
import { http } from '../../../../helpers/utils';
import { ISpaceContext } from '../../../../interfaces';

interface IListConsentProps {
  handleListConsentOpen: (bool: boolean) => void;
  listId: number;
}

const ListConsent = ({ handleListConsentOpen, listId }: IListConsentProps) => {
  const { removeList } = useContext(SpaceContext) as ISpaceContext;
  const consentRef = useRef<HTMLDivElement>(null);

  const clickAway = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();

      const target = event.target as Element;

      if (consentRef.current !== null) {
        if (!consentRef.current.contains(target)) {
          handleListConsentOpen(false);
        }
      }
    },
    [handleListConsentOpen]
  );

  const deleteList = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await http.delete(`/lists/${listId}/`);
      removeList(listId);
      handleListConsentOpen(false);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        handleListConsentOpen(false);
        console.log(error.response);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('click', clickAway);
    return () => window.addEventListener('click', clickAway);
  }, [clickAway]);

  return (
    <div ref={consentRef} className="list-consent-container">
      <p>Once you delete this list all cards inside this list will also be deleted.</p>
      <div className="list-consent-btn-container">
        <button onClick={deleteList}>Delete</button>
        <button onClick={() => handleListConsentOpen(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default ListConsent;
