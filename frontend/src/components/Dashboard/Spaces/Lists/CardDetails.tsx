import { AxiosError } from 'axios';
import { useEffect, useCallback, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BsCardHeading, BsTextCenter } from 'react-icons/bs';
import { initialCardDetailsState } from '../../../../helpers/initialState';
import { http } from '../../../../helpers/utils';
import { ICardDetails, ICheckList, ICheckListItem } from '../../../../interfaces';
import { ICardDetailsResponse } from '../../../../interfaces/response';
import '../../../../styles/Card.scss';
import Activity from './Activity';
import CardDescription from './CardDescription';
import CardDetailsOptions from './CardDetailsOptions';
import { CalendarDate } from '../../../../types/';
import Checklist from './Checklist';

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
  const [dates, setDates] = useState<CalendarDate>();
  const [descIsOpen, setDescIsOpen] = useState(false);
  const [colorLabelClosed, setColorLabelClosed] = useState(false);
  const [datesIsOpen, setDatesIsOpen] = useState(false);
  const [rerender, setRerender] = useState(false);

  const handleDescOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDesc(event.target.value);
  };

  const handlererender = () => setRerender(!rerender);
  const openColorLabel = () => setColorLabelClosed(true);
  const closeColorLabel = () => setColorLabelClosed(false);
  const handleDescIsOpen = (bool: boolean) => setDescIsOpen(bool);
  const handleSetDateIsOpen = (bool: boolean) => setDatesIsOpen(bool);

  const handleDateChange = async (value: any) => {
    setDates(value);
    const [start, end] = value;
    const response = await http.patch(`/cards/${details.id}/`, {
      details: { ...details, start_date: start, end_date: end },
    });
    await fetchCardDetails();
    fetchCards();
  };

  const addCheckList = (checklist: ICheckList) => {
    setDetails((prevState) => ({
      ...prevState,
      card_checklists: [...prevState.card_checklists, checklist],
    }));
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

  const update = async (event: React.MouseEvent<HTMLButtonElement>) => {
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

  const addChecklistItem = (item: ICheckListItem) => {
    const updated = details.card_checklists.map((checklist) => {
      if (checklist.id === item.checklist) {
        const items = [...checklist.checklist_checklist_items, item];
        checklist.checklist_checklist_items = items;
      }
      return checklist;
    });

    setDetails((prevState) => ({
      ...prevState,
      card_checklists: [...updated],
    }));
  };

  const updateChecklistItem = (checked: boolean, item: ICheckListItem) => {
    try {
      const response = http.patch(`/checklists/items/${item.id}/`, {
        is_complete: checked,
      });

      const updated = details.card_checklists.map((checklist) => {
        if (checklist.id === item.checklist) {
          const listItems = checklist.checklist_checklist_items.map((listItem) => {
            if (listItem.id === item.id) {
              return { ...listItem, is_complete: checked };
            } else {
              return listItem;
            }
          });
          checklist.checklist_checklist_items = listItems;
        }
        return checklist;
      });
      setDetails((prevState) => ({
        ...prevState,
        card_checklists: [...updated],
      }));
      handlererender();
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        return;
      }
    }
  };

  const removeChecklist = async (id: number) => {
    try {
      await http.delete(`/checklists/${id}/`);
      console.log(details.card_checklists);
      setDetails((prevState) => ({
        ...prevState,
        card_checklists: prevState.card_checklists.filter((list) => list.id !== id),
      }));
    } catch (error: unknown | AxiosError) {
      if (error instanceof AxiosError && error.response) {
        console.log(error.response);
      }
    }
  };

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
        <p>{details.date_range}</p>
      </div>

      <div className="card-details-description-title">
        <BsTextCenter />
        <p>Description</p>
      </div>
      <main className="card-details-main">
        <CardDescription
          descIsOpen={descIsOpen}
          update={update}
          cancelDesc={cancelDesc}
          handleDescIsOpen={handleDescIsOpen}
          handleDescOnChange={handleDescOnChange}
          error={error}
          desc={desc}
        />
        <CardDetailsOptions
          dates={dates}
          card={details}
          removeCard={removeCard}
          datesIsOpen={datesIsOpen}
          hasButton={true}
          changeLabel={changeLabel}
          openColorLabel={openColorLabel}
          handleSetLabel={handleSetLabel}
          closeColorLabel={closeColorLabel}
          colorLabelClosed={colorLabelClosed}
          handleSetDateIsOpen={handleSetDateIsOpen}
          handleDateChange={handleDateChange}
          addCheckList={addCheckList}
        />
      </main>
      <Activity listTitle={details.list_title} readableDate={details.readable_date} />
      <div>
        {details.card_checklists.map((checklist) => {
          return (
            <Checklist
              addChecklistItem={addChecklistItem}
              updateChecklistItem={updateChecklistItem}
              key={checklist.id}
              checklist={checklist}
              removeChecklist={removeChecklist}
              rerender={rerender}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CardDetails;
