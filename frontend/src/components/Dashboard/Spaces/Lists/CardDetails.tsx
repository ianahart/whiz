import { AxiosError } from 'axios';
import { useEffect, useCallback, useState } from 'react';
import { AiOutlineClockCircle, AiOutlineClose } from 'react-icons/ai';
import { BsCardHeading, BsTextCenter, BsTrash } from 'react-icons/bs';
import { initialCardDetailsState } from '../../../../helpers/initialState';
import { http } from '../../../../helpers/utils';
import { ICardDetails } from '../../../../interfaces';
import { ICardDetailsResponse } from '../../../../interfaces/response';
import '../../../../styles/Card.scss';
import CardDescription from './CardDescription';
import CardDetailsOptions from './CardDetailsOptions';

export interface ICardDetailsProps {
  closeModal: () => void;
  activeCard: number | null;
  handleRemoveCard: (id: number) => void;
}

const CardDetails = ({ closeModal, activeCard, handleRemoveCard }: ICardDetailsProps) => {
  const [details, setDetails] = useState<ICardDetails>(initialCardDetailsState);
  const [error, setError] = useState('');
  const [desc, setDesc] = useState('');
  const [descIsOpen, setDescIsOpen] = useState(false);

  const handleDescOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(event.target.value);
  };

  const fetchCardDetails = useCallback(async () => {
    try {
      if (activeCard === null) return;
      const response = await http.get<ICardDetailsResponse>(`/cards/${activeCard}/`);
      setDetails(response.data.card);
      setDesc(response.data.card.details);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
      }
    }
  }, [activeCard]);

  const close = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    closeModal();
  };

  const removeCard = async () => {
    try {
      if (!details) return;
      const response = await http.delete(`/cards/${details.id}/`);
      handleRemoveCard(details.id);
      closeModal();
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        setError(error.response.data.error);
      }
    }
  };

  useEffect(() => {
    fetchCardDetails();
  }, [fetchCardDetails]);

  const cancelDesc = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    await fetchCardDetails();
    setDescIsOpen(false);
  };

  const saveDesc = async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      event.stopPropagation();
      const response = await http.patch(`/cards/${details.id}/`, {
        details: { ...details, details: desc },
      });
      setDescIsOpen(false);
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        setError(error.response.data.errors.details[0]);
      }
    }
  };

  const handleDescIsOpen = (bool: boolean) => setDescIsOpen(bool);

  return (
    <div className="list-inner-modal">
      <div className="card-details-header">
        <div className="card-details-title">
          <BsCardHeading />
          <p>{details?.text}e</p>
        </div>
        <div onClick={close}>
          <AiOutlineClose />
        </div>
      </div>
      <div className="card-details-list-title">
        In list <span>{details?.list_title}</span>
      </div>

      <div className="card-details-description-title">
        <BsTextCenter />
        <p>Description</p>
      </div>
      <main className="card-details-main">
        <CardDescription
          descIsOpen={descIsOpen}
          saveDesc={saveDesc}
          cancelDesc={cancelDesc}
          handleDescIsOpen={handleDescIsOpen}
          handleDescOnChange={handleDescOnChange}
          error={error}
          desc={desc}
        />
        <CardDetailsOptions removeCard={removeCard} />
      </main>
    </div>
  );
};

export default CardDetails;
