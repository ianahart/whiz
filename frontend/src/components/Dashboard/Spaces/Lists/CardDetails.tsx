import { AxiosError } from 'axios';
import { debounce } from 'lodash';
import { useEffect, useCallback, useState, useMemo } from 'react';
import { AiOutlineClockCircle, AiOutlineClose } from 'react-icons/ai';
import { BsCardHeading, BsTextCenter, BsTrash } from 'react-icons/bs';
import { initialCardDetailsState } from '../../../../helpers/initialState';
import { http } from '../../../../helpers/utils';
import { ICardDetails } from '../../../../interfaces';
import { ICardDetailsResponse } from '../../../../interfaces/response';
import '../../../../styles/Card.scss';
import Activity from './Activity';
import CardDescription from './CardDescription';
import CardDetailsOptions from './CardDetailsOptions';

export interface ICardDetailsProps {
  closeModal: () => void;
  activeCard: number | null;
  handleRemoveCard: (id: number) => void;
  fetchCards: () => void;
}

const CardDetails = ({
  fetchCards,
  closeModal,
  activeCard,
  handleRemoveCard,
}: ICardDetailsProps) => {
  const [details, setDetails] = useState<ICardDetails>(initialCardDetailsState);
  const [error, setError] = useState('');
  const [desc, setDesc] = useState('');
  const [descIsOpen, setDescIsOpen] = useState(false);
  const [colorLabelClosed, setColorLabelClosed] = useState(false);
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

  const changeLabel = async () => {
    try {
      const response = await http.patch(`/cards/${details.id}/`, {
        details: { ...details, details: desc },
      });
      closeColorLabel();
      fetchCards();
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        setError(error.response.data.errors.details[0]);
      }
    }
  };
  const handleSetLabel = (color: string, value: string) => {
    setDetails((prevState) => ({
      ...prevState,
      color,
      label: value,
    }));
  };
  const openColorLabel = () => setColorLabelClosed(true);
  const closeColorLabel = () => setColorLabelClosed(false);
  const handleDescIsOpen = (bool: boolean) => setDescIsOpen(bool);

  return (
    <div className="list-inner-modal">
      <div className="card-details-header">
        <div className="card-details-title">
          <BsCardHeading />
          <p>{details?.text}</p>
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
        <CardDetailsOptions
          removeCard={removeCard}
          hasButton={true}
          changeLabel={changeLabel}
          openColorLabel={openColorLabel}
          handleSetLabel={handleSetLabel}
          closeColorLabel={closeColorLabel}
          colorLabelClosed={colorLabelClosed}
        />
      </main>
      <Activity listTitle={details.list_title} readableDate={details.readable_date} />
    </div>
  );
};

export default CardDetails;
