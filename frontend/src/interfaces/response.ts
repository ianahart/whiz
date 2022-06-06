import {
  ICard,
  IBackground,
  IList,
  ISpaceFull,
  ISpaceMin,
  ITokens,
  IUser,
  ICardDetails,
  ICheckList,
} from '.';

export interface ICreateChecklistResponse {
  message?: string;
  checklist: ICheckList;
}

export interface ICardDetailsResponse {
  message?: string;
  card: ICardDetails;
}

export interface ICreateListResponse {
  list: IList;
}

export interface ICreateSpaceResponse {
  space: ISpaceMin;
}

export interface ICreateCardResponse {
  card: ICard;
}

export interface ILoginResponse {
  message?: string;
  tokens: ITokens;
  user: IUser;
}

export interface IStoreUserResponse {
  message?: string;
  user: IUser;
}

export interface IBackgroundResponse {
  message?: string;
  page: number;
  backgrounds: IBackground[];
}

export interface IRetreiveSpaceResponse {
  message?: string;
  space: ISpaceFull;
  lists: IList[];
}

export interface ISpacesResponse {
  message?: string;
  page: number;
  has_next: boolean;
  spaces: ISpaceMin[];
}

export interface ICardsResponse {
  message?: string;
  cards: ICard[];
}
