import { IBackground, ITokens, IUser } from '.';

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
