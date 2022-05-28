import { IBackground, ISpaceFull, ISpaceMin, ITokens, IUser } from '.';

export interface ICreateSpaceResponse {
  space: ISpaceMin;
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
}
