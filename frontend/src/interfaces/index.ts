export interface IList {
  id: number;
  space: number;
  title: string;
  user: number;
}

export interface IBackground {
  id: number;
  src: string;
  thumbnail: string;
}

export interface ISpaceMin {
  id: number | null;
  title: string;
  color: string | null;
  background: string | null;
  has_background: boolean;
  thumbnail: string | null;
}

export interface ISpaceFull {
  id: number | null;
  title: string;
  color: string | null;
  background: string | null;
  has_background: boolean;
  thumbnail: string | null;
}

export interface ICreateAccountForm {
  first_name: {
    name: string;
    error: string;
    value: string;
    placeholder: string;
    type: string;
  };
  last_name: {
    name: string;
    error: string;
    value: string;
    placeholder: string;
    type: string;
  };
  email: {
    name: string;
    error: string;
    value: string;
    placeholder: string;
    type: string;
  };
  password: {
    name: string;
    error: string;
    value: string;
    placeholder: string;
    type: string;
  };
  confirm_password: {
    name: string;
    error: string;
    value: string;
    placeholder: string;
    type: string;
  };
}

export interface ILoginForm {
  email: {
    name: string;
    error: string;
    value: string;
    placeholder: string;
    type: string;
  };
  password: {
    name: string;
    error: string;
    value: string;
    placeholder: string;
    type: string;
  };
}

export interface ICreateAccountBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  password_strength: string;
}

export interface IUser {
  avatar_url: string | null;
  email: string;
  first_name: string;
  id?: number | null;
  initials: string;
  logged_in: boolean;
  full_name: string;
}

export interface ITokens {
  access_token: string;
  refresh_token: string;
}

export interface IUserContext {
  user: IUser;
  tokens: ITokens;
  setUser: (user: IUser) => void;
  setTokens: (tokens: ITokens) => void;
  syncTokens: (tokens: ITokens) => void;
  logout: () => void;
}

export interface INavigationContext {
  activeMenuItem: string;
  setActiveMenuItem: (activeMenuItem: string) => void;
}

export interface ISpaceContext {
  space: ISpaceFull;
  setSpace: (space: ISpaceFull) => void;
  addList: (list: IList) => void;
  lists: IList[];
  setLists: (lists: IList[]) => void;
}
