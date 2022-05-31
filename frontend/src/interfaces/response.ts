import { ICard, IBackground, IList, ISpaceFull, ISpaceMin, ITokens, IUser } from '.';

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

export interface ISpacesDropdownResponse {
  message?: string;
  page: number;
  has_next: boolean;
  spaces: ISpaceMin[];
}
