import { ITokens, IUser } from '.';

export interface ILoginResponse {
  message?: string;
  tokens: ITokens;
  user: IUser;
}

export interface IStoreUserResponse {
  message?: string;
  user: IUser;
}
