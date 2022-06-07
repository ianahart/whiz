export interface IPasswords {
  new_password: { value: '' };
  confirm_password: { value: '' };
}

export interface IList {
  id: number;
  space: number;
  title: string;
  cards: ICard[];
  user: number;
  x_coordinate: number;
  y_coordinate: number;
}

export interface ICard {
  color: string;
  label: string;
  list: number;
  text: string;
  user: number;
  id: number;
  start_date: Date;
  end_date: Date;
  details: string;
  date_range: string;
}

export interface ICheckListItem {
  id: number;
  user: number;
  card: number;
  checklist: number;
  is_complete: boolean;
  title: string;
}

export interface ICheckList {
  title: string;
  is_completed: false;
  user: number;
  card: number;
  id: number;
  checklist_checklist_items: ICheckListItem[];
}

export interface ICardDetails extends ICard {
  list_title: string;
  created_at: Date;
  readable_date: string;
  card_checklists: ICheckList[];
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
  is_starred: boolean;
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
  updateTitle: (title: string) => void;
  updateListTitle: (title: string, id: number) => void;
  addCardToList: (card: ICard) => void;
  removeCard: (card_id: number, list_id: number) => void;
  fetchSpace: (id: number, title: string) => void;
  removeList: (id: number) => void;
  updateStarredSpace: (IsStarred: boolean) => void;
}
